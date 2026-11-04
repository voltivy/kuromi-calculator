@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Get the LTS version from https://nodejs.org then run this again.
  pause
  exit /b 1
)

if not exist audio\background.mp3 (
  echo WARNING: audio\background.mp3 is missing. The app will build but have no background music.
)

if not exist fonts\Silkscreen-Regular.ttf (
  echo Downloading pixel font...
  powershell -NoProfile -Command "try { Invoke-WebRequest 'https://github.com/google/fonts/raw/main/ofl/silkscreen/Silkscreen-Regular.ttf' -OutFile 'fonts\Silkscreen-Regular.ttf'; Invoke-WebRequest 'https://github.com/google/fonts/raw/main/ofl/silkscreen/Silkscreen-Bold.ttf' -OutFile 'fonts\Silkscreen-Bold.ttf' } catch { Write-Host 'Font download failed - the app will use a fallback font.' }"
)

echo Installing build tools (first time takes a few minutes)...
call npm install
if errorlevel 1 goto fail

echo Building exe...
call npm run build
if errorlevel 1 goto fail

echo.
echo Done! Your exe is in the "dist" folder: Pixel Calculator.exe
explorer dist
pause
exit /b 0

:fail
echo Something went wrong. Scroll up to see the error.
pause
exit /b 1
