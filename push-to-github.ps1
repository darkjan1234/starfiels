# GitHub Push Script for STARFIELDS
Write-Host "Setting up git configuration..."
git config user.email "admin@starfields.com.ph"
git config user.name "STARFIELDS Admin"

Write-Host "Adding all files..."
git add .

Write-Host "Checking status..."
git status

Write-Host "Committing changes..."
git commit -m "Initial commit - STARFIELDS full-stack application with React, Express, PostgreSQL, and animations"

Write-Host "Setting branch to main..."
git branch -M main

Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "Done!"
