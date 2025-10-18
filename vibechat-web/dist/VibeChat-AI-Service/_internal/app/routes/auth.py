"""
Authentication routes for user management
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.config.settings import settings

router = APIRouter()
security = HTTPBearer()


@router.post("/register")
async def register_user(
    username: str,
    email: str,
    password: str,
    full_name: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    try:
        # Check if user already exists
        result = await db.execute(
            select(User).where((User.username == username) | (User.email == email))
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists"
            )

        # Create new user
        user = User(
            username=username,
            email=email,
            hashed_password=password,  # In real app, hash the password
            full_name=full_name,
            user_id=f"user_{username}_{datetime.now().timestamp()}",
            api_token=f"token_{username}_{datetime.now().timestamp()}",
            is_active=True,
            developer_mode=False
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": user.user_id
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login")
async def login_user(
    username: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    """Login user"""
    try:
        # Find user by username
        result = await db.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()

        if not user or user.hashed_password != password:  # In real app, verify hashed password
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is disabled"
            )

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "user_id": user.user_id,
                "api_token": user.api_token
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )
