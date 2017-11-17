#!/usr/bin/env bash

npm run build
git add .
git commit -m 'build dist'
git push -u origin HEAD
