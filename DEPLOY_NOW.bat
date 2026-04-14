@echo off
echo ==========================================
echo STARFIELDS - Vercel Deployment
echo ==========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [1/5] Installing Vercel CLI...
    npm install -g vercel
    if errorlevel 1 (
        echo Failed to install Vercel CLI. Please run as Administrator.
        pause
        exit /b 1
    )
) else (
    echo [1/5] Vercel CLI already installed
)

echo.
echo [2/5] Checking Git status...
git status --short
echo.

echo [3/5] Committing any changes...
git add .
git commit -m "Pre-deployment update" 2>nul
git push
echo.

echo [4/5] Setting up Vercel project...
echo IMPORTANT: When prompted, select:
echo   - Link to existing project: NO (create new)
echo   - Root directory: ./frontend
echo   - Framework: Create React App
echo.

REM Create vercel.json if not exists
if not exist "vercel.json" (
    echo Creating vercel.json...
    echo { > vercel.json
    echo   "version": 2, >> vercel.json
    echo   "name": "starfields-frontend", >> vercel.json
    echo   "framework": "create-react-app", >> vercel.json
    echo   "buildCommand": "npm run build", >> vercel.json
    echo   "outputDirectory": "build", >> vercel.json
    echo   "installCommand": "npm install", >> vercel.json
    echo   "rewrites": [ >> vercel.json
    echo     { >> vercel.json
    echo       "source": "/(.*)", >> vercel.json
    echo       "destination": "/index.html" >> vercel.json
    echo     } >> vercel.json
    echo   ] >> vercel.json
    echo } >> vercel.json
)

echo [5/5] Deploying to Vercel...
echo.
echo If this is your first time:
echo 1. Browser will open for login
echo 2. Login with your Vercel/GitHub account
echo 3. Answer the prompts in terminal
echo.
pause
echo.

vercel --prod

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Your site will be available at:
echo https://starfields-*.vercel.app
echo.
echo Check your dashboard:
echo https://vercel.com/dashboard
echo.
pause
