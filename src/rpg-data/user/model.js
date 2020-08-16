const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  
}, { timestamps: true });

module.exports = model('user', userSchema);
