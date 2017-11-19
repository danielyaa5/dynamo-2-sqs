// npm
const miss = require('mississippi2');
const Joi = require('joi');

function piper(pipes) {
  // validation
  Joi.assert(pipes, Joi.array().required());

  return new Promise((resolve, reject) => miss.pipe(...pipes, err => {
    if (err) {
      return reject(err);
    }

    resolve();
  }));
}

module.exports = piper;
