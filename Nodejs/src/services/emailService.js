require('dotenv').config();
import nodemailer from 'nodemailer';

let sendBookingConfirmMail = async (dataSend) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({

        port: 587,
        secure: false, // true for 465, false for other ports
        //test
        // auth: {
        //     user: testAccount.user, // generated ethereal user
        //     pass: testAccount.pass, // generated ethereal password
        // },
        // host: 'smtp.ethereal.email',

        // real
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        host: 'smtp.gmail.com'
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"From" <bookingcare@example.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let res = ``;
    if (dataSend.language === 'vi') {
        res =
            `
            <h3>Xin chào ${dataSend.patientName} </h3>
            <p>Bạn nhận được email vì đã đặt lịch khám bệnh online trên booking care.</p>

            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            
            <p>
                Nếu các thông tin là đúng sự thật, vui lòng click vào đường link bên dưới 
                để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
            </p>

            <div>
                <a href = ${dataSend.reciverLink} target="_blank">Click here</a>
            </div>

            <p>Trân thành cảm ơn!</p>
        `
    }

    if (dataSend.language === 'en') {
        res =
            `
            <h3>Dear ${dataSend.patientName} </h3>
            <p>You received an email because you booked an online medical appointment on booking care.</p>

            <p>Information to book a medical appointment:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            
            <p>
                If the information is true, please click on the link below to confirm and complete the procedure 
                to book an appointment.
            </p>

            <div>
                <a href = ${dataSend.reciverLink} target="_blank">Click here</a>
            </div>

            <p>Would like to thank!</p>
        `
    }

    return res;
}


let sendRemedyAttachment = async (dataSend) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({

        port: 587,
        secure: false, // true for 465, false for other ports
        //test
        // auth: {
        //     user: testAccount.user, // generated ethereal user
        //     pass: testAccount.pass, // generated ethereal password
        // },
        // host: 'smtp.ethereal.email',

        // real
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        host: 'smtp.gmail.com'
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"From" <bookingcare@example.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đơn thuốc", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {   // utf-8 string as an attachment
                filename: `remedy-${dataSend.patientName}-${new Date().getTime()}.jpg`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            },
        ]
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let res = ``;
    if (dataSend.language === 'vi') {
        res =
            `
            <h3>Xin chào ${dataSend.patientName} </h3>
            <p>Bạn nhận được email vì đã khám bệnh tại booking care.</p>

            <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>

            <p>Trân thành cảm ơn!</p>
        `
    }

    if (dataSend.language === 'en') {
        res =
            `
            <h3>Dear ${dataSend.patientName} </h3>
            <p>You received an email for your medical examination when you booked your care.</p>

            <p>Prescription/invoice information is included in the attached file.</p>

            <p>Would like to thank!</p>
        `
    }

    return res;
}

module.exports = {
    sendBookingConfirmMail: sendBookingConfirmMail,
    sendRemedyAttachment: sendRemedyAttachment,
}