@echo off
title SmartClinic Backend API (.NET 9)
echo ============================================================
echo  Starting SmartClinic Backend Web API (https://localhost:7006)
echo ============================================================
cd /d "%~dp0smartclinic-backend\SmartClinic.API"
dotnet run --launch-profile https
pause
