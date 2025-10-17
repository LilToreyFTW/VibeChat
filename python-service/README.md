# VibeChat Python AI Service

AI-powered backend service for the VibeChat application providing features like link generation, text analysis, and bot management.

## Features

- **Room Link Generation**: Generate unique room codes and URLs for chat rooms
- **User ID Generation**: Create unique identifiers for users
- **API Token Generation**: Generate secure tokens for user authentication
- **Text Analysis**: AI-powered text analysis for sentiment, toxicity, etc.
- **Bot Management**: Create and manage AI bots for chat rooms

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application:
```bash
python -m app.main
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## API Endpoints

### AI Features
- `POST /ai/generate-room-link` - Generate unique room link
- `POST /ai/generate-user-id` - Generate unique user ID
- `POST /ai/generate-api-token` - Generate API token
- `POST /ai/analyze-text` - Analyze text using AI

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Rooms
- `POST /rooms/create` - Create new chat room
- `GET /rooms/user/{user_id}` - Get user's rooms
- `GET /rooms/{room_code}` - Get room by code
- `PUT /rooms/{room_id}` - Update room settings
- `DELETE /rooms/{room_id}` - Delete room

### Bots
- `POST /bots/create` - Create new bot
- `GET /bots/user/{user_id}` - Get user's bots
- `GET /bots/room/{room_id}` - Get room bots
- `PUT /bots/{bot_id}` - Update bot settings
- `DELETE /bots/{bot_id}` - Delete bot

## Configuration

The service uses the following environment variables:

- `DATABASE_URL`: PostgreSQL database connection string
- `REDIS_URL`: Redis connection string for caching
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `ANTHROPIC_API_KEY`: Anthropic API key for AI features
- `SECRET_KEY`: Secret key for JWT tokens
- `DEBUG`: Enable debug mode (true/false)

## Development

The service is built with:
- **FastAPI**: Modern web framework for APIs
- **SQLAlchemy**: Database ORM with async support
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for production

## License

This project is part of the VibeChat application suite.
