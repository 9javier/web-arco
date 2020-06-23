#!/usr/bin/env bash
#su
#su sga
export NODE_OPTIONS="--max-old-space-size=1900"
cd /home/sga/sga-app-logistica-krack/ && git reset --hard && git pull && ionic build --project sga --configuration=dev --prod -- --base-href /sga/ && rm -rf ../content && cp -R dist/apps ../content && cp ../content/sga/index.html ../content/index.html
