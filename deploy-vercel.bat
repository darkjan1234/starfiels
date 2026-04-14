@echo off
echo ==========================================
echo STARFIELDS - Vercel Deploy Helper
echo ==========================================
echo.
echo Make sure you have Vercel CLI installed:
echo npm i -g vercel
echo.
echo Press any key to deploy...
pause >nul
echo.
echo [1/3] Checking if logged in to Vercel...
vercel whoami
echo.
echo [2/3] Setting up project...
echo This will:
echo  - Link to your GitHub repo
echo  - Set framework to Create React App
echo  - Set root directory to 'frontend'
echo.
echo [3/3] Deploying...
vercel --prod
echo.
echo ==========================================
echo Deployment complete!
echo Check: https://vercel.com/dashboard
echo ==========================================
pause
