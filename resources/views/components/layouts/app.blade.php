<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SoliPHPairE</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        @vite(['resources/sass/app.scss', 'resources/js/app.js'])
    </head>
    <body class="d-flex vh-100 text-center text-white bg-dark">
        <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
            <header class="mb-auto align-self-center">
                <div>
                    <h1 class="float-md-start mb-0">SoliPHPairE</h1>
                </div>
            </header>
            <main class="px-3">
                {{ $slot }}
            </main>

            <footer class="mt-auto text-white-50">
                <p>Made by Jordi Huertas (https://github.com/jordihuertas/SoliPHPaire)</p>
            </footer>
        </div>
        @stack('custom-scripts')
    </body>
</html>
