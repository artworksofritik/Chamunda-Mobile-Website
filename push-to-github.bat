@echo off
title Push to GitHub - Chamunda Mobile Website
echo ========================================================
echo   Pushing Chamunda Mobile Website to GitHub...
echo ========================================================
echo Repository: https://github.com/artworksofritik/Chamunda-Mobile-Website.git
echo.
"C:\Users\ritik\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [SUCCESS] Successfully pushed to GitHub!
    echo   Repository: https://github.com/artworksofritik/Chamunda-Mobile-Website
    echo ========================================================
) else (
    echo ========================================================
    echo   [NOTICE] If authentication failed, please ensure you
    echo   sign in to GitHub in the browser window or use a
    echo   Personal Access Token (classic) with 'repo' scope.
    echo ========================================================
)
echo.
pause
