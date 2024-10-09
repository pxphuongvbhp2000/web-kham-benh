'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bookings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Bookings.belongsTo(models.Users, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' });

            Bookings.belongsTo(models.AllCodes, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' });
        }
    };
    Bookings.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Bookings',
    });
    return Bookings;
};