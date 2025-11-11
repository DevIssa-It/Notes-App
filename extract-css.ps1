#!/usr/bin/env pwsh
# Extract CSS Automation Script
# Usage: .\extract-css.ps1 <component-name>

param(
    [Parameter(Mandatory=$true)]
    [string]$ComponentName
)

$componentFile = "src/components/$ComponentName.js"
$styleFile = "src/components/styles/$ComponentName-styles.js"

if (!(Test-Path $componentFile)) {
    Write-Error "Component file not found: $componentFile"
    exit 1
}

Write-Host "📝 Extracting CSS from $ComponentName.js..." -ForegroundColor Cyan

# Read the component file
$content = Get-Content $componentFile -Raw

# Extract CSS between <style> tags (simplified regex)
if ($content -match '(?s)template\.innerHTML\s*=\s*`\s*<style>(.*?)</style>') {
    $cssContent = $matches[1]
    
    # Create style file
    $styleName = $ComponentName -replace '-', ''
    $styleName = (Get-Culture).TextInfo.ToTitleCase($styleName) -replace '\s', ''
    $styleName = $styleName.Substring(0,1).ToLower() + $styleName.Substring(1) + 'Styles'
    
    $styleFileContent = @"
// Exported component styles for $ComponentName
export const $styleName = ``
$cssContent
``;
"@
    
    Set-Content -Path $styleFile -Value $styleFileContent
    Write-Host "✅ Created: $styleFile" -ForegroundColor Green
    
    # Update component file
    $updatedContent = $content -replace '(?s)(<style>)(.*?)(</style>)', "`$1`n    `${$styleName}`n  `$3"
    $updatedContent = "import { $styleName } from './styles/$ComponentName-styles.js';`n" + $updatedContent
    
    Set-Content -Path $componentFile -Value $updatedContent
    Write-Host "✅ Updated: $componentFile" -ForegroundColor Green
    
    Write-Host "`n📊 Statistics:" -ForegroundColor Yellow
    $originalLines = (Get-Content $componentFile | Measure-Object -Line).Lines
    Write-Host "  Component file: $originalLines lines"
    
    Write-Host "`n💡 Next steps:" -ForegroundColor Magenta
    Write-Host "  1. Review changes in both files"
    Write-Host "  2. Test the component"
    Write-Host "  3. Commit with: git add src/components/$ComponentName.js src/components/styles/$ComponentName-styles.js"
    Write-Host "  4. git commit -m 'refactor: extract $ComponentName styles'"
    
} else {
    Write-Error "Could not find <style> tags in $componentFile"
    exit 1
}
