module.exports = (sequelize, Sequelize, DataTypes) => {
  const Checkout = sequelize.define(
    "checkout", // Model name
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING
      },
      mobile: {
        type: DataTypes.STRING
      },
      subtotal: {
        type: DataTypes.STRING
      },
      total: {
        type: DataTypes.STRING
      }
    },
    { 
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  return Checkout;
};
