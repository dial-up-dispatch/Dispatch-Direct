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
    
    # Ensure absolute paths for .NET compatibility
    $absoluteSourceDir = (Get-Item $SourceDir).FullName
    $absoluteZipPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $ZipPath))
    
    # Remove existing ZIP if present
    if (Test-Path $absoluteZipPath) { Remove-Item $absoluteZipPath -Force }
    
    # Create file and zip streams
    $fileStream = New-Object System.IO.FileStream($absoluteZipPath, [System.IO.FileMode]::Create)
    $zip = New-Object System.IO.Compression.ZipArchive($fileStream, [System.IO.Compression.ZipArchiveMode]::Create)
    
    # Get all files recursively
    $files = Get-ChildItem -Path $absoluteSourceDir -Recurse -File
    
    foreach ($file in $files) {
        # Calculate relative path to the staging directory
        $relativePath = $file.FullName.Substring($absoluteSourceDir.Length).TrimStart("\").TrimStart("/")
        
        # Replace Windows backslashes with UNIX forward slashes
        $normalizedPath = $relativePath.Replace("\", "/")
        
        # Create ZIP entry
        $entry = $zip.CreateEntry($normalizedPath)
        $entryStream = $entry.Open()
        
        # Read file bytes and write to entry stream
        $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $entryStream.Write($fileBytes, 0, $fileBytes.Length)
        
        # Close entry stream
        $entryStream.Close()
    }
    
    # Finalize ZIP archive and close streams
    $zip.Dispose()
    $fileStream.Close()
}


# === 1. BUILD FOR OPERA ===
Write-Host "Building Opera Package..." -ForegroundColor Cyan

# Create temporary staging directory
$operaStaging = "./dist-opera"
New-Item -ItemType Directory -Force -Path $operaStaging | Out-Null

# Copy only the files Opera needs
Copy-Item "./brain-dump-inbox/css" "$operaStaging/css" -Recurse -Force
Copy-Item "./brain-dump-inbox/fonts" "$operaStaging/fonts" -Recurse -Force
Copy-Item "./brain-dump-inbox/icons" "$operaStaging/icons" -Recurse -Force
Copy-Item "./brain-dump-inbox/js" "$operaStaging/js" -Recurse -Force
Copy-Item "./brain-dump-inbox/panel.html" "$operaStaging/panel.html" -Force

# Copy the Opera manifest and rename it to manifest.json
Copy-Item "./brain-dump-inbox/manifest.opera.json" "$operaStaging/manifest.json" -Force

# Zip the staging folder using our clean function
Create-CleanZip -SourceDir $operaStaging -ZipPath "./brain-dump-inbox-opera.zip"

# Clean up staging folder
Remove-Item $operaStaging -Recurse -Force
Write-Host "Opera ZIP created successfully with forward-slash paths: brain-dump-inbox-opera.zip`n" -ForegroundColor Green


# === 2. BUILD FOR CHROME ===
Write-Host "Building Chrome Package..." -ForegroundColor Cyan

# Create temporary staging directory
$chromeStaging = "./dist-chrome"
New-Item -ItemType Directory -Force -Path $chromeStaging | Out-Null

# Copy files Chrome needs (including background.js)
Copy-Item "./brain-dump-inbox/css" "$chromeStaging/css" -Recurse -Force
Copy-Item "./brain-dump-inbox/fonts" "$chromeStaging/fonts" -Recurse -Force
Copy-Item "./brain-dump-inbox/icons" "$chromeStaging/icons" -Recurse -Force
Copy-Item "./brain-dump-inbox/js" "$chromeStaging/js" -Recurse -Force
Copy-Item "./brain-dump-inbox/panel.html" "$chromeStaging/panel.html" -Force
Copy-Item "./brain-dump-inbox/background.js" "$chromeStaging/background.js" -Force

# Copy the Chrome manifest and rename it to manifest.json
Copy-Item "./brain-dump-inbox/manifest.chrome.json" "$chromeStaging/manifest.json" -Force

# Zip the staging folder using our clean function
Create-CleanZip -SourceDir $chromeStaging -ZipPath "./brain-dump-inbox-chrome.zip"

# Clean up staging folder
Remove-Item $chromeStaging -Recurse -Force
Write-Host "Chrome ZIP created successfully with forward-slash paths: brain-dump-inbox-chrome.zip" -ForegroundColor Green
