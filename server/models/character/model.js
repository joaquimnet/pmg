const { model, Schema } = require('mongoose');
const schema = require('./schema');

const characterSchema = new Schema(schema, { timestamps: true });

module.exports = model('character', characterSchema);
