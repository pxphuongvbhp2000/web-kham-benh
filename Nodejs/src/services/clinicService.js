import db from "../models/index";

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

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arr = ['name', 'address', 'imageBase64', 'descriptionMarkdown', 'descriptionHTML'];
            let checkObj = checkRequiredFields(data, arr);

            if (
                checkObj.isValid === false
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                await db.Clinics.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: "Create clinic succeed"
                })

            }

        } catch (e) {
            reject(e);
        }
    })
}


let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinics.findAll({
                raw: false,
                nest: true
            });

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data: data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailClinicById = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {

                let doctorClinic = [];

                let data = await db.Clinics.findOne({
                    where: { id: clinicId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                })


                if (data) {
                    doctorClinic = await db.Doctor_Infors.findAll({
                        where: {
                            clinicId: clinicId
                        },
                        attributes: ['doctorId', 'provinceId'],
                    })

                    data.doctorClinic = doctorClinic;
                } else data = {}


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


module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
}