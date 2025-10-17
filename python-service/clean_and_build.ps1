# Clean and rebuild script for VibeChat AI Service

Write-Host "Cleaning up existing build files..."

# Stop any running processes
try {
    taskkill /f /im "VibeChat-AI-Service.exe" 2>$null
} catch {}

# Wait a moment
Start-Sleep -Seconds 2

# Remove dist directory with force
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Create fresh dist directory
New-Item -ItemType Directory -Path "dist" -Force | Out-Null

Write-Host "Building PyInstaller executable..."
pyinstaller vibechat.spec

Write-Host "Build completed!"
