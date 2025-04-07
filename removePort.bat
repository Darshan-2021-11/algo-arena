@echo off
REM Replace <PORT> with the port you want to close
echo Finding the PID for port 9310...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :9310') do (
    echo Terminating process ID %%a
    taskkill /F /PID %%a
)
echo Port <PORT> closed successfully!
pause