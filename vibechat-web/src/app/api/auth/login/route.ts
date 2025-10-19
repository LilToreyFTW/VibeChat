import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Mock authentication (in a real app, this would check against a database)
    // For demo purposes, accept any valid-looking credentials
    if (username.length >= 3 && password.length >= 6) {
      const user = {
        id: 'user-' + Date.now(),
        username,
        email: `${username}@example.com`,
        fullName: `${username} User`,
        isVerified: true,
        subscriptionTier: 'FREE',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Generate JWT-like token (in a real app, this would be a proper JWT)
      const token = Buffer.from(JSON.stringify({
        userId: user.id,
        username: user.username,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })).toString('base64');

      console.log('🔑 User logged in:', username);

      return NextResponse.json({
        success: true,
        data: {
          accessToken: token,
          user: user
        },
        message: 'Login successful'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
