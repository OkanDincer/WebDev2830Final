@echo off
echo Starting SmartlyBudget...

cd /d "%~dp0\server"
start "Backend" cmd /k "npm run dev"

cd /d "%~dp0\client"
start "Frontend" cmd /k "npm start"

exit