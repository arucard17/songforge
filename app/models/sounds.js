// Example model


module.exports = function (sequelize, DataTypes) {

  var Sounds = sequelize.define('Sounds', {
    file: DataTypes.STRING,
    idNote: {
        type: DataTypes.INTEGER,
        references: "Note",
        referencesKey: "id"
    },
    idType: {
        type: DataTypes.INTEGER,
        references: "Type",
        referencesKey: "id"
    },
  }, {
    classMethods: {
      associate: function (models) {
        Sounds.belongsTo(models.Note, {foreignKey: 'idNote'});
        Sounds.belongsTo(models.Type, {foreignKey: 'idType'});
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
    tableName: 'sounds'
  });

  return Sounds;
};

