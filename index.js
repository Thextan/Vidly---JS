const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const debug = require('debug')('app:startup');
const config = require('config');
const logger = require('./middleware/logger');
const authenticate = require('./auth');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');

// Configuration
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
};

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: '+ config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));
// console.log(`NODE_ENV: ${porcess.env.NODE_ENV}`);
// console.log(`app: $env`)
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // key=value&key=value
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use(authenticate);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);


mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));  

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));