#!/bin/sh
echo "Installing dependencies for development..."
npm install
if [ "$NODE_ENV" = "production" ]; then
    echo "Build in production mode..."
    npm run build
    echo "Starting in production mode..."
    npm run start:prod
else
    echo "Starting in development mode..."
    npm run start:dev
fi
