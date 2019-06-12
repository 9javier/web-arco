#!/usr/bin/env bash
su
su sga
cd /home/sga/sga-app-logistica-krack/ && git reset --hard && git pull && ionic build --project sga --prod -- --base-href /sga/ && rm -rf ../content && cp -R dist/apps ../content && cp ../content/sga/index.html ../content/index.html
