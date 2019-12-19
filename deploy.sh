#!/usr/bin/env bash
git pull origin master
npm i
npx pm2 start app.js
