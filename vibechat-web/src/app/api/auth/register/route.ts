import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, fullName } = body;

    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { success: false, message: 'Username, email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Basic validation
    if (username.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Generate unique user ID
    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Create user account (in a real app, this would be stored in a database)
    const newUser = {
      id: userId,
      username,
      email,
      fullName,
      isVerified: false,
      subscriptionTier: 'FREE',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Generate verification token
    const verificationToken = Buffer.from(JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');

    // In a real application, you would:
    // 1. Store the user in a database
    // 2. Send a verification email with the token
    // 3. Store the verification token with expiration

    console.log('🔐 New user registered:', newUser.username);
    console.log('📧 Verification token generated:', verificationToken);

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        isVerified: false,
        subscriptionTier: newUser.subscriptionTier,
        createdAt: newUser.createdAt
      },
      message: 'Account created successfully. Please check your email for verification instructions.',
      verificationToken: verificationToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
