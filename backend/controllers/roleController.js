const Role = require("../models/Role");

const createDefaultRoles = async () => {
  const roles = ["customer", "admin", "staff"];
  for (const roleName of roles) {
    const existingRole = await Role.findOne({ name: roleName });
    if (!existingRole) {
      await Role.create({ name: roleName });
      console.log(`Role ${roleName} created`);
    }
  }
};

module.exports = createDefaultRoles;
