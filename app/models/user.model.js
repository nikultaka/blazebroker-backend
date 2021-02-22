module.exports = (sequelize, Sequelize, DataTypes) => {
  const User = sequelize.define(
    "user", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        //unique: true
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      contact: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      company_name: {
        type: DataTypes.STRING
      },
      zip: {
        type: DataTypes.STRING
      },
      document: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      },
      province: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      area: {
        type: DataTypes.STRING
      },
      shop_name: {
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

  return User;
};
