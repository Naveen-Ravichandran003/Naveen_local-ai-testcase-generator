$url = "http://localhost:11434/api/tags"
try {
    Write-Output "Testing connection to Ollama API..."
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Output "Connection Successful!"
    $modelToMatch = "llama3.2:3b"
    $found = $false
    foreach ($m in $response.models) {
        if ($m.name -eq $modelToMatch) {
            $found = $true
        }
    }
    if ($found) {
        Write-Output "Model $modelToMatch is ready."
    }
    else {
        Write-Output "Model $modelToMatch not found."
    }
}
catch {
    Write-Output "Error: Could not connect to Ollama."
}
