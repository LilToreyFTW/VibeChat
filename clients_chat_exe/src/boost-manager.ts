// VibeChat Boost Tier Manager
import { BoostTier } from '../types/vibechat';

export class BoostManager {
  private boostTiers: Map<string, BoostTier> = new Map();

  constructor() {
    this.initializeBoostTiers();
  }

  private initializeBoostTiers(): void {
    // Free Tier
    this.boostTiers.set('FREE', {
      id: 'FREE',
      name: 'Free Tier',
      price: 0,
      features: [
        'Basic chat features',
        '720p streaming at 30fps',
        'Up to 10 users per room',
        'Standard support'
      ],
      streamingQuality: '720p@30fps',
      maxUsers: 10,
      isActive: true
    });

    // Boost+ Tier 2
    this.boostTiers.set('BOOST_PLUS_TIER_2', {
      id: 'BOOST_PLUS_TIER_2',
      name: 'BOOST+ Tier 2',
      price: 8.99,
      features: [
        'Stream screen at 1920x1080p 60FPS',
        'Monthly $8.99 / One-time $15.99',
        'Up to 50 users per room',
        'Priority support',
        'Custom room themes'
      ],
      streamingQuality: '1080p@60fps',
      maxUsers: 50,
      isActive: true
    });

    // Boost+ Tier 3
    this.boostTiers.set('BOOST_PLUS_TIER_3', {
      id: 'BOOST_PLUS_TIER_3',
      name: 'BOOST+ Tier 3',
      price: 12.99,
      features: [
        'Stream screen at 2160x1080 60FPS',
        'Monthly $12.99 / One-time $25.99',
        'Up to 100 users per room',
        'Premium support',
        'Advanced room customization',
        'Screen recording features'
      ],
      streamingQuality: '1440p@60fps',
      maxUsers: 100,
      isActive: true
    });

    // Boost+ Tier 4
    this.boostTiers.set('BOOST_PLUS_TIER_4', {
      id: 'BOOST_PLUS_TIER_4',
      name: 'BOOST+ Tier 4',
      price: 25.99,
      features: [
        'Stream screen at 2160x1080 60FPS/4K',
        'Monthly $25.99 / One-time $100.99',
        'Up to 250 users per room',
        'VIP support',
        'Full room customization',
        'Advanced streaming features',
        'Custom bot integration'
      ],
      streamingQuality: '4K@60fps',
      maxUsers: 250,
      isActive: true
    });

    // Boost+ Tier 5
    this.boostTiers.set('BOOST_PLUS_TIER_5', {
      id: 'BOOST_PLUS_TIER_5',
      name: 'BOOST+ Tier 5',
      price: 30.99,
      features: [
        'Stream screen at 3860x1440p 60fps',
        'NVIDIA GeForce RTX 30/40/50 series GPU auto detection',
        'Monthly $30.99 / One-time $350.99',
        'Unlimited users per room',
        'Premium VIP support',
        'Complete customization',
        'Advanced AI features',
        'Hardware acceleration',
        'Ultra-wide streaming support'
      ],
      streamingQuality: 'ultrawide@60fps',
      maxUsers: -1, // Unlimited
      isActive: true
    });
  }

  public getAllTiers(): BoostTier[] {
    return Array.from(this.boostTiers.values());
  }

  public getTierById(id: string): BoostTier | null {
    return this.boostTiers.get(id) || null;
  }

  public getActiveTiers(): BoostTier[] {
    return Array.from(this.boostTiers.values()).filter(tier => tier.isActive);
  }

  public getTierFeatures(id: string): string[] {
    const tier = this.boostTiers.get(id);
    return tier ? tier.features : [];
  }

  public getTierPrice(id: string): number {
    const tier = this.boostTiers.get(id);
    return tier ? tier.price : 0;
  }

  public getTierStreamingQuality(id: string): string {
    const tier = this.boostTiers.get(id);
    return tier ? tier.streamingQuality : '720p@30fps';
  }

  public getTierMaxUsers(id: string): number {
    const tier = this.boostTiers.get(id);
    return tier ? tier.maxUsers : 10;
  }

  public isTierActive(id: string): boolean {
    const tier = this.boostTiers.get(id);
    return tier ? tier.isActive : false;
  }

  public getTierComparison(): any[] {
    const tiers = this.getAllTiers();
    return tiers.map(tier => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      streamingQuality: tier.streamingQuality,
      maxUsers: tier.maxUsers,
      features: tier.features,
      isActive: tier.isActive
    }));
  }

  public getRecommendedTier(userNeeds: {
    maxUsers?: number;
    streamingQuality?: string;
    budget?: number;
  }): BoostTier | null {
    const tiers = this.getActiveTiers();
    
    // Filter by budget if provided
    let filteredTiers = tiers;
    if (userNeeds.budget !== undefined) {
      filteredTiers = tiers.filter(tier => tier.price <= userNeeds.budget!);
    }

    // Filter by max users if provided
    if (userNeeds.maxUsers !== undefined) {
      filteredTiers = filteredTiers.filter(tier => 
        tier.maxUsers === -1 || tier.maxUsers >= userNeeds.maxUsers!
      );
    }

    // Filter by streaming quality if provided
    if (userNeeds.streamingQuality !== undefined) {
      filteredTiers = filteredTiers.filter(tier => 
        tier.streamingQuality.includes(userNeeds.streamingQuality!)
      );
    }

    // Return the cheapest tier that meets the requirements
    if (filteredTiers.length > 0) {
      return filteredTiers.reduce((cheapest, current) => 
        current.price < cheapest.price ? current : cheapest
      );
    }

    return null;
  }

  public validateTierUpgrade(currentTierId: string, targetTierId: string): boolean {
    const currentTier = this.boostTiers.get(currentTierId);
    const targetTier = this.boostTiers.get(targetTierId);

    if (!currentTier || !targetTier) {
      return false;
    }

    // Check if target tier is more expensive (upgrade)
    return targetTier.price > currentTier.price;
  }

  public getTierBenefits(id: string): string[] {
    const tier = this.boostTiers.get(id);
    if (!tier) return [];

    const benefits = [];
    
    if (tier.price > 0) {
      benefits.push('Premium features unlocked');
    }
    
    if (tier.maxUsers > 10) {
      benefits.push(`Up to ${tier.maxUsers === -1 ? 'unlimited' : tier.maxUsers} users per room`);
    }
    
    if (tier.streamingQuality !== '720p@30fps') {
      benefits.push(`Enhanced streaming: ${tier.streamingQuality}`);
    }
    
    if (tier.price >= 25.99) {
      benefits.push('VIP support');
    }
    
    if (tier.price >= 30.99) {
      benefits.push('Hardware acceleration');
      benefits.push('AI-powered features');
    }

    return benefits;
  }
}
