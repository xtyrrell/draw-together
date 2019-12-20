#!/usr/bin/env bash
git pull origin master
npm i
npx pm2 start -f app.js --node-args="-r esm"
