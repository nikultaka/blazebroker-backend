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
      first_name :{
        type: DataTypes.STRING,
        allowNull: true
      },
      last_name :{
        type: DataTypes.STRING,
        allowNull: true
      },
      address :{
        type: DataTypes.STRING,
        allowNull: true
      },
      city :{
        type: DataTypes.STRING,
        allowNull: true
      },
      state :{
        type: DataTypes.STRING,
        allowNull: true
      },
      subtotal: {
        type: DataTypes.STRING
      },
      total: {
        type: DataTypes.STRING
      },
      transaction_id: {
        type: DataTypes.STRING
      },
      transaction_response: {
        type: DataTypes.TEXT
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
