@echo off
cd /d "%~dp0"
echo.
echo  Palabra laeuft unter  http://localhost:8080
echo  Am Handy: gleiche WLAN-Adresse mit deiner lokalen IP oeffnen,
echo  dann zum Home-Bildschirm hinzufuegen.
echo.
py -m http.server 8080 2>nul
if errorlevel 1 python -m http.server 8080
pause
