
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserAccountScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  passwordHash: 'passwordHash',
  emailVerified: 'emailVerified',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  displayName: 'displayName',
  bio: 'bio',
  profileImageUrl: 'profileImageUrl',
  headerImageUrl: 'headerImageUrl',
  location: 'location',
  website: 'website',
  personaType: 'personaType',
  specialtyAreas: 'specialtyAreas',
  verificationBadge: 'verificationBadge',
  followerCount: 'followerCount',
  followingCount: 'followingCount',
  postCount: 'postCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PoliticalAlignmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  economicPosition: 'economicPosition',
  socialPosition: 'socialPosition',
  primaryIssues: 'primaryIssues',
  partyAffiliation: 'partyAffiliation',
  ideologyTags: 'ideologyTags',
  debateWillingness: 'debateWillingness',
  controversyTolerance: 'controversyTolerance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluenceMetricsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  followerCount: 'followerCount',
  followingCount: 'followingCount',
  engagementRate: 'engagementRate',
  reachScore: 'reachScore',
  approvalRating: 'approvalRating',
  controversyLevel: 'controversyLevel',
  trendingScore: 'trendingScore',
  followerGrowthDaily: 'followerGrowthDaily',
  followerGrowthWeekly: 'followerGrowthWeekly',
  followerGrowthMonthly: 'followerGrowthMonthly',
  totalLikes: 'totalLikes',
  totalReshares: 'totalReshares',
  totalComments: 'totalComments',
  influenceRank: 'influenceRank',
  categoryRank: 'categoryRank',
  lastUpdated: 'lastUpdated',
  createdAt: 'createdAt'
};

exports.Prisma.SettingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  newsRegion: 'newsRegion',
  newsCategories: 'newsCategories',
  newsLanguages: 'newsLanguages',
  aiChatterLevel: 'aiChatterLevel',
  aiPersonalities: 'aiPersonalities',
  aiResponseTone: 'aiResponseTone',
  emailNotifications: 'emailNotifications',
  pushNotifications: 'pushNotifications',
  notificationCategories: 'notificationCategories',
  profileVisibility: 'profileVisibility',
  allowPersonaInteractions: 'allowPersonaInteractions',
  allowDataForAI: 'allowDataForAI',
  theme: 'theme',
  language: 'language',
  timezone: 'timezone',
  customAIApiKey: 'customAIApiKey',
  customAIBaseUrl: 'customAIBaseUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  personaId: 'personaId',
  content: 'content',
  mediaUrls: 'mediaUrls',
  linkPreview: 'linkPreview',
  threadId: 'threadId',
  parentPostId: 'parentPostId',
  repostOfId: 'repostOfId',
  isAIGenerated: 'isAIGenerated',
  hashtags: 'hashtags',
  mentions: 'mentions',
  newsItemId: 'newsItemId',
  newsContext: 'newsContext',
  likeCount: 'likeCount',
  repostCount: 'repostCount',
  commentCount: 'commentCount',
  impressionCount: 'impressionCount',
  contentWarning: 'contentWarning',
  isHidden: 'isHidden',
  reportCount: 'reportCount',
  publishedAt: 'publishedAt',
  editedAt: 'editedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ThreadScalarFieldEnum = {
  id: 'id',
  originalPostId: 'originalPostId',
  title: 'title',
  participantCount: 'participantCount',
  postCount: 'postCount',
  maxDepth: 'maxDepth',
  totalLikes: 'totalLikes',
  totalReshares: 'totalReshares',
  lastActivityAt: 'lastActivityAt',
  isLocked: 'isLocked',
  isHidden: 'isHidden',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  postId: 'postId',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.PersonaScalarFieldEnum = {
  id: 'id',
  name: 'name',
  handle: 'handle',
  bio: 'bio',
  profileImageUrl: 'profileImageUrl',
  personaType: 'personaType',
  personalityTraits: 'personalityTraits',
  interests: 'interests',
  expertise: 'expertise',
  toneStyle: 'toneStyle',
  controversyTolerance: 'controversyTolerance',
  engagementFrequency: 'engagementFrequency',
  debateAggression: 'debateAggression',
  politicalAlignmentId: 'politicalAlignmentId',
  aiProvider: 'aiProvider',
  systemPrompt: 'systemPrompt',
  contextWindow: 'contextWindow',
  postingSchedule: 'postingSchedule',
  timezonePreference: 'timezonePreference',
  isActive: 'isActive',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NewsItemScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  url: 'url',
  sourceName: 'sourceName',
  sourceUrl: 'sourceUrl',
  author: 'author',
  category: 'category',
  topics: 'topics',
  keywords: 'keywords',
  entities: 'entities',
  country: 'country',
  region: 'region',
  language: 'language',
  sentimentScore: 'sentimentScore',
  impactScore: 'impactScore',
  controversyScore: 'controversyScore',
  publishedAt: 'publishedAt',
  discoveredAt: 'discoveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  aiSummary: 'aiSummary',
  topicTags: 'topicTags'
};

exports.Prisma.TrendScalarFieldEnum = {
  id: 'id',
  hashtag: 'hashtag',
  keyword: 'keyword',
  topic: 'topic',
  postCount: 'postCount',
  uniqueUsers: 'uniqueUsers',
  impressionCount: 'impressionCount',
  engagementCount: 'engagementCount',
  trendScore: 'trendScore',
  velocity: 'velocity',
  peakTime: 'peakTime',
  category: 'category',
  region: 'region',
  language: 'language',
  isPromoted: 'isPromoted',
  isHidden: 'isHidden',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  lastUpdated: 'lastUpdated',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.PersonaType = exports.$Enums.PersonaType = {
  POLITICIAN: 'POLITICIAN',
  INFLUENCER: 'INFLUENCER',
  JOURNALIST: 'JOURNALIST',
  ACTIVIST: 'ACTIVIST',
  BUSINESS: 'BUSINESS',
  ENTERTAINER: 'ENTERTAINER'
};

exports.ToneStyle = exports.$Enums.ToneStyle = {
  PROFESSIONAL: 'PROFESSIONAL',
  CASUAL: 'CASUAL',
  HUMOROUS: 'HUMOROUS',
  SERIOUS: 'SERIOUS',
  SARCASTIC: 'SARCASTIC',
  EMPATHETIC: 'EMPATHETIC'
};

exports.ProfileVisibility = exports.$Enums.ProfileVisibility = {
  PUBLIC: 'PUBLIC',
  FOLLOWERS_ONLY: 'FOLLOWERS_ONLY',
  PRIVATE: 'PRIVATE'
};

exports.Theme = exports.$Enums.Theme = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  AUTO: 'AUTO'
};

exports.NewsCategory = exports.$Enums.NewsCategory = {
  POLITICS: 'POLITICS',
  BUSINESS: 'BUSINESS',
  TECHNOLOGY: 'TECHNOLOGY',
  SPORTS: 'SPORTS',
  ENTERTAINMENT: 'ENTERTAINMENT',
  HEALTH: 'HEALTH',
  SCIENCE: 'SCIENCE',
  WORLD: 'WORLD',
  LOCAL: 'LOCAL'
};

exports.NotificationCategory = exports.$Enums.NotificationCategory = {
  MENTIONS: 'MENTIONS',
  REPLIES: 'REPLIES',
  LIKES: 'LIKES',
  REPOSTS: 'REPOSTS',
  FOLLOWERS: 'FOLLOWERS',
  NEWS_ALERTS: 'NEWS_ALERTS',
  PERSONA_INTERACTIONS: 'PERSONA_INTERACTIONS'
};

exports.ReactionType = exports.$Enums.ReactionType = {
  LIKE: 'LIKE',
  REPOST: 'REPOST',
  BOOKMARK: 'BOOKMARK',
  REPORT: 'REPORT'
};

exports.TrendCategory = exports.$Enums.TrendCategory = {
  BREAKING_NEWS: 'BREAKING_NEWS',
  POLITICS: 'POLITICS',
  ENTERTAINMENT: 'ENTERTAINMENT',
  SPORTS: 'SPORTS',
  TECHNOLOGY: 'TECHNOLOGY',
  MEME: 'MEME',
  HASHTAG_GAME: 'HASHTAG_GAME',
  OTHER: 'OTHER'
};

exports.Prisma.ModelName = {
  UserAccount: 'UserAccount',
  UserProfile: 'UserProfile',
  PoliticalAlignment: 'PoliticalAlignment',
  InfluenceMetrics: 'InfluenceMetrics',
  Settings: 'Settings',
  Post: 'Post',
  Thread: 'Thread',
  Reaction: 'Reaction',
  Persona: 'Persona',
  NewsItem: 'NewsItem',
  Trend: 'Trend'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
