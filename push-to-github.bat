@echo off
echo ==========================================
echo Pushing STARFIELDS to GitHub
echo ==========================================
echo.

echo [1/5] Setting git configuration...
git config user.email "admin@starfields.com.ph"
git config user.name "STARFIELDS Admin"

echo.
echo [2/5] Adding all files to staging...
git add .

echo.
echo [3/5] Committing changes...
git commit -m "Initial commit - STARFIELDS full-stack application with React, Express, PostgreSQL, and animations"

echo.
echo [4/5] Setting main branch...
git branch -M main

echo.
echo [5/5] Pushing to GitHub...
git push -u origin main

echo.
echo ==========================================
echo Done! Check your repository at:
echo https://github.com/darkjan1234/starfiels
echo ==========================================
pause
