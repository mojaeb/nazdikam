$root = Split-Path -Parent $PSScriptRoot

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$root'; pnpm --filter @workspace/api-server run dev"
)

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$root'; node ./scripts/dev-web.mjs"
)

Write-Host ""
Write-Host "API  -> http://127.0.0.1:8080/api/healthz"
Write-Host "Web  -> http://localhost:22333/"
Write-Host ""
