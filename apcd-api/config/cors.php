<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',  // frontend vite
        'http://127.0.0.1:5173',  // parfois vite tourne sur 127.0.0.1
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // ⚡ OBLIGATOIRE pour Sanctum/Auth
];
