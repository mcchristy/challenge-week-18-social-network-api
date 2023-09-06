const { User, Thought } = require('../models');

const userControllers = {

  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  getUserById(req, res) {
    const { userId } = req.params;

    User.findOne({ _id: userId })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },


  createUser(req, res) {
    const { username, email } = req.body;

    User.create({ username, email })
      .then((userData) => res.json(userData))
      .catch((err) => res.status(400).json(err));
  },

  updateUser(req, res) {
    const { userId } = req.params;
    const { username, email } = req.body;

    User.findOneAndUpdate({ _id: userId }, { username, email }, { new: true })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(400).json(err));
  },


  deleteUser(req, res) {
    const { userId } = req.params;

    User.findOneAndDelete({ _id: userId })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }

        return Thought.deleteMany({ _id: { $in: userData.thoughts } });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted' }))
      .catch((err) => res.status(400).json(err));
  },

  addFriend(req, res) {
    const { userId, friendId } = req.params;

    User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(400).json(err));
  },

  removeFriend(req, res) {
    const { userId, friendId } = req.params;

    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userControllers;