"""
Bot model
"""

from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .base import BaseModel


class Bot(BaseModel):
    """Bot model for AI bots in chat rooms"""
    __tablename__ = "bots"

    name = Column(String(100), nullable=False)
    description = Column(Text)
    bot_token = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    ai_model = Column(String(50), default="gpt-3.5-turbo")
    personality = Column(Text)

    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"))

    # Relationships
    owner = relationship("User", back_populates="bots")
    room = relationship("Room", back_populates="bots")

    def __repr__(self):
        return f"<Bot(id={self.id}, name={self.name}, owner_id={self.owner_id})>"
