"""
Routes package
"""

from .auth import router as auth_router
from .rooms import router as rooms_router
from .bots import router as bots_router
from .ai import router as ai_router

__all__ = ["auth_router", "rooms_router", "bots_router", "ai_router"]
