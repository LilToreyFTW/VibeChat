@echo off
echo 🚀 Deploying VibeChat Web to Vercel
echo =================================

echo.
echo 🌐 Checking Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI not found. Installing globally...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

echo.
echo 📦 Installing dependencies for Next.js app...
cd vibechat-web
if errorlevel 1 (
    echo ❌ Failed to navigate to vibechat-web directory
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Failed to install Next.js dependencies
    cd ..
    pause
    exit /b 1
)

echo.
echo 🔨 Building Next.js application...
npm run build
if errorlevel 1 (
    echo ❌ Build failed
    cd ..
    pause
    exit /b 1
)

echo.
echo 🚀 Deploying to Vercel...
vercel --prod
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
echo 🔗 Access your site at: https://your-project-name.vercel.app
echo.
echo 💡 Pro tip: You can also deploy directly from GitHub by connecting your repository to Vercel
echo.
pause

