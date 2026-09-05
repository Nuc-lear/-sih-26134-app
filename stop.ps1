# ====================================================================
# SIH26134 · Team NEXMIND · Application Shutdown Script
# Stops FastAPI Backend (Port 8000) and React Frontend (Port 5173)
# ====================================================================

Write-Host "================================================================" -ForegroundColor Yellow
Write-Host "   Stopping Career & Skill Intelligence Platform (NEXMIND)     " -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Yellow

 = @(8000, 5173)
foreach ( in ) {
    try {
         = Get-NetTCPConnection -LocalPort  -ErrorAction SilentlyContinue
        if () {
             =  | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ( in ) {
                if ( -gt 0) {
                    Write-Host "Stopping process ID  on port ..." -ForegroundColor Cyan
                    Stop-Process -Id  -Force -ErrorAction SilentlyContinue
                }
            }
            Write-Host "Port  has been stopped." -ForegroundColor Green
        } else {
            Write-Host "Port  was not in use." -ForegroundColor Gray
        }
    } catch {
        Write-Host "Could not inspect port  : " -ForegroundColor DarkGray
    }
}

Write-Host "
All platform processes on ports 8000 and 5173 have been stopped." -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Yellow
