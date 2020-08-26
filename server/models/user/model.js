const { model, Schema } = require('mongoose');
const schema = require('./schema');

const userSchema = new Schema(schema, { timestamps: true });

module.exports = model('user', userSchema);
