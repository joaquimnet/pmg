const { PermissionGroup } = require('./enums');

module.exports = {
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
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
};
