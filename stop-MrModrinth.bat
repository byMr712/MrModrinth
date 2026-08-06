@echo off
echo Stopping Modrinth Proxy...

:: Kill node by port 3000 only
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F > nul 2>&1
    echo Process on port 3000 stopped
)

:: Remove PID file if exists
if exist "%~dp0modrinth-proxy-pid.txt" (
    del "%~dp0modrinth-proxy-pid.txt"
)

echo Done!
exit