module.exports = (sequelize, Sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product", // Model name
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      seller_id: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      product_type :{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      sativa: {
        type: DataTypes.STRING
      },
      thc: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      image: {
        type: DataTypes.STRING
      },
      price: {  
        type: DataTypes.DECIMAL
      },
      stock: {
        type: DataTypes.INTEGER
      },
      remaining_stock: {
        type: DataTypes.INTEGER
      },
      status:{
        type: DataTypes.TINYINT,
        defaultValue : 1 
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
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

  return Product;
};
