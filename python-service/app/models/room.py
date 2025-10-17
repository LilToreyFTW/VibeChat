"""
Room model
"""

from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .base import BaseModel


class Room(BaseModel):
    """Chat room model"""
    __tablename__ = "rooms"

    name = Column(String(100), nullable=False)
    description = Column(Text)
    room_code = Column(String(10), unique=True, index=True, nullable=False)
    room_url = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    max_members = Column(Integer, default=50)
    allow_bots = Column(Boolean, default=True)

    # Foreign keys
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    creator = relationship("User", back_populates="created_rooms")
    bots = relationship("Bot", back_populates="room")

    def __repr__(self):
        return f"<Room(id={self.id}, name={self.name}, room_code={self.room_code})>"
