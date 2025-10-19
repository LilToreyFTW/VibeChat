import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const tiers = {
      'FREE': {
        name: 'Free Tier',
        price: 0,
        features: 'Basic chat features',
        streamingQuality: '720p',
        maxUsers: 10,
        isActive: true
      },
      'BOOST_PLUS_TIER_2': {
        name: 'BOOST+ Tier 2',
        price: 8.99,
        features: 'Stream screen at 1920x1080p 60FPS - Monthly $8.99 / One-time $15.99',
        streamingQuality: '1080p',
        maxUsers: 50,
        isActive: true
      },
      'BOOST_PLUS_TIER_3': {
        name: 'BOOST+ Tier 3',
        price: 12.99,
        features: 'Stream screen at 2160x1080 60FPS - Monthly $12.99 / One-time $25.99',
        streamingQuality: '1440p',
        maxUsers: 100,
        isActive: true
      },
      'BOOST_PLUS_TIER_4': {
        name: 'BOOST+ Tier 4',
        price: 25.99,
        features: 'Stream screen at 2160x1080 60FPS/4K - Monthly $25.99 / One-time $100.99',
        streamingQuality: '4K',
        maxUsers: 200,
        isActive: true
      },
      'BOOST_PLUS_TIER_5': {
        name: 'BOOST+ Tier 5',
        price: 30.99,
        features: 'Stream screen at 3860x1440p 60fps with NVIDIA GeForce RTX 30/40/50 series GPU auto detection - Monthly $30.99 / One-time $350.99',
        streamingQuality: 'Ultrawide',
        maxUsers: 500,
        isActive: true
      }
    };

    return NextResponse.json({
      success: true,
      data: tiers,
      message: 'Subscription tiers retrieved successfully'
    });

  } catch (error) {
    console.error('Subscription tiers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve subscription tiers' },
      { status: 500 }
    );
  }
}
