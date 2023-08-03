const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minLength: [2, 'Минимальная длина поля - 2 символа'],
    maxLength: [30, 'Максимальная длина поля - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле about должно быть заполнено'],
    minLength: [2, 'Минимальная длина поля - 2 символа'],
    maxLength: [30, 'Максимальная длина поля - 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле avatar должно быть заполнено'],
    validate: {
      validator: (v) => /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&=]*)$/.test(v),
      message: 'Поле должно содержать url',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
