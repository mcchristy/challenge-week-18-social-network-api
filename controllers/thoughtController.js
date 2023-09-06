const { Thought, User } = require('../models');

const thoughtController = {
  
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },

 
  getThoughtById(req, res) {
    const { thoughtId } = req.params;

    Thought.findOne({ _id: thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  
  createThought(req, res) {
    const { thoughtText, username, userId } = req.body;

    Thought.create({ thoughtText, username })
      .then((thoughtData) => {
        
        return User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought created successfully' });
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteThought(req, res) {
    const { thoughtId } = req.params;

    Thought.findOneAndDelete({ _id: thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }

       
        return User.findOneAndUpdate(
          { thoughts: thoughtId },
          { $pull: { thoughts: thoughtId } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought deleted successfully' }))
      .catch((err) => res.status(400).json(err));
  },

  
  updateThought(req, res) {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { thoughtText },
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

  
  addReaction(req, res) {
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

module.exports = thoughtController;