@echo off
echo.
echo  ==========================================
echo   Lumiere Skincare - Setup Script (Windows)
echo  ==========================================
echo.

cd backend

echo [1/3] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)

echo.
echo [2/3] Setting up environment file...
if not exist .env (
  copy .env.example .env
  echo .env file created from template
) else (
  echo .env file already exists, skipping
)

echo.
echo [3/3] Seeding database with sample products...
node config/seed.js

echo.
echo  ==========================================
echo   Setup complete!
echo   Run: npm run dev
echo   Then open: http://localhost:5000
echo  ==========================================
echo.
pause
