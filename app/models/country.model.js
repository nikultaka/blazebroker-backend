module.exports = (sequelize, Sequelize, DataTypes) => {
  const Country = sequelize.define(
    "country", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      }
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Country;
};
