#!/bin/bash
cd /vercel/share/v0-project
rm -rf .next
rm -rf node_modules/.cache
pkill -9 -f "next dev"
sleep 2
echo "Cache cleared successfully"
