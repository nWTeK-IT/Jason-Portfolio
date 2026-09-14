$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$listener = [System.Net.HttpListener]::new()
$prefix = 'http://localhost:8000/'
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Serving $root at $prefix"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)

    if ([string]::IsNullOrWhiteSpace($requestPath) -or $requestPath -eq '/') {
        $requestPath = '/index.html'
    }

    $relativePath = $requestPath.TrimStart('/')
    $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $relativePath))
    $rootFullPath = [System.IO.Path]::GetFullPath($root)

    if (-not $fullPath.StartsWith($rootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        $context.Response.StatusCode = 403
        $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
    }
    elseif (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $context.Response.StatusCode = 404
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
    }
    else {
        $context.Response.StatusCode = 200
        $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()

        switch ($extension) {
            '.html' { $contentType = 'text/html' }
            '.css' { $contentType = 'text/css' }
            '.js' { $contentType = 'application/javascript' }
            '.json' { $contentType = 'application/json' }
            '.png' { $contentType = 'image/png' }
            '.jpg' { $contentType = 'image/jpeg' }
            '.jpeg' { $contentType = 'image/jpeg' }
            '.svg' { $contentType = 'image/svg+xml' }
            '.ico' { $contentType = 'image/x-icon' }
            default { $contentType = 'application/octet-stream' }
        }

        $context.Response.ContentType = $contentType
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.OutputStream.Close()
        continue
    }

    $context.Response.ContentType = 'text/plain'
    $context.Response.ContentLength64 = $body.Length
    $context.Response.OutputStream.Write($body, 0, $body.Length)
    $context.Response.OutputStream.Close()
}
