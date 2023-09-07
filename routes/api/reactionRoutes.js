const router = require('express').Router();
const {
  createReaction,
  removeReaction,
} = require('../controllers/reactionController');

router.post('/:thoughtId', createReaction);

router.delete('/:thoughtId/:reactionId', removeReaction);

module.exports = router;