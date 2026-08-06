@echo off
if "%1"=="hide" goto :hide
powershell -Command "Start-Process '%~f0' -ArgumentList 'hide' -WindowStyle Hidden"
exit /b

:hide
cd /d "%~dp0"

:: Check if node_modules exists, if not - run npm install
if not exist "%~dp0node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed! Please check your internet connection and package.json
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
)

:: Cleanup old processes before starting
echo Cleaning up old processes...

:: Kill old node processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F > nul 2>&1
    echo Removed old process on port 3000
)


:: Start fresh
echo Starting Modrinth Proxy...
start /B npm run dev > nul 2>&1

:: Save PID
timeout /t 3 /nobreak > nul
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /NH') do (
    echo %%a > "%~dp0modrinth-proxy-pid.txt"
)

:: Kill leftover cmd.exe from previous npm runs
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='cmd.exe'\" | Where-Object { $_.CommandLine -like '*npm*' -or $_.CommandLine -like '*node*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

echo Server started successfully!
exit