@echo off
echo 🚀 Deploying VibeChat Web to Vercel
echo =================================

echo.
echo 📦 Building Next.js application...
cd vibechat-web
if errorlevel 1 (
    echo ❌ Failed to navigate to vibechat-web directory
    pause
    exit /b 1
)

npm run build
if errorlevel 1 (
    echo ❌ Build failed
    cd ..
    pause
    exit /b 1
)

echo.
echo 🌐 Deploying to Vercel...
npm run deploy
if errorlevel 1 (
    echo ❌ Deployment failed
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Deployment completed successfully!
echo.
echo 🌍 Your VibeChat web application should now be live on Vercel.
echo.
echo 📋 Next steps:
echo 1. Check your deployment URL in the Vercel dashboard
echo 2. Update DNS settings if needed
echo 3. Test the web version at /web route
echo 4. Verify desktop app downloads work
echo.
pause
