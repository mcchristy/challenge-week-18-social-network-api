const { User, Thought, Reaction } = require('../models');

const reactionControllers = {

  createReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      {
        $push: {
          reactions: {
            reactionBody,
            username,
          },
        },
      },
      { new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  removeReaction(req, res) {
    const { thoughtId, reactionId } = req.params;

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      {
        $pull: {
          reactions: { reactionId },
        },
      },
      { new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = reactionController;