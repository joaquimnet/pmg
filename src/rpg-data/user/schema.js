const merge = require('deepmerge');
const { SchemaTypes } = require('mongoose');

const entitySchema = require('../entity/schema');
const { PermissionGroup } = require('./enums');

const IntergerStartingAtZero = {
  type: Number,
  get: (v) => Math.round(v),
  set: (v) => Math.round(v),
  min: 0,
  default: 0,
};

const userSchema = {
  discordId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  permissionGroup: {
    type: String,
    enum: PermissionGroup.toArray(),
    default: PermissionGroup.USER,
    required: true,
  },
  level: {
    ...IntergerStartingAtZero,
    min: 1,
    default: 1,
  },
  money: {
    ...IntergerStartingAtZero,
  },
  titles: {
    type: [SchemaTypes.ObjectId],
  },
  activeTitle: {
    type: SchemaTypes.ObjectId,
    default: null,
  },
  adventure: {
    rank: {
      type: String,
      enum: ['E', 'D', 'C', 'B', 'A', 'S', 'SS'],
      required: true,
      default: 'E',
    },
    currentQuest: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
  },
  skill_mastery: {
    equipment: {
      blade_weapons: IntergerStartingAtZero,
      blunt_weapons: IntergerStartingAtZero,
      powerfists: IntergerStartingAtZero,
      unarmed: IntergerStartingAtZero,
      staffs: IntergerStartingAtZero,
      bows: IntergerStartingAtZero,
      shields: IntergerStartingAtZero,
      light_armor: IntergerStartingAtZero,
      medium_armor: IntergerStartingAtZero,
      heavy_armor: IntergerStartingAtZero,
    },
    magic: {
      fire: IntergerStartingAtZero,
      water: IntergerStartingAtZero,
      air: IntergerStartingAtZero,
      earth: IntergerStartingAtZero,
      light: IntergerStartingAtZero,
      dark: IntergerStartingAtZero,
      void: IntergerStartingAtZero,
      gravity: IntergerStartingAtZero,
      cosmic: IntergerStartingAtZero,
      time: IntergerStartingAtZero,
      electric: IntergerStartingAtZero,
      ice: IntergerStartingAtZero,
      crystal: IntergerStartingAtZero,
      toxic: IntergerStartingAtZero,
      illusion: IntergerStartingAtZero,
      summoning: IntergerStartingAtZero,
      blood: IntergerStartingAtZero,
      enhancement: IntergerStartingAtZero,
    },
    crafting: {
      smithing: IntergerStartingAtZero,
      spellcrafting: IntergerStartingAtZero,
      enchanting: IntergerStartingAtZero,
      tailoring: IntergerStartingAtZero,
      alchemy: IntergerStartingAtZero,
      cooking: IntergerStartingAtZero,
      metallurgy: IntergerStartingAtZero,
      medicine: IntergerStartingAtZero,
      engineering: IntergerStartingAtZero,
    },
    gathering: {
      mining: IntergerStartingAtZero,
      woodcutting: IntergerStartingAtZero,
      fishing: IntergerStartingAtZero,
      hunting: IntergerStartingAtZero,
      farming: IntergerStartingAtZero,
    },
    life: {
      athletics: IntergerStartingAtZero,
      speech: IntergerStartingAtZero,
      stealth: IntergerStartingAtZero,
      taming: IntergerStartingAtZero,
      archeology: IntergerStartingAtZero,
      awareness: IntergerStartingAtZero,
      swimming: IntergerStartingAtZero,
    },
    resistances: {
      fire: IntergerStartingAtZero,
      water: IntergerStartingAtZero,
      air: IntergerStartingAtZero,
      earth: IntergerStartingAtZero,
      light: IntergerStartingAtZero,
      dark: IntergerStartingAtZero,
      void: IntergerStartingAtZero,
      gravity: IntergerStartingAtZero,
      cosmic: IntergerStartingAtZero,
      time: IntergerStartingAtZero,
      electric: IntergerStartingAtZero,
      ice: IntergerStartingAtZero,
      crystal: IntergerStartingAtZero,
      toxic: IntergerStartingAtZero,
      illusion: IntergerStartingAtZero,
      blood: IntergerStartingAtZero,
    },
  },
  character_skills: {
    type: [SchemaTypes.ObjectId],
  },
  learned_spells: {
    type: [SchemaTypes.ObjectId],
  },
  inventory: {
    head: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    chest: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    bottom: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    boots: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    gloves: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    weapon: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    offhand: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    bag: {
      type: [SchemaTypes.ObjectId],
    },
  },
};

module.exports = merge(entitySchema, userSchema);
