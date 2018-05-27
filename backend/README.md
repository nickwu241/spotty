# Spotty

## Deploying to Heroku

```
docker build --rm -t spotty:latest .
docker tag spotty:latest registry.heroku.com/spotty-ruhacks/web
docker push registry.heroku.com/spotty-ruhacks/web
```

```
# Run Locally where .env contains FIREBASE_SERVICE_ACCOUNT_FILE=<base64 encoded secrets content>
docker run --rm -it -p 5000:5000 --env-file .env spotty:latest
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

* [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
* [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
* [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
* [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
