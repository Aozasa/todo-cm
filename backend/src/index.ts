import express from 'express';
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Start on port 3000.');
});

app.use('/', require('./routes'));
