const { Schema, model } = require('mongoose');
const FlakeId = require('flake-idgen');
const format = require('biguint-format');
const merge = require('deepmerge');
const fs = require('fs');

const flakeIdGen = new FlakeId({ epoch: (2020 - 1970) * 31536000 * 1000 });

function buildModel(modelObj) {
  let modelSchema;
  if (modelObj.inherit && Array.isArray(modelObj.inherit)) {
    modelSchema = merge(
      ...modelObj.inherit.map((inherit) => inherit.schema ?? inherit),
      modelObj.schema,
    );
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

function toTitleCase(str) {
  return str
    .trim()
    .replace(/[\W]/g, ' ')
    .replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
    .replace(/\s/g, '');
}

const files = fs.readdirSync(__dirname, 'utf-8').filter((p) => p.match(/.model.js$/));

const models = {};

for (let file of files) {
  const model = require('./' + file.replace(/.js$/, ''));
  models[toTitleCase(model.name)] = buildModel(model);
}

module.exports = models;
