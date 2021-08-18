// connect to the database
const { Client } = require('pg');


const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'QuestionsAndAnswers'
});
client.connect()
  .then( () => {
    console.log('Connected to Database');
  })
  .catch (err => {
    console.log(err);
  });

module.exports = client;