const { Schema, model } = require('mongoose');
const FlakeId = require('flake-idgen');
const format = require('biguint-format');
const merge = require('deepmerge');

const flakeIdGen = new FlakeId({ epoch: (2020 - 1970) * 31536000 * 1000 });

function buildModel(modelObj) {
  let modelSchema;
  if (modelObj.inherit && Array.isArray(modelObj.inherit)) {
    modelSchema = merge(...modelObj.inherit, modelObj.schema);
  } else {
    modelSchema = modelObj.schema;
  }

  modelSchema = {
    ...modelSchema,
    _id: {
      type: String,
      required: true,
      default: () => {
        return '' + format(flakeIdGen.next(), 'dec');
      },
    },
  };

  const schema = new Schema(modelSchema, { timestamps: true });

  if (modelObj.statics) {
    for (let funcName of Object.keys(modelObj.statics)) {
      schema.statics[funcName] = modelObj.statics[funcName];
    }
  }

  if (modelObj.methods) {
    for (let funcName of Object.keys(modelObj.methods)) {
      schema.methods[funcName] = modelObj.methods[funcName];
    }
  }

  return model(modelObj.name, schema);
}

const Discriminator = require('./discriminator');
const User = require('./user');
const Character = require('./character');
const Achievement = require('./achievement');

module.exports = {
  Discriminator: buildModel(Discriminator),
  User: buildModel(User),
  Character: buildModel(Character),
  Achievement: buildModel(Achievement),
};
