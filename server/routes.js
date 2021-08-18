var controller = require('./controllers');
var router = require('express').Router();

router.get('/qa/questions', controller.questions.get); // retrieves all the questions
router.post('/qa/questions', controller.questions.post); // adds question

router.get('/qa/questions/:question_id/answers', controller.answers.get); // gets answers for given question
router.post('/qa/questions/:question_id/answers', controller.answers.post); // adds answer for given question

router.put('/qa/questions/:question_id/helpful', controller.questionHelpful.put); // updates a question to show it was helpful
router.put('/qa/questions/:question_id/report', controller.questionReported.put); // updates question to show it was reported

router.put('/qa/answers/:answer_id/helpful', controller.answerHelpful.put); // marks an answer helpful
router.put('/qa/answers/:answer_id/report', controller.answerReported.put); // updates answers to show it was reported
module.exports = router;


// CREATE INDEX product_id_index ON reviews (product_id ASC);