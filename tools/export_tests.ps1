param (
    [string]$Content,
    [string]$FileName = "Generated_Test_Cases.md"
)

$outputPath = Join-Path -Path (Get-Location) -ChildPath $FileName

try {
    $Content | Out-File -FilePath $outputPath -Encoding utf8
    $result = @{
        status  = "success"
        path    = $outputPath
        message = "Test cases exported successfully to $FileName"
    }
}
catch {
    $result = @{
        status  = "error"
        message = $_.Exception.Message
    }
}

$result | ConvertTo-Json
