#!/bin/bash
cd "$(dirname "$0")"
npm run build --configuration=production
rm -rf ../nginx/html/*
cp -r dist/pfe-front/browser/* ../nginx/html/
