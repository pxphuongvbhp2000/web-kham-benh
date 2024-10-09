import db from "../models/index"
require('dotenv').config();
import _, { reject } from 'lodash';
import emailService from './emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.AllCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.AllCodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.Users.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let checkRequiredFields = (data, arrFields) => {
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!data[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid, element
    }
}

let saveDetailInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment',
                'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'selectedSpecialty'];
            let checkObj = checkRequiredFields(data, arr);
            if (
                checkObj.isValid === false
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                // upsert to Markdown
                if (data.action === 'CREATE') {
                    await db.Markdowns.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId
                    })
                } else if (data.action === 'EDIT') {

                    let doctorMarkdown = await db.Markdowns.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false
                    });

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = data.contentHTML;
                        doctorMarkdown.contentMarkdown = data.contentMarkdown;
                        doctorMarkdown.description = data.description;
                        await doctorMarkdown.save();
                    }
                }

                // upsert to DoctorInfor
                let DoctorInfor = await db.Doctor_Infors.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false
                });

                if (DoctorInfor) {
                    //update
                    DoctorInfor.doctorId = data.doctorId;
                    DoctorInfor.priceId = data.selectedPrice;
                    DoctorInfor.provinceId = data.selectedProvince;
                    DoctorInfor.paymentId = data.selectedPayment;
                    DoctorInfor.nameClinic = data.nameClinic;
                    DoctorInfor.addressClinic = data.addressClinic;
                    DoctorInfor.provinceId = data.selectedProvince;
                    DoctorInfor.note = data.note;
                    DoctorInfor.specialtyId = data.selectedSpecialty;
                    DoctorInfor.clinicId = data.selectedClinic;
                    await DoctorInfor.save();
                }
                else {
                    //create
                    await db.Doctor_Infors.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        provinceId: data.selectedProvince,
                        note: data.note,
                        specialtyId: data.selectedSpecialty,
                        clinicId: data.selectedClinic
                    })
                }


                resolve({
                    errCode: 0,
                    errMessage: "Save detail infor doctor succeed"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Users.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.AllCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdowns, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        {
                            model: db.Doctor_Infors,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.AllCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedules.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                //convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }

                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })

                if (toCreate && toCreate.length > 0) {
                    await db.Schedules.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Schedules.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.AllCodes, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Users, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: true,
                    nest: true
                })

                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Doctor_Infors.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.AllCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.AllCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.AllCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Users.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.AllCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Markdowns, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        {
                            model: db.Doctor_Infors,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.AllCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.Bookings.findAll({
                    where: { doctorId: doctorId, statusId: 'S2', date: date },
                    include: [
                        {
                            model: db.Users,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.AllCodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                        { model: db.AllCodes, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },

                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrRemedy = ['email', 'doctorId', 'patientId'];
            let checkObj = checkRequiredFields(data, arrRemedy);
            if (
                checkObj.isValid === false
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                //update patient status

                let appointment = await db.Bookings.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }


                // send email remedy 

                await emailService.sendRemedyAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: "Send remedy succeed"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
}