# Production deployment script for Acquisition App
# This script starts the application in production mode with Neon Cloud Database

Write-Host "🚀 Starting Acquisition App in Production Mode" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host "   Please create .env.production with your production environment variables." -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
}
catch {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Building and starting production container..." -ForegroundColor Blue
Write-Host "   - Using Neon Cloud Database (no local proxy)" -ForegroundColor Gray
Write-Host "   - Running in optimized production mode" -ForegroundColor Gray
Write-Host ""

# Start production environment
docker compose -f docker-compose.prod.yml up --build -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start production containers!" -ForegroundColor Red
    exit 1
}

# Wait for DB to be ready (basic health check)
Write-Host "⏳ Waiting for Neon Local to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Run migrations with Drizzle
Write-Host "📜 Applying latest schema with Drizzle..." -ForegroundColor Blue
npm run db:migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to run database migrations!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Production environment started!" -ForegroundColor Green
Write-Host "   Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Logs: docker logs acquisition-app-prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "   View logs: docker logs -f acquisition-app-prod" -ForegroundColor Gray
Write-Host "   Stop app: docker compose -f docker-compose.prod.yml down" -ForegroundColor Gray