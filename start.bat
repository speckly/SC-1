@echo off
@echo off

echo SC-Assignment AY2023/2024 S2
echo Author: Ritchie Yapp
echo https://github.com/speckly

set "error=false"

:: Check if cert.pem exists
if not exist ".\cert.pem" (
    echo Error: Missing cert.pem file.
    set "error=true"
)

:: Check if key.pem exists
if not exist ".\key.pem" (
    echo Error: Missing key.pem file.
    set "error=true"
)

:: Check if .env exists
if not exist ".\.env" (
    echo Error: Missing .env file.
    set "error=true"
)

if %error%==true (
    echo Exiting due to errors.
    pause
    exit /b 1
)

start node .\FrontEnd\server.js
start node .\BackEnd\server.js