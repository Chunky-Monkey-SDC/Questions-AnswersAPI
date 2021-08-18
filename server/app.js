const express = require('express');
var db = require('./db');
var router = require('./routes.js');

const app = express();


app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});