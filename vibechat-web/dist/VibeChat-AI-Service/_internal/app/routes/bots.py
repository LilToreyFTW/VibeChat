"""
Bot management routes
"""

import random
import string
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Bot, User, Room

router = APIRouter()


@router.post("/create")
async def create_bot(
    name: str,
    description: Optional[str] = None,
    ai_model: str = "gpt-3.5-turbo",
    personality: Optional[str] = None,
    room_id: Optional[int] = None,
    owner_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Create a new bot"""
    try:
        # Find owner
        result = await db.execute(select(User).where(User.user_id == owner_id))
        owner = result.scalar_one_or_none()

        if not owner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Owner not found"
            )

        # Check if room exists and owner has permission (if room_id provided)
        room = None
        if room_id:
            result = await db.execute(select(Room).where(Room.id == room_id))
            room = result.scalar_one_or_none()

            if not room:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Room not found"
                )

            if room.creator_id != owner.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to add bot to this room"
                )

        # Generate unique bot token
        bot_token = generate_bot_token()

        # Create bot
        bot = Bot(
            name=name,
            description=description,
            bot_token=bot_token,
            ai_model=ai_model,
            personality=personality,
            is_active=True,
            owner_id=owner.id,
            room_id=room.id if room else None
        )

        db.add(bot)
        await db.commit()
        await db.refresh(bot)

        return {
            "success": True,
            "message": "Bot created successfully",
            "bot": {
                "id": bot.id,
                "name": bot.name,
                "bot_token": bot.bot_token,
                "is_active": bot.is_active,
                "ai_model": bot.ai_model,
                "created_at": bot.created_at.isoformat() if bot.created_at else None,
                "room_id": bot.room_id
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bot creation failed: {str(e)}"
        )


@router.get("/user/{user_id}")
async def get_user_bots(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get all bots owned by a user"""
    try:
        # Find user
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Get user's bots
        result = await db.execute(select(Bot).where(Bot.owner_id == user.id))
        bots = result.scalars().all()

        return {
            "success": True,
            "bots": [
                {
                    "id": bot.id,
                    "name": bot.name,
                    "description": bot.description,
                    "bot_token": bot.bot_token,
                    "is_active": bot.is_active,
                    "ai_model": bot.ai_model,
                    "personality": bot.personality,
                    "created_at": bot.created_at.isoformat() if bot.created_at else None,
                    "room_id": bot.room_id
                }
                for bot in bots
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bots: {str(e)}"
        )


@router.get("/room/{room_id}")
async def get_room_bots(room_id: int, db: AsyncSession = Depends(get_db)):
    """Get all active bots in a room"""
    try:
        # Get room bots
        result = await db.execute(
            select(Bot).where(
                (Bot.room_id == room_id) & (Bot.is_active == True)
            )
        )
        bots = result.scalars().all()

        return {
            "success": True,
            "bots": [
                {
                    "id": bot.id,
                    "name": bot.name,
                    "description": bot.description,
                    "bot_token": bot.bot_token,
                    "is_active": bot.is_active,
                    "ai_model": bot.ai_model,
                    "personality": bot.personality,
                    "created_at": bot.created_at.isoformat() if bot.created_at else None,
                    "owner": {
                        "id": bot.owner.id,
                        "username": bot.owner.username,
                        "full_name": bot.owner.full_name
                    }
                }
                for bot in bots
            ]
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch room bots: {str(e)}"
        )


@router.put("/{bot_id}")
async def update_bot(
    bot_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    ai_model: Optional[str] = None,
    personality: Optional[str] = None,
    is_active: Optional[bool] = None,
    owner_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Update bot settings"""
    try:
        # Get bot
        result = await db.execute(select(Bot).where(Bot.id == bot_id))
        bot = result.scalar_one_or_none()

        if not bot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bot not found"
            )

        # Check if user is the owner
        result = await db.execute(select(User).where(User.user_id == owner_id))
        user = result.scalar_one_or_none()

        if not user or bot.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this bot"
            )

        # Update bot fields
        if name is not None:
            bot.name = name
        if description is not None:
            bot.description = description
        if ai_model is not None:
            bot.ai_model = ai_model
        if personality is not None:
            bot.personality = personality
        if is_active is not None:
            bot.is_active = is_active

        bot.updated_at = datetime.utcnow()
        await db.commit()

        return {
            "success": True,
            "message": "Bot updated successfully",
            "bot": {
                "id": bot.id,
                "name": bot.name,
                "description": bot.description,
                "bot_token": bot.bot_token,
                "is_active": bot.is_active,
                "ai_model": bot.ai_model,
                "personality": bot.personality,
                "updated_at": bot.updated_at.isoformat() if bot.updated_at else None
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bot update failed: {str(e)}"
        )


@router.delete("/{bot_id}")
async def delete_bot(bot_id: int, owner_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a bot"""
    try:
        # Get bot
        result = await db.execute(select(Bot).where(Bot.id == bot_id))
        bot = result.scalar_one_or_none()

        if not bot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bot not found"
            )

        # Check if user is the owner
        result = await db.execute(select(User).where(User.user_id == owner_id))
        user = result.scalar_one_or_none()

        if not user or bot.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this bot"
            )

        # Delete bot
        await db.delete(bot)
        await db.commit()

        return {
            "success": True,
            "message": "Bot deleted successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bot deletion failed: {str(e)}"
        )


def generate_bot_token() -> str:
    """Generate a unique bot token"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))
