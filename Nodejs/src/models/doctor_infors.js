'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Infors extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_Infors.belongsTo(models.Users, { foreignKey: 'doctorId' });

            Doctor_Infors.belongsTo(models.AllCodes, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' });
            Doctor_Infors.belongsTo(models.AllCodes, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData' });
            Doctor_Infors.belongsTo(models.AllCodes, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' });
        }
    };
    Doctor_Infors.init({
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Doctor_Infors',
        //freezeTableName: true
    });
    return Doctor_Infors;
};