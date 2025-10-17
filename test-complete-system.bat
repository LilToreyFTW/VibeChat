@echo off
echo 🚀 VibeChat - Complete System Test
echo =================================
echo.

echo 📋 Step 1: Checking System Requirements...
echo.
echo ✅ Node.js: Checking...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
) else (
    echo ✅ Node.js available
)

echo ✅ Java: Checking...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found. Please install Java 17+
    pause
    exit /b 1
) else (
    echo ✅ Java available
)

echo.
echo 🌐 Step 2: Starting All Services...
echo.
echo 📦 Backend (Java)...
start "VibeChat Backend" cmd /k "cd backend && java -jar target/vibechat-backend-1.0.0.jar"
timeout /t 3 /nobreak > nul

echo 🤖 Python AI Service...
start "VibeChat AI Service" cmd /k "cd python-service/dist/VibeChat-AI-Service && VibeChat-AI-Service.exe"
timeout /t 3 /nobreak > nul

echo 🏠 Chat Rooms Server...
start "VibeChat Room Server" cmd /k "cd chat-rooms && npm start"
timeout /t 3 /nobreak > nul

echo 🌐 Update Server...
start "VibeChat Update Server" cmd /k "node update-server.js"
timeout /t 3 /nobreak > nul

echo.
echo 💻 Step 3: Desktop Client Instructions
echo ========================================
echo.
echo 🎯 To test the complete system:
echo.
echo 1. 📱 Web Interface:
echo    Open: http://localhost:3000
echo    Register a new account
echo    Create a chat room
echo    Test real-time messaging
echo.
echo 2. 💻 Desktop Application:
echo    Install: clients_chat_exe/dist/VibeChat Desktop Setup 1.0.0.exe
echo    Launch from desktop shortcut
echo    Test all features
echo    Check for updates (Help > Check for Updates)
echo.
echo 3. 🔄 Update Testing:
echo    Make a small change to the app
echo    Run: build-and-deploy.bat
echo    Restart the desktop app
echo    It should auto-detect and install the update
echo.
echo 4. 📡 API Testing:
echo    Backend API: http://localhost:8080/api
echo    H2 Console:  http://localhost:8080/api/h2-console
echo    Update API:  http://localhost:3001/updates/
echo.
echo ========================================
echo ✅ All services should be running now!
echo.
echo 🌐 Access Points:
echo ================
echo Frontend:        http://localhost:3000
echo Backend API:     http://localhost:8080/api
echo H2 Database:     http://localhost:8080/api/h2-console
echo Update Server:   http://localhost:3001
echo Chat Rooms:      http://localhost:3002
echo Python Service:  http://localhost:8001
echo.
echo 📚 See DESKTOP_APP_README.md for full documentation
echo.

pause
