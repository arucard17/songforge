// Example model


module.exports = function (sequelize, DataTypes) {

  var Type = sequelize.define('Type', {
    name: DataTypes.STRING,
    class: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Type.hasMany(models.Sounds, {foreignKey: 'idType'});
      }
    },
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: false,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: false,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'type'
  });

  return Type;
};

