#!/bin/sh

echo "Waiting for MongoDB to start..."
sleep 5  # Give MongoDB some time to initialize

echo "Starting Django server..."
exec "$@"
