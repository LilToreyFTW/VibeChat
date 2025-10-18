"""
Room management routes
"""

import random
import string
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.database import get_db
from app.models import Room, User
from app.config.settings import settings

router = APIRouter()


@router.post("/create")
async def create_room(
    name: str,
    db: AsyncSession = Depends(get_db),
    description: Optional[str] = None,
    max_members: int = 50,
    allow_bots: bool = True,
    creator_id: str
):
    """Create a new chat room"""
    try:
        # Find creator
        result = await db.execute(select(User).where(User.user_id == creator_id))
        creator = result.scalar_one_or_none()

        if not creator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Creator not found"
            )

        # Generate unique room code and URL
        room_code = generate_room_code()
        room_url = f"{settings.BASE_ROOM_URL}/{room_code}"

        # Create room
        room = Room(
            name=name,
            description=description,
            room_code=room_code,
            room_url=room_url,
            is_active=True,
            max_members=max_members,
            allow_bots=allow_bots,
            creator_id=creator.id
        )

        db.add(room)
        await db.commit()
        await db.refresh(room)

        return {
            "message": "Room created successfully",
            "room": {
                "id": room.id,
                "name": room.name,
                "room_code": room.room_code,
                "room_url": room.room_url,
                "created_at": room.created_at.isoformat() if room.created_at else None
            }
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create room: {str(e)}"
        )


@router.get("/user/{user_id}")
async def get_user_rooms(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get all rooms created by a user"""
    try:
        # Find user
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Get user's rooms
        result = await db.execute(select(Room).where(Room.creator_id == user.id))
        rooms = result.scalars().all()

        return {
            "rooms": [
                {
                    "id": room.id,
                    "name": room.name,
                    "room_code": room.room_code,
                    "room_url": room.room_url,
                    "is_active": room.is_active,
                    "created_at": room.created_at.isoformat() if room.created_at else None
                }
                for room in rooms
            ]
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user rooms: {str(e)}"
        )


@router.get("/{room_code}")
async def get_room(room_code: str, db: AsyncSession = Depends(get_db)):
    """Get room by code"""
    try:
        result = await db.execute(select(Room).where(Room.room_code == room_code))
        room = result.scalar_one_or_none()

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )

        return {
            "room": {
                "id": room.id,
                "name": room.name,
                "description": room.description,
                "room_code": room.room_code,
                "room_url": room.room_url,
                "is_active": room.is_active,
                "max_members": room.max_members,
                "allow_bots": room.allow_bots,
                "created_at": room.created_at.isoformat() if room.created_at else None
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch room: {str(e)}"
        )


@router.put("/{room_id}")
async def update_room(
    room_id: int,
    user_id: str = None,
    db: AsyncSession = Depends(get_db),
    name: Optional[str] = None,
    description: Optional[str] = None,
    max_members: Optional[int] = None,
    allow_bots: Optional[bool] = None
):
    """Update room settings"""
    try:
        # Get room
        result = await db.execute(select(Room).where(Room.id == room_id))
        room = result.scalar_one_or_none()

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )

        # Check if user is the creator
        if user_id and room.creator_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only room creator can update room settings"
            )

        # Update room fields
        if name is not None:
            room.name = name
        if description is not None:
            room.description = description
        if max_members is not None:
            room.max_members = max_members
        if allow_bots is not None:
            room.allow_bots = allow_bots

        await db.commit()
        await db.refresh(room)

        return {
            "message": "Room updated successfully",
            "room": {
                "id": room.id,
                "name": room.name,
                "description": room.description,
                "max_members": room.max_members,
                "allow_bots": room.allow_bots
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update room: {str(e)}"
        )


@router.delete("/{room_id}")
async def delete_room(room_id: int, user_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a room"""
    try:
        # Get room
        result = await db.execute(select(Room).where(Room.id == room_id))
        room = result.scalar_one_or_none()

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )

        # Check if user is the creator
        if room.creator_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only room creator can delete room"
            )

        # Delete room
        await db.delete(room)
        await db.commit()

        return {"message": "Room deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete room: {str(e)}"
        )


def generate_room_code(length: int = 8) -> str:
    """Generate a unique room code"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))
