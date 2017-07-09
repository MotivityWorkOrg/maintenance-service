### installation

Clone the repo:

```bash
$ https://github.com/MotivityWorkOrg/maintenance-service.git
$ cd maintenance-service
```

Install dependencies:

```bash
$ npm install
```

### development

Run server with:

```bash
$ npm start
```

It runs express server on localhost on port 3000 and webpack-dev-server on port 3001 with proxing requests from the first one to the second one.

You can specify host of the application:

```bash
$ APP_HOST=appdomain.com npm start
```

Application has two separate directory `frontend` and `backend`. The entry point for frontend is `frontend/app.es6.js` file and for backend it is `backend/server.js`.

### production

Build assets for the application:

```bash
update soon
```

Then run the app:

```bash
$ NODE_ENV=production npm start
```

Do not forget to specify your app domain in `server.js` for production mode!

### Have fun!
