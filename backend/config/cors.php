<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],  // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    
    'allowed_origins' => [ 'http://localhost:5174','http://localhost:5173'], // React dev server URL
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'], // Allow all headers
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true, // Allow credentials (cookies, authorization headers, etc.)

];
