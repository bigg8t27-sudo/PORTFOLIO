$env:PATH += ";C:\Program Files\Git\bin"
$msg = if ($args[0]) { $args[0] } else { "Update portfolio" }
Set-Location "c:\Users\Dell Inc\Desktop\Portfolio"
git add .
git commit -m $msg
git push origin main
Write-Host "✅ Pushed to GitHub — Render will redeploy automatically." -ForegroundColor Cyan
