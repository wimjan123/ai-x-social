-- AI Social Media Platform - Database Initialization Script
-- PostgreSQL 16 setup for Docker environment
-- This script runs automatically when the container starts for the first time

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom indexes for performance optimization
-- These will be applied after Prisma migrations run

-- Performance indexes for frequent queries
-- Note: These are in addition to Prisma-generated indexes

DO $$
BEGIN
    -- Check if database has been initialized by Prisma
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_accounts') THEN

        -- User account performance indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_accounts_email_active
        ON user_accounts(email) WHERE is_active = true;

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_accounts_username_lower
        ON user_accounts(LOWER(username));

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_accounts_last_login
        ON user_accounts(last_login_at) WHERE last_login_at IS NOT NULL;

        -- Post performance indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_created_at_desc
        ON posts(created_at DESC);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_created
        ON posts(user_id, created_at DESC);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_text_search
        ON posts USING gin(to_tsvector('english', content));

        -- Reaction performance indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reactions_post_type
        ON reactions(post_id, reaction_type);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reactions_user_post
        ON reactions(user_id, post_id);

        -- Follow relationship indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_follower_following
        ON follows(follower_id, following_id);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_following_follower
        ON follows(following_id, follower_id);

        -- AI persona indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_personas_active
        ON ai_personas(is_active) WHERE is_active = true;

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_personas_political_alignment
        ON ai_personas(political_alignment);

        -- News article indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_published_desc
        ON news_articles(published_at DESC);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_category
        ON news_articles(category);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_title_search
        ON news_articles USING gin(to_tsvector('english', title));

        -- Trend indexes
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trends_score_desc
        ON trends(trend_score DESC);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trends_created_desc
        ON trends(created_at DESC);

        RAISE NOTICE 'Performance indexes created successfully';
    ELSE
        RAISE NOTICE 'Database not yet initialized by Prisma - indexes will be created later';
    END IF;
END
$$;

-- Create database functions for common operations

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate user influence score
CREATE OR REPLACE FUNCTION calculate_influence_score(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    follower_count INTEGER;
    post_count INTEGER;
    reaction_count INTEGER;
    influence_score INTEGER;
BEGIN
    -- Get follower count
    SELECT COUNT(*) INTO follower_count
    FROM follows
    WHERE following_id = user_id_param;

    -- Get post count (last 30 days)
    SELECT COUNT(*) INTO post_count
    FROM posts
    WHERE user_id = user_id_param
    AND created_at > CURRENT_TIMESTAMP - INTERVAL '30 days';

    -- Get reaction count (last 30 days)
    SELECT COUNT(*) INTO reaction_count
    FROM reactions r
    JOIN posts p ON r.post_id = p.id
    WHERE p.user_id = user_id_param
    AND r.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days';

    -- Calculate influence score
    influence_score := (follower_count * 10) + (post_count * 5) + (reaction_count * 2);

    RETURN influence_score;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending topics
CREATE OR REPLACE FUNCTION get_trending_topics(limit_param INTEGER DEFAULT 10)
RETURNS TABLE(
    topic VARCHAR(100),
    mention_count BIGINT,
    trend_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.topic,
        t.mention_count,
        t.trend_score
    FROM trends t
    WHERE t.created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'
    ORDER BY t.trend_score DESC, t.mention_count DESC
    LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Create materialized views for performance

-- User activity summary view
CREATE MATERIALIZED VIEW IF NOT EXISTS user_activity_summary AS
SELECT
    ua.id as user_id,
    ua.username,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT f1.id) as follower_count,
    COUNT(DISTINCT f2.id) as following_count,
    COUNT(DISTINCT r.id) as reaction_count,
    COALESCE(im.follower_count, 0) as influence_follower_count,
    COALESCE(im.influence_score, 0) as influence_score
FROM user_accounts ua
LEFT JOIN posts p ON ua.id = p.user_id
LEFT JOIN follows f1 ON ua.id = f1.following_id
LEFT JOIN follows f2 ON ua.id = f2.follower_id
LEFT JOIN reactions r ON ua.id = r.user_id
LEFT JOIN influence_metrics im ON ua.id = im.user_id
WHERE ua.is_active = true
GROUP BY ua.id, ua.username, im.follower_count, im.influence_score;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_summary_user_id
ON user_activity_summary(user_id);

-- Daily metrics summary view
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_metrics_summary AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_posts,
    COUNT(DISTINCT user_id) as active_users,
    AVG(LENGTH(content)) as avg_post_length
FROM posts
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create refresh functions for materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_activity_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics_summary;
    RAISE NOTICE 'Materialized views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job to refresh materialized views (if pg_cron is available)
-- This would typically be set up separately in production
-- SELECT cron.schedule('refresh-views', '0 */6 * * *', 'SELECT refresh_materialized_views();');

-- Database maintenance functions

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Clean up old trends (older than 7 days)
    DELETE FROM trends
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days';

    -- Clean up old news articles (older than 30 days)
    DELETE FROM news_articles
    WHERE published_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

    -- Clean up unverified accounts (older than 30 days)
    DELETE FROM user_accounts
    WHERE email_verified = false
    AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

    RAISE NOTICE 'Old data cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for application user
-- Note: This assumes the application user already exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'ai_social_user') THEN
        -- Grant necessary permissions
        GRANT USAGE ON SCHEMA public TO ai_social_user;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ai_social_user;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ai_social_user;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ai_social_user;

        -- Grant permissions on materialized views
        GRANT SELECT ON user_activity_summary TO ai_social_user;
        GRANT SELECT ON daily_metrics_summary TO ai_social_user;

        RAISE NOTICE 'Permissions granted to ai_social_user';
    END IF;
END
$$;

-- Log initialization completion
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;

-- Final initialization log
DO $$
BEGIN
    RAISE NOTICE 'AI Social Media Platform database initialization completed successfully';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'User: %', current_user;
    RAISE NOTICE 'Timestamp: %', CURRENT_TIMESTAMP;
END
$$;