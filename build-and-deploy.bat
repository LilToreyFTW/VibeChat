@echo off
echo 🚀 VibeChat - Build and Deploy Desktop Application
echo ==================================================
echo.

echo 📦 Step 1: Installing Frontend Dependencies...
echo.
cd frontend
if errorlevel 1 (
    echo ❌ Failed to navigate to frontend directory
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Frontend dependencies installation failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

echo.
echo 🔨 Step 2: Building Frontend...
echo.
npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend built successfully

echo.
echo 📋 Step 3: Copying Frontend to Electron...
echo.
xcopy /E /I /Y build\* ..\clients_chat_exe\build\
if errorlevel 1 (
    echo ❌ Failed to copy frontend build to electron
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend copied to electron directory
cd ..

echo.
echo 💻 Step 4: Installing Electron Dependencies...
echo.
cd clients_chat_exe
if errorlevel 1 (
    echo ❌ Failed to navigate to electron directory
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Electron dependencies installation failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Electron dependencies installed

echo.
echo 🚀 Step 5: Building Electron Application...
echo.
npm run build
if errorlevel 1 (
    echo ❌ Electron build failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Electron application built successfully
cd ..

echo.
echo 🌐 Step 6: Starting Update Server...
echo.
start "VibeChat Update Server" cmd /k "node update-server.js"
timeout /t 3 /nobreak > nul

echo.
echo 📋 Step 7: Summary
echo ==================================================
echo ✅ Frontend: Built and ready
echo ✅ Electron App: Built with installer (includes backend services)
echo ✅ Backend Services: Java, Node.js, and Python services embedded
echo ✅ Update Server: Running on http://localhost:3001
echo ✅ Installers: Available in clients_chat_exe/dist/
echo ✅ Updates: Served from http://localhost:3001/updates/
echo.
echo 🎯 Next Steps:
echo 1. Install the app using: clients_chat_exe/dist/VibeChat Desktop Setup 1.0.0.exe
echo 2. The app will automatically start all backend services when launched
echo 3. Users can create/join rooms, use AI features, etc. without manual setup
echo 4. Test auto-updates by modifying the app and running this script again
echo 5. Users can check for updates from within the installed app
echo.
echo 📚 See DEPLOYMENT_README.md for full documentation
echo.

pause
