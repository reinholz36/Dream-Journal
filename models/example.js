module.exports = function (sequelize, DataTypes) {
  const Example = sequelize.define('Example', {
    text: DataTypes.STRING,
    description: DataTypes.TEXT,
    emoji: DataTypes.STRING
  });

  Example.associate = function (models) {
    Example.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Example;
};
