import { readDirectory } from '../modules/FileLoader';

import { Schema, model, SchemaDefinition, Model } from 'mongoose';
import FlakeId from 'flake-idgen';
import format from 'biguint-format';
import merge from 'deepmerge';
import { PMGModel } from './interfaces';

const flakeIdGen = new FlakeId({ epoch: (2020 - 1970) * 31536000 * 1000 });

function buildModel(modelObj: PMGModel) {
  let modelSchema: SchemaDefinition;
  if (modelObj.inherit && Array.isArray(modelObj.inherit)) {
    modelSchema = (merge as any)(
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
    for (const funcName of Object.keys(modelObj.statics)) {
      schema.statics[funcName] = modelObj.statics[funcName];
    }
  }

  if (modelObj.methods) {
    for (const funcName of Object.keys(modelObj.methods)) {
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

const files = readDirectory({
  dir: __dirname,
  debug: true,
  useTypescript: true,
  ignorePattern: '!*.model.[tj]s',
});

const models = new Map<string, typeof Model>();

for (const file of files) {
  const required = module.require(file.replace(/.(t|j)s$/, ''));
  models.set(toTitleCase(required.name), buildModel(required.default ?? required));
}

export default models;
