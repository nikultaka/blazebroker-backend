module.exports = (sequelize, Sequelize, DataTypes) => {
  const Item = sequelize.define(
    "item", // Model name
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      checkout_id: {
        type: DataTypes.INTEGER
      },
      product_id: {
        type: DataTypes.INTEGER
      },
      qty: {
        type: DataTypes.INTEGER
      }
    },
    { 
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  return Item;
};
