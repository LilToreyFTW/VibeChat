@echo off
echo 🚀 Starting VibeChat - Complete Chat Platform
echo =============================================
echo.

echo 📦 Starting Backend (Java Spring Boot)...
echo.
start "VibeChat Backend" cmd /k "cd backend && java -jar target/vibechat-backend-1.0.0.jar"
timeout /t 3 /nobreak > nul

echo 🤖 Starting Python AI Service...
echo.
start "VibeChat AI Service" cmd /k "cd python-service/dist/VibeChat-AI-Service && VibeChat-AI-Service.exe"
timeout /t 3 /nobreak > nul

echo 🏠 Starting Chat Rooms Server...
echo.
start "VibeChat Room Server" cmd /k "cd chat-rooms && npm start"
timeout /t 3 /nobreak > nul

echo 🌐 Starting Frontend (React)...
echo.
start "VibeChat Frontend" cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak > nul

echo 💻 Desktop Client is ready to launch:
echo    Location: clients_chat_exe/dist/win-unpacked/VibeChat Desktop.exe
echo.

echo =============================================
echo ✅ All services started! Access points:
echo.
echo 🌐 Frontend:        http://localhost:3000
echo 🔧 Backend API:      http://localhost:8080/api
echo 🤖 Python Service:   http://localhost:8001
echo 🏠 Room Server:      http://localhost:3002
echo 💻 Desktop Client:   Launch VibeChat Desktop.exe
echo.
echo 📚 See DEPLOYMENT_README.md for full documentation
echo.

pause
