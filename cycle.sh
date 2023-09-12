#!/bin/bash

git pull
chmod +x ./cycle.sh
pm2 restart app.js --name PhiLamb.info
