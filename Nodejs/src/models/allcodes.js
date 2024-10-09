'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AllCodes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            AllCodes.hasMany(models.Users, { foreignKey: 'positionId', as: 'positionData' });
            AllCodes.hasMany(models.Users, { foreignKey: 'gender', as: 'genderData' });

            AllCodes.hasMany(models.Schedules, { foreignKey: 'timeType', as: 'timeTypeData' });

            AllCodes.hasMany(models.Doctor_Infors, { foreignKey: 'priceId', as: 'priceTypeData' });
            AllCodes.hasMany(models.Doctor_Infors, { foreignKey: 'provinceId', as: 'provinceTypeData' });
            AllCodes.hasMany(models.Doctor_Infors, { foreignKey: 'paymentId', as: 'paymentTypeData' });

            AllCodes.hasMany(models.Bookings, { foreignKey: 'timeType', as: 'timeTypeDataPatient' });
        }
    };
    AllCodes.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'AllCodes',
    });
    return AllCodes;
};