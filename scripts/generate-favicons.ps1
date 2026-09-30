Add-Type -AssemblyName System.Drawing

$workspace = (Get-Location).Path
$srcPath = Join-Path $workspace "app\assets\logo.png"
$publicDir = Join-Path $workspace "public"

if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}

# 1. Copy logo.png to public/logo.png
Copy-Item -Path $srcPath -Destination (Join-Path $publicDir "logo.png") -Force
Write-Output "Copied logo.png to public/logo.png"

$src = [System.Drawing.Image]::FromFile($srcPath)

function Create-Resized-Png {
    param(
        [System.Drawing.Image]$source,
        [int]$size,
        [string]$destPath,
        [string]$bgColor = $null, # hex like '#121212' or null for transparent
        [double]$paddingRatio = 0.0 # padding percentage e.g. 0.15
    )

    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($bgColor) {
        $color = [System.Drawing.ColorTranslator]::FromHtml($bgColor)
        $brush = New-Object System.Drawing.SolidBrush($color)
        $g.FillRectangle($brush, 0, 0, $size, $size)
        $brush.Dispose()
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }

    $pad = [int]($size * $paddingRatio)
    $drawSize = $size - (2 * $pad)
    $destRect = New-Object System.Drawing.Rectangle($pad, $pad, $drawSize, $drawSize)
    $g.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel)

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated $destPath ($size x $size)"
}

# Generate PNG favicons (transparent for browser tabs)
Create-Resized-Png -source $src -size 16 -destPath (Join-Path $publicDir "favicon-16x16.png")
Create-Resized-Png -source $src -size 32 -destPath (Join-Path $publicDir "favicon-32x32.png")
Create-Resized-Png -source $src -size 48 -destPath (Join-Path $publicDir "favicon-48x48.png")

# Generate Apple Touch Icons (solid luxury dark #121212 background with padding)
Create-Resized-Png -source $src -size 180 -destPath (Join-Path $publicDir "apple-touch-icon.png") -bgColor "#121212" -paddingRatio 0.12
Create-Resized-Png -source $src -size 180 -destPath (Join-Path $publicDir "apple-touch-icon-180x180.png") -bgColor "#121212" -paddingRatio 0.12
Create-Resized-Png -source $src -size 152 -destPath (Join-Path $publicDir "apple-touch-icon-152x152.png") -bgColor "#121212" -paddingRatio 0.12
Create-Resized-Png -source $src -size 120 -destPath (Join-Path $publicDir "apple-touch-icon-120x120.png") -bgColor "#121212" -paddingRatio 0.12
Copy-Item (Join-Path $publicDir "apple-touch-icon.png") (Join-Path $publicDir "apple-touch-icon-precomposed.png") -Force

# Generate Android Chrome / PWA icons
Create-Resized-Png -source $src -size 192 -destPath (Join-Path $publicDir "android-chrome-192x192.png") -bgColor "#121212" -paddingRatio 0.14
Create-Resized-Png -source $src -size 512 -destPath (Join-Path $publicDir "android-chrome-512x512.png") -bgColor "#121212" -paddingRatio 0.14

# Generate 192 and 512 transparent versions too
Create-Resized-Png -source $src -size 192 -destPath (Join-Path $publicDir "icon-192-transparent.png")
Create-Resized-Png -source $src -size 512 -destPath (Join-Path $publicDir "icon-512-transparent.png")

# Generate Open Graph image (1200x630)
$ogWidth = 1200
$ogHeight = 630
$ogBmp = New-Object System.Drawing.Bitmap($ogWidth, $ogHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ogG = [System.Drawing.Graphics]::FromImage($ogBmp)
$ogG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$ogG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$ogG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$ogG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$ogG.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Rich background with subtle gradient/tone
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#0e0d0c"))
$ogG.FillRectangle($bgBrush, 0, 0, $ogWidth, $ogHeight)
$bgBrush.Dispose()

# Subtle gold border line (luxury aesthetic)
$borderPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#382f22"), 2)
$ogG.DrawRectangle($borderPen, 24, 24, $ogWidth - 48, $ogHeight - 48)
$innerPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#241e16"), 1)
$ogG.DrawRectangle($innerPen, 32, 32, $ogWidth - 64, $ogHeight - 64)
$borderPen.Dispose()
$innerPen.Dispose()

# Draw the logo emblem in center-top
$logoSize = 220
$logoX = [int](($ogWidth - $logoSize) / 2)
$logoY = 90
$ogG.DrawImage($src, $logoX, $logoY, $logoSize, $logoSize)

# Draw Brand Name & Tagline
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#e8cfa1"))
$ivoryBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f5f0e7"))
$stoneBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#9c9589"))

# Fonts
$fontBrand = New-Object System.Drawing.Font("Georgia", 36, [System.Drawing.FontStyle]::Regular)
$fontTagline = New-Object System.Drawing.Font("Georgia", 18, [System.Drawing.FontStyle]::Italic)
$fontSub = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Regular)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

$ogG.DrawString("MAMTA DESIGN CO.", $fontBrand, $ivoryBrush, [float]($ogWidth / 2), 340, $sf)
$ogG.DrawString("For the nights you remember · The Navratri Wardrobe & Couture", $fontTagline, $goldBrush, [float]($ogWidth / 2), 415, $sf)
$ogG.DrawString("HANDCRAFTED CHANIYA CHOLI · BESPOKE BRIDAL · WORLDWIDE SHIPPING", $fontSub, $stoneBrush, [float]($ogWidth / 2), 475, $sf)

$ogBmp.Save((Join-Path $publicDir "og-image.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Generated public/og-image.png (1200 x 630)"

$ogG.Dispose()
$ogBmp.Dispose()
$src.Dispose()
