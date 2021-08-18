const db = require('../db')
module.exports = {
  get: async function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    let count = req.query.count ? req.query.count : 5;
    let allAnswers = {
      question: req.params.question_id,
      page: page,
      count: count,
      results: []
    };

    await db.query(`SELECT answers.answer_id, answer_body, answer_date_written, answerer_name, answer_helpful, answers_photos.id, url\
                    FROM answers\
                    FULL OUTER JOIN answers_photos\
                    ON answers.answer_id = answers_photos.answer_id\
                    WHERE question_id = ${allAnswers.question}\
                    AND answer_reported = false`)
      .then((answers) => {

        var associationObject = {};
        for (var index = 0; index < answers.rows.length; index++) {
          if (associationObject[answers.rows[index].answer_id] === undefined) {
            associationObject[answers.rows[index].answer_id] = index;
            var answerObj = {
              answer_id: answers.rows[index].answer_id,
              body: answers.rows[index].body,
              date: new Date(answers.rows[index].date_written * 1000),
              answerer_name: answers.rows[index].answerer_name,
              helpfulness: answers.rows[index].answer_helpful,
              photos: []
            };
            allAnswers.results.push(answerObj);
          }
          if (answers.rows[index].url) {
            let photoObj = {
              id: answers.rows[index].id,
              url: answers.rows[index].url
            };
            allAnswers.results[associationObject[answers.rows[index].answer_id]].photos.push(photoObj);
          }
        }
      })
      .then(() => {
        res.status(200).send(allAnswers);
      })
      .catch(err => {
        console.log(err);
      });
  },
  post: async function (req, res) {
    var answer_id = await db.query(
      `INSERT INTO answers(question_id,answer_body,answer_date_written,answerer_name,answerer_email,answer_reported,answer_helpful)\
       VALUES(${req.params.question_id}, ${req.query.body},${Math.floor(new Date().getTime() / 1000.0)},\
              ${req.query.name}, ${req.query.email},false, 0)
       RETURNING answer_id`)
      .catch(err => {
        console.log(err);
      });
    if (req.query.photos) {
      var photoArray = req.query.photos.substring(2, req.query.photos.length - 2).replace(/','/g, ',').split(',');
      for (var index = 0; index < photoArray.length; index++) {
        await db.query(`
                       INSERT INTO answers_photos(answer_id,url)\
                       VALUES(${answer_id.rows[0].answer_id},'${photoArray[index]}')\
                       RETURNING id`)
          .catch(err => {
            console.log(err);
          });
      }
    }
    res.status(200).send('Finished');
  }
};
