const { Enum } = require('../../modules');

const PermissionGroup = new Enum({
  USER: 'USER',
  ADMIN: 'ADMIN',
});

module.exports = {
  PermissionGroup,
};
