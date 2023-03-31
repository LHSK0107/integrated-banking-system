module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      user_no:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_code:{
        type: DataTypes.STRING(12),
        defaultValue: "ROLE_USER"
      },
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      dept: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(330),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    });
    return Users;
  };