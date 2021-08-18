var db = require('../db');
module.exports = {
  put: function (req, res) {
    db.query(`UPDATE answers SET answer_helpful = answer_helpful + 1 WHERE answer_id = ${req.params.answer_id} `)
      .then(() => {
        res.status(204).end('NO CONTENT');
      })
      .catch(err => {
        console.log(err);
      });
  }
};