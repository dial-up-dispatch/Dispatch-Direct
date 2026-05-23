# Dispatch Direct - Unified Build Script
# Builds Opera and Chrome packages for all Dispatch Direct extensions.

# Force load .NET zipping assemblies
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Custom zipping function to guarantee UNIX-style forward slashes (/) for all entries.
# This prevents Web Extension stores (Opera, Chrome) from rejecting ZIP files due to Windows backslashes (\).
function Create-CleanZip {
    param (
        [string]$SourceDir,
        [string]$ZipPath
    )
    $absoluteSourceDir = (Get-Item $SourceDir).FullName
    $absoluteZipPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $ZipPath))

    if (Test-Path $absoluteZipPath) { Remove-Item $absoluteZipPath -Force }

    $fileStream = New-Object System.IO.FileStream($absoluteZipPath, [System.IO.FileMode]::Create)
    $zip = New-Object System.IO.Compression.ZipArchive($fileStream, [System.IO.Compression.ZipArchiveMode]::Create)

    $files = Get-ChildItem -Path $absoluteSourceDir -Recurse -File
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($absoluteSourceDir.Length).TrimStart("\").TrimStart("/")
        $normalizedPath = $relativePath.Replace("\", "/")

        $entry = $zip.CreateEntry($normalizedPath)
        $entryStream = $entry.Open()

        $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $entryStream.Write($fileBytes, 0, $fileBytes.Length)
        $entryStream.Close()
    }
    $zip.Dispose()
    $fileStream.Close()
}

# Helper: stage, swap manifests, exclude dev files, zip, clean up
function Package-Extension {
    param (
        [string]$SourceDir,
        [string]$Target,   # "opera" or "chrome"
        [string]$ZipName
    )

    $stagingDir = "./dist-staging"
    if (Test-Path $stagingDir) { Remove-Item $stagingDir -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null

    # Copy all source files into staging recursively
    Copy-Item -Path "$SourceDir\*" -Destination $stagingDir -Recurse -Force

    # Swap correct manifest into place and handle background.js
    if ($Target -eq "opera") {
        Copy-Item "$stagingDir/manifest.opera.json" "$stagingDir/manifest.json" -Force
        Remove-Item "$stagingDir/background.js" -Force -ErrorAction SilentlyContinue
    }
    if ($Target -eq "chrome") {
        Copy-Item "$stagingDir/manifest.chrome.json" "$stagingDir/manifest.json" -Force
    }

    # Remove both target manifests from final package - only manifest.json ships
    Remove-Item "$stagingDir/manifest.opera.json" -Force -ErrorAction SilentlyContinue
    Remove-Item "$stagingDir/manifest.chrome.json" -Force -ErrorAction SilentlyContinue

    # Zip and clean
    Create-CleanZip -SourceDir $stagingDir -ZipPath "./$ZipName"
    Remove-Item $stagingDir -Recurse -Force

    Write-Host "SUCCESS: $ZipName" -ForegroundColor Green
}

# === UNIFIED BUILD ===
Write-Host "`nDispatch Direct - Building all packages...`n" -ForegroundColor Cyan

Package-Extension -SourceDir "./Brain Dump Inbox/brain-dump-inbox" -Target "opera"  -ZipName "brain-dump-inbox-opera.zip"
Package-Extension -SourceDir "./Brain Dump Inbox/brain-dump-inbox" -Target "chrome" -ZipName "brain-dump-inbox-chrome.zip"
Package-Extension -SourceDir "./The Void/the-void"                 -Target "opera"  -ZipName "the-void-opera.zip"
Package-Extension -SourceDir "./The Void/the-void"                 -Target "chrome" -ZipName "the-void-chrome.zip"

Write-Host "`nAll packages built successfully.`n" -ForegroundColor Cyan
