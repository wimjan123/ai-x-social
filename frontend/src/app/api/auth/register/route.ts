import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be at most 50 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input data',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, email, password, displayName } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.userAccount.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return NextResponse.json(
        {
          success: false,
          message: `User with this ${field} already exists`,
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user account with profile
    const user = await prisma.userAccount.create({
      data: {
        username,
        email,
        passwordHash,
        profile: {
          create: {
            displayName,
            personaType: 'POLITICIAN', // Default, can be changed later
            specialtyAreas: [],
            followerCount: 0,
            followingCount: 0,
            postCount: 0,
          },
        },
        politicalAlignment: {
          create: {
            economicPosition: 50, // Default center position
            socialPosition: 50,
            primaryIssues: [],
            ideologyTags: [],
            debateWillingness: 50,
            controversyTolerance: 50,
          },
        },
        influenceMetrics: {
          create: {
            followerCount: 0,
            followingCount: 0,
            engagementRate: 0,
            reachScore: 0,
            approvalRating: 50,
            controversyLevel: 0,
            trendingScore: 0,
            followerGrowthDaily: 0,
            followerGrowthWeekly: 0,
            followerGrowthMonthly: 0,
            totalLikes: 0,
            totalReshares: 0,
            totalComments: 0,
            influenceRank: 0,
            categoryRank: 0,
          },
        },
        settings: {
          create: {
            newsRegion: 'WORLDWIDE',
            newsCategories: ['POLITICS', 'WORLD'],
            newsLanguages: ['en'],
            aiChatterLevel: 50,
            aiPersonalities: [],
            aiResponseTone: 'PROFESSIONAL',
            emailNotifications: true,
            pushNotifications: true,
            notificationCategories: ['MENTIONS', 'REPLIES', 'LIKES'],
            profileVisibility: 'PUBLIC',
            allowPersonaInteractions: true,
            allowDataForAI: true,
            theme: 'AUTO',
            language: 'en',
            timezone: 'UTC',
          },
        },
      },
      include: {
        profile: true,
        politicalAlignment: true,
        influenceMetrics: true,
        settings: true,
      },
    });

    // Remove sensitive data before returning
    const { passwordHash: _, ...userResponse } = user;

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: userResponse,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during registration',
      },
      { status: 500 }
    );
  }
}