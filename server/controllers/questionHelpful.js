var db = require('../db');
module.exports = {
  put: function (req, res) {
    db.query(`UPDATE questions SET question_helpful = question_helpful + 1 WHERE question_id = ${req.params.question_id} `)
      .then(() => {
        res.status(204).end('NO CONTENT');
      })
      .catch(err => {
        console.log(err);
      });
  }
};