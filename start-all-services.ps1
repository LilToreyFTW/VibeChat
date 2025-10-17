Write-Host "🚀 Starting VibeChat - Complete Chat Platform" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Starting Backend (Java Spring Boot)..." -ForegroundColor Yellow
Write-Host ""
Start-Process -FilePath "java" -ArgumentList "-jar", "backend/target/vibechat-backend-1.0.0.jar" -NoNewWindow
Start-Sleep -Seconds 3

Write-Host "🤖 Starting Python AI Service..." -ForegroundColor Yellow
Write-Host ""
Start-Process -FilePath "python-service/dist/VibeChat-AI-Service/VibeChat-AI-Service.exe" -NoNewWindow
Start-Sleep -Seconds 3

Write-Host "🏠 Starting Chat Rooms Server..." -ForegroundColor Yellow
Write-Host ""
Start-Process -FilePath "node" -ArgumentList "chat-rooms/room-server.js" -NoNewWindow
Start-Sleep -Seconds 3

Write-Host "🌐 Starting Frontend (React)..." -ForegroundColor Yellow
Write-Host ""
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "frontend" -NoNewWindow
Start-Sleep -Seconds 3

Write-Host "💻 Desktop Client is ready to launch:" -ForegroundColor Cyan
Write-Host "   Location: clients_chat_exe/dist/win-unpacked/VibeChat Desktop.exe" -ForegroundColor Cyan
Write-Host ""

Write-Host "=============================================" -ForegroundColor Green
Write-Host "✅ All services started! Access points:" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend:        http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API:      http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "🤖 Python Service:   http://localhost:8001" -ForegroundColor Cyan
Write-Host "🏠 Room Server:      http://localhost:3002" -ForegroundColor Cyan
Write-Host "💻 Desktop Client:   Launch VibeChat Desktop.exe" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 See DEPLOYMENT_README.md for full documentation" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to continue..."
