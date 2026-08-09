$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$listener = [System.Net.HttpListener]::new()
$prefix = 'http://localhost:8000/'
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath
    if ($requestPath -eq '/') { $requestPath = '/.vscode/index.html' }
    $relativePath = $requestPath.TrimStart('/')
    $fullPath = [System.IO.Path]::Combine($root, $relativePath)
    if (-not [System.IO.Path]::HasExtension($relativePath)) {
        $fullPath = [System.IO.Path]::Combine($fullPath, 'index.html')
    }
    if ([System.IO.File]::Exists($fullPath)) {
        $contentType = 'text/html'
        if ($fullPath.EndsWith('.css')) { $contentType = 'text/css' }
        elseif ($fullPath.EndsWith('.js')) { $contentType = 'application/javascript' }
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $context.Response.ContentType = $contentType
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.OutputStream.Close()
    } else {
        $context.Response.StatusCode = 404
        $response = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $context.Response.ContentLength64 = $response.Length
        $context.Response.OutputStream.Write($response, 0, $response.Length)
        $context.Response.OutputStream.Close()
    }
}
