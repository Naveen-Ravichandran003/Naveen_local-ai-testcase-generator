$port = 3001
$root = "c:\Users\Welcome\OneDrive\Documents\Naveen Ravichandran - AI Testing\Project 1 - Local Test Case Generator"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "🚀 BLAST Server started at http://localhost:$port/" -ForegroundColor Green
    Write-Host "Project Root: $root"
    Write-Host "Press Ctrl+C to stop."
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $relativeUrl = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relativeUrl)) { $relativeUrl = "index.html" }
        
        $filePath = [System.IO.Path]::Combine($root, $relativeUrl)
        
        Write-Host "REQ: $($request.Url.LocalPath) -> $filePath"
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css" }
                ".js" { "application/javascript" }
                ".png" { "image/png" }
                ".jpg" { "image/jpeg" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        else {
            Write-Host "❌ NOT FOUND: $filePath" -ForegroundColor Red
            $response.StatusCode = 404
        }
        $response.Close()
    }
}
finally {
    $listener.Stop()
}
