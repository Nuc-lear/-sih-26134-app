@echo off
title Stop Career & Skill Intelligence Platform (Team NEXMIND)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"
pause
