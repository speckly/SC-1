@echo off

for /f %%I in ('cd') do set "currentDirectory=%%~nxI"

if /i "%currentDirectory%" neq "Legacy" (
    cd ./Legacy
)

echo WARNING: This web application is Legacy and is therefore vulnerable, DO NOT deploy to production
echo Author: Ritchie Yapp
echo https://github.com/speckly
start cmd /k node ./FrontEnd/server.js
start cmd /k node ./BackEnd/server.js

cd ..