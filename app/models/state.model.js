module.exports = (sequelize, Sequelize, DataTypes) => {
  const State = sequelize.define(
    "state", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      country_id :{
        type: DataTypes.INTEGER,
      },
      code:{
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      }
    },
    
  );

  return State;
};
