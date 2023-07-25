const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send(user))
    .catch((err) => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};
