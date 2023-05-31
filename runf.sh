#!/bin/bash

set -e

cd front-end

if [ -d "node_modules" ]; then
    echo "Skipping npm install commands as node_modules folder already exists"
else
    npm install
    npm install sweetalert2
fi

npm start
