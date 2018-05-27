#!/bin/sh
set -xeu

SECRET_FILE="spotty-ruhacks-firebase-adminsdk.json"
echo ${FIREBASE_SERVICE_ACCOUNT_FILE} | base64 --decode > $SECRET_FILE

npm start
