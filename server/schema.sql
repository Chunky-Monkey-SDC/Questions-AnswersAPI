/*
  1. if you have different csv files for Database add them to the folder
     and update the file paths below
  2. If you already have a Database comment out line 10
     and change line 11 too your Database name
  3. run this in terminal to create the tables and add the data
     make sure to run in root
     psql -h localhost -U postgres -f ./server/schema.sql
*/

CREATE DATABASE "QuestionsAndAnswers";
\c QuestionsAndAnswers;

CREATE TABLE questions(
  question_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  question_body VARCHAR(400) NOT NULL,
  question_date_written VARCHAR(100) NOT NULL,
  asker_name VARCHAR(100) NOT NULL,
  asker_email VARCHAR(100) NOT NULL,
  question_reported BOOLEAN NOT NULL,
  question_helpful INT NOT NULL
);
CREATE TABLE answers(
  answer_id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  answer_body VARCHAR(400) NOT NULL,
  answer_date_written VARCHAR(100) NOT NULL,
  answerer_name VARCHAR(100) NOT NULL,
  answerer_email VARCHAR(100) NOT NULL,
  answer_reported BOOLEAN NOT NULL,
  answer_helpful INT NOT NULL,
  FOREIGN KEY (question_id)
  REFERENCES questions(question_id)
);
CREATE TABLE answers_photos(
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR(400) NOT NULL,
  FOREIGN KEY (answer_id)
  REFERENCES answers(answer_id)
);

/* -----------------------------Adding data----------------------------------- */
COPY questions
FROM '/Users/alan/Documents/SDC/Questions-AnswersAPI/csvFiles/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers
FROM '/Users/alan/Documents/SDC/Questions-AnswersAPI/csvFiles/answers.csv'
DELIMITER ','
CSV HEADER;

COPY answers_photos
FROM '/Users/alan/Documents/SDC/Questions-AnswersAPI/csvFiles/answers_photos.csv'
DELIMITER ','
CSV HEADER;

/* ------------------------------Setting Sequence ----------------------------- */
/*
  When we use /copy or copy the SERIAL aspect of our tables does not increment since
  we are not adding 1 at a time. Because of this we must set the value to the last
  position of the CSV files.
  NOTE: if you are using a different set of CSV files change the integers on the lines
  below to represent the last position of each sequence.
*/
SELECT setval('questions_question_id_seq',3518963, true);
SELECT setval('answers_answer_id_seq',6879306, true);
SELECT setval('answers_photos_id_seq',2063759, true);



/* ------------------------------ Creating Indexing ------------------------------*/
/*
  This allows for the data to have a certain lvl of organization that allows querying
  speed to be faster.
*/
CREATE INDEX product_id ON questions(product_id,question_reported);
CREATE INDEX question_id ON answers(question_id, answer_reported);
CREATE INDEX answer_id ON answers_photos(answer_id);