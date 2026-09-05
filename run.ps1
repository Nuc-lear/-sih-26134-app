# ====================================================================
# SIH26134 · Team NEXMIND · Application Launcher Script
# Starts both FastAPI Backend (Port 8000) and React Frontend (Port 5173)
# ====================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Starting Career & Skill Intelligence Platform (NEXMIND)     " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Determine Root Directory (Resilient across drives C:, D:, etc.)
$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $rootDir) { $rootDir = (Get-Location).Path }

$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

# Helper function to check if a TCP port is currently open
function Test-PortActive([int]$port) {
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect("127.0.0.1", $port, $null, $null)
        $waited = $iar.AsyncWaitHandle.WaitOne(500, $false)
        if ($waited -and $tcp.Connected) {
            $tcp.EndConnect($iar)
            $tcp.Close()
            return $true
        }
        $tcp.Close()
        return $false
    } catch {
        return $false
    }
}

# 2. Locate Python Executable
$pythonExe = Join-Path $backendDir "venv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    $foundPython = Get-Command python -ErrorAction SilentlyContinue
    if ($foundPython) {
        $pythonExe = $foundPython.Source
    } else {
        $pythonExe = "python"
    }
}

# 3. Locate Node.js & npm
$nodeDir = ""
$knownNodeDirs = @(
    "$env:LOCALAPPDATA\Programs\nodejs",
    "$env:ProgramFiles\nodejs",
    "${env:ProgramFiles(x86)}\nodejs"
)
foreach ($dir in $knownNodeDirs) {
    if (Test-Path (Join-Path $dir "node.exe")) {
        $nodeDir = $dir
        break
    }
}

# 4. Check & Start Backend (Port 8000)
$backendRunning = Test-PortActive 8000
if ($backendRunning) {
    Write-Host "`n[1/2] Backend API is ALREADY running on http://127.0.0.1:8000 (healthy)." -ForegroundColor Green
} else {
    Write-Host "`n[1/2] Launching Backend API on http://127.0.0.1:8000..." -ForegroundColor Yellow
    $backendCmd = "Set-Location '$backendDir'; & '$pythonExe' -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload-dir app"
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCmd
}

# 5. Check & Start Frontend (Port 5173)
$frontendRunning = Test-PortActive 5173
if ($frontendRunning) {
    Write-Host "[2/2] Frontend UI is ALREADY running on http://127.0.0.1:5173 (healthy)." -ForegroundColor Green
} else {
    Write-Host "[2/2] Launching Frontend UI on http://127.0.0.1:5173..." -ForegroundColor Yellow
    $pathInject = if ($nodeDir) { "`$env:PATH = '$nodeDir;' + `$env:PATH; " } else { "" }
    $frontendCmd = "$pathInject Set-Location '$frontendDir'; & npm.cmd run dev -- --host 0.0.0.0 --port 5173"
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $frontendCmd
}

# 6. Wait briefly for initial socket binding if newly launched
if (-not $backendRunning -or -not $frontendRunning) {
    Start-Sleep -Seconds 3
}

# Determine local IP for mobile access
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" -ErrorAction SilentlyContinue | Select-Object -First 1).IPAddress
if (-not $localIp) {
    $localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.IPAddress -notmatch '^169\.254\.' } | Select-Object -First 1).IPAddress
}

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  Platform Ready & Active!" -ForegroundColor Green
Write-Host "  -> Local PC:        http://localhost:5173" -ForegroundColor Green
if ($localIp) {
    Write-Host "  -> Mobile Phone:    http://${localIp}:5173 (Connect to same Wi-Fi)" -ForegroundColor Cyan
}
Write-Host "  -> API Docs:        http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green

# 7. Open in default browser
Start-Process "http://127.0.0.1:5173"

