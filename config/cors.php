<?php

return [
    // Apply CORS to API routes
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Allow Next.js dev server origins (any port on localhost/127.0.0.1)
    'allowed_origins' => [
        // ...explicit common origins for clarity
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [
        '#^https?://localhost(:\\d+)?$#',
        '#^https?://127\\.0\\.0\\.1(:\\d+)?$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
