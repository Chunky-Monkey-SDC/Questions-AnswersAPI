// connect to the database
const { Client } = require('pg');


const client = new Client({
  host: 'ec2-3-144-104-26.us-east-2.compute.amazonaws.com',
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