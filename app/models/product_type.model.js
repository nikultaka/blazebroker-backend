module.exports = (sequelize, Sequelize, DataTypes) => {
  const ProductType = sequelize.define(
    "product_type", // Model name
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue : 1 
      },
     
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return ProductType;
};
