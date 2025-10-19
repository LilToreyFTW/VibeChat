import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Decode and validate the token (in a real app, this would check against database)
    try {
      const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString());

      // Check if token is expired
      if (decodedToken.exp < Date.now()) {
        return NextResponse.json(
          { success: false, message: 'Verification token has expired' },
          { status: 401 }
        );
      }

      // Mock user verification (in a real app, this would update the database)
      const verifiedUser = {
        id: decodedToken.userId,
        username: 'VerifiedUser',
        email: decodedToken.email,
        isVerified: true,
        subscriptionTier: 'FREE',
        verifiedAt: new Date().toISOString()
      };

      console.log('✅ Email verified for user:', verifiedUser.email);

      return NextResponse.json({
        success: true,
        data: verifiedUser,
        message: 'Email verified successfully! You can now log in to your account.'
      });

    } catch (tokenError) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Email verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Decode and validate the token
    try {
      const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString());

      // Check if token is expired
      if (decodedToken.exp < Date.now()) {
        return NextResponse.json(
          { success: false, message: 'Verification token has expired' },
          { status: 401 }
        );
      }

      // Mock verification success response
      console.log('✅ Email verified via GET for user:', decodedToken.email);

      // Redirect to success page with token
      return NextResponse.redirect(
        new URL(`/auth/verify-success?token=${token}`, request.url)
      );

    } catch (tokenError) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Email verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
