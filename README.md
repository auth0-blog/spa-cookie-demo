# SPA Authentication Demo

This is a sample app designed to demonstrate securing a SPA with a backend server using cookies. It uses [`express-openid-connect`](https://github.com/auth0/express-openid-connect) as the authentication middleware, and issues cookies which are then sent with the AJAX requests to the `/api` endpoint.

## Setting up

Clone the project, then install the dependencies using `npm`:

```bash
$ npm install
```

## Running the Application

To start the application on port 3000, use:

```base
$ npm run dev
```

This will start a nodemon server. The application can be accessed by visiting http://localhost:3000.
