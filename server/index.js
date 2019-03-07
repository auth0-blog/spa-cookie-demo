require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:server');
const bodyParser = require('body-parser');
const { join } = require('path');

const app = express();

// Middleware
app.use(helmet());

// Set up a request logger for Express, sending the
// output to `debug()`
app.use(morgan('dev', { stream: { write: m => debug(m) } }));

// Set up body-parser (required by express-openid-connect)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the /public folder
app.use(express.static(join(__dirname, '..', 'public')));

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
