"""
Billing and payment routes for B00ST+ subscriptions
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import re

from app.database import get_db
from app.models import User
from app.config.settings import settings

router = APIRouter()

# Bitcoin wallet address validation regex
BTC_ADDRESS_REGEX = r'^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$'

# Default payout wallet (your BTC address)
DEFAULT_PAYOUT_WALLET = "1M9mactBVv4ygScFxzHbEsXHcvvH8WrvPG"

@router.post("/update-wallet")
async def update_btc_wallet(
    wallet_address: str,
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Update user's Bitcoin wallet address for B00ST+ payouts"""

    # Validate Bitcoin address format
    if not re.match(BTC_ADDRESS_REGEX, wallet_address):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Bitcoin wallet address format"
        )

    try:
        # Find user
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # In a real implementation, you'd store this in the database
        # For now, we'll just validate and return success
        return {
            "success": True,
            "message": "Bitcoin wallet address updated successfully",
            "wallet_address": wallet_address,
            "payout_info": {
                "minimum_payout": "0.001 BTC",
                "payout_frequency": "24 hours",
                "current_balance": "0.00000000 BTC",
                "pending_payouts": "0.00000000 BTC"
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update wallet: {str(e)}"
        )


@router.get("/payout-info")
async def get_payout_info(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get user's current payout information"""

    try:
        # Find user
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Return payout information
        return {
            "success": True,
            "payout_info": {
                "wallet_address": DEFAULT_PAYOUT_WALLET,  # In real app, get from user record
                "minimum_payout": "0.001 BTC",
                "payout_frequency": "24 hours",
                "current_balance": "0.00000000 BTC",
                "pending_payouts": "0.00000000 BTC",
                "last_payout": None,
                "total_earned": "0.00000000 BTC"
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get payout info: {str(e)}"
        )


@router.post("/process-payment")
async def process_payment(
    tier: str,
    user_id: str,
    payment_method: str,
    db: AsyncSession = Depends(get_db)
):
    """Process a B00ST+ subscription payment"""

    valid_tiers = ["basic", "classic", "premium"]

    if tier.lower() not in valid_tiers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription tier"
        )

    try:
        # Find user
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # In a real implementation, this would:
        # 1. Process payment through payment gateway
        # 2. Update user's subscription tier
        # 3. Calculate payout amount
        # 4. Send payout to configured Bitcoin wallet

        tier_prices = {
            "basic": 0,  # Free
            "classic": 9.99,
            "premium": 14.99
        }

        payout_amount = tier_prices[tier.lower()] * 0.7  # 70% goes to creator

        return {
            "success": True,
            "message": f"{tier.title()} subscription activated",
            "tier": tier,
            "price": f"${tier_prices[tier.lower()]:.2f}",
            "payout_amount": f"{payout_amount:.2f} BTC",
            "payout_wallet": DEFAULT_PAYOUT_WALLET,
            "estimated_payout_time": "24-48 hours"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment processing failed: {str(e)}"
        )
