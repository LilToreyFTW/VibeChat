"""
User model
"""

from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.orm import relationship

from .base import BaseModel


class User(BaseModel):
    """User model for storing user information"""
    __tablename__ = "users"

    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    user_id = Column(String(20), unique=True, index=True, nullable=False)
    api_token = Column(String(255), unique=True, index=True, nullable=False)
    developer_mode = Column(Boolean, default=False)

    # Relationships
    created_rooms = relationship("Room", back_populates="creator")
    bots = relationship("Bot", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, user_id={self.user_id})>"
