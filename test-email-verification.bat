@echo off
echo 🚀 Testing VibeChat Email Verification System
echo =============================================
echo.

echo Starting Backend Server...
echo.
start "VibeChat Backend" cmd /k "cd backend && java -jar target/vibechat-backend-1.0.0.jar"
timeout /t 5 /nobreak > nul

echo.
echo Backend server should be running on http://localhost:8080/api
echo.
echo =============================================
echo.

echo To test email verification:
echo 1. Open http://localhost:3000 in your browser
echo 2. Register a new account
echo 3. Check the backend console for the verification token
echo 4. Use the token to verify the email at:
echo    http://localhost:3000/verify-email?token=YOUR_TOKEN
echo.
echo For development, email verification is simplified:
echo - Email sending is disabled (tokens shown in console)
echo - Verification just checks if token exists in database
echo.
echo =============================================
echo.

pause
