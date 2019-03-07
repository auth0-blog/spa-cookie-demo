require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:server');
const session = require('express-session');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const { join } = require('path');

const app = express();

// Middleware
app.use(helmet());

// Set up a request logger for Express, sending the
// output to `debug()`
app.use(morgan('dev', { stream: { write: m => debug(m) } }));

// Set up express-session (required by express-openid-connect)
app.use(
  session({
    secret: process.env.APP_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    }
  })
);

// Set up body-parser (required by express-openid-connect)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the /public folder
app.use(express.static(join(__dirname, '..', 'public')));

// Set up authentication middleware, only strictly required if
// the request isn't for the home page
app.use(
  auth({
    required: req => req.originalUrl !== '/'
  })
);

// Pull in routes for the API
app.use('/api', require('./api'));

// Serve the index file in response to any other request
// that doesn't match a static file or the API
app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Application listening on port ${port}`));
