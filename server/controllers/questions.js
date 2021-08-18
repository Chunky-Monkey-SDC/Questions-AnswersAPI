var db = require('../db');
module.exports = {
  get: async function (req, res) {
    let count = req.query.count ? req.query.count : 5;
    let page = req.query.page ? req.query.page : 1;
    let resultObject = {
      product_id: `${req.query.product_id}`,
      results: []
    };
    await db.query(`
    SELECT questions.question_id , questions.question_body, questions.question_date_written,questions.asker_name,
           questions.question_helpful, questions.question_reported, answers.answer_id,
           answers.answer_body, answers.answer_date_written, answers.answerer_name,
           answers.answer_helpful,answers.answer_reported, answers_photos.id, answers_photos.url
    FROM questions
    FULL OUTER JOIN answers on questions.question_id = answers.question_id
    FULL OUTER JOIN answers_photos on answers.answer_id = answers_photos.answer_id
    WHERE questions.product_id = 1 AND questions.question_reported IS NOT true AND answers.answer_reported IS NOT true;`)
      .then((results) => {
        console.log(results.rows[0]);
        let questionMemo = {};
        let answerMemo = {};
        for (var index = 0; index < results.rows.length; index++) {

          if (questionMemo[results.rows[index].question_id] === undefined) {
            questionMemo[results.rows[index].question_id] = resultObject.results.length;
            let questionObject = {
              question_id: results.rows[index].question_id,
              question_body: results.rows[index].question_body,
              question_date: new Date(results.rows[index].question_date_written * 1000),
              asker_name: results.rows[index].asker_name,
              question_helpfulness: results.rows[index].question_helpful,
              reported: results.rows[index].reported,
              answers: {}
            }
            resultObject.results.push(questionObject);
          }
          if (answerMemo[results.rows[index].answer_id] === undefined && results.rows[index].answer_id ) {
            answerMemo[results.rows[index].answer_id] = results.rows[index].answer_id;
            let answerObject = {
              answer_id: results.rows[index].answer_id,
              answer_body: results.rows[index].answer_body,
              answer_date_written: results.rows[index].answer_date_written,
              answerer_name: results.rows[index].answerer_name,
              answer_helpful: results.rows[index].answer_helpful,
              photos: []
            }
            resultObject.results[questionMemo[results.rows[index].question_id]].answers[answerObject.answer_id] = answerObject;
          }
          if (results.rows[index].url) {
            let photoObject = {
              id: results.rows[index].id,
              url: results.rows[index].url
            }
            resultObject.results[questionMemo[results.rows[index].question_id]].answers[answerMemo[results.rows[index].answer_id]].photos.push(photoObject);
          }
        }
      })
      .then(() => {
        res.status(200).send(resultObject);
      })
      .catch(err => {
        console.log(err);
      })
  },
  post: function (req, res) {
    db.query(
      `INSERT INTO questions(product_id,question_body,question_date_written,asker_name,asker_email,question_reported,question_helpful)\
       VALUES(${req.query.product_id}, ${req.query.body},${Math.floor(new Date().getTime() / 1000.0)},\
              ${req.query.name}, ${req.query.email},false, 0)
       RETURNING question_id`)
      .then(() => {
        res.status(201).end('CREATED');
      })
      .catch(err => {
        console.log(err);
      });
  }
};