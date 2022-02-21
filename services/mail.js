( async () => {

    "use strict";

    const nodemailer =      require('nodemailer');
    const path =            require('path'); 
    
    const util =            require('util');
    
    let transporter = nodemailer.createTransport( {
        host: 'smtp.stackmail.com',
        port: 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    });

    async function issueInvoice( invoice ) {
        try
        {
            const options = 
            {
                subject: util.format( 'cde-fyi Invoice: %s', invoice._id ),
                from: process.env.SMTP_USER,
                to: invoice.address.faoEmail,
                html: util.format( "Invoice: %s <br><br> Charges: %s <br><br> Payments to Date: %s <br><br> Total Due: %s", invoice._id, invoice.grossCharges, invoice.grossPayments, invoice.balance )
            };

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    async function sendConfirmation( emailAddress, emailToken ) {
        try
        {
            const options = 
            {
                subject: 'Please confirm this is your email address...',
                from: process.env.SMTP_USER,
                to: emailAddress,
                html: "Hello,<br><br><a href=" + "http://localtest.me:3000/confirmCallback?token={emailToken}>Please click here to verify this email.</a><br><br>Thank you for using IMMS"
            };
            options.html = options.html.replace( '{emailToken}', emailToken );

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    async function sendEmailChangedConfirmation( emailAddress, emailToken ) {
        try
        {
            const options = 
            {
                subject: 'Please confirm if this is to be your new account email address...',
                from: process.env.SMTP_USER,
                to: emailAddress,
                html: "Hello,<br><br><a href=" + "http://localtest.me:3000/confirmCallback?token={emailToken}>Please click here to verify this email.</a><br><br>Thank you for using IMMS"
            };
            options.html = options.html.replace( '{emailToken}', emailToken );

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    async function sendWelcome( emailAddress ) {
        try
        {
            const options = 
            {
                subject: 'Email verified & linked to your cde.fyi account...',
                from: process.env.SMTP_USER,
                to: emailAddress,
                html: "Hello,<br><br><p>Thanks for accepting our terms.</p><br><br>Best Regards, TPH"
            };

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    async function sendNewPassword( emailAddress, password ) {
        try
        {
            const options = 
            {
                subject: 'Your password has just been reset...',
                from: process.env.SMTP_USER,
                to: emailAddress,
                html: "Hello,<br><br><p>Your new password is:</p><br><br><h2>{password}</h2><br><br><p>Please log into your account and change it to something more memorable.</p>"
            };
            options.html = options.html.replace( '{password}', password );

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    async function sendSwitchReceipt( emailAddress ) {
        try
        {
            const options = 
            {
                subject: 'This is now your main email...',
                from: process.env.SMTP_USER,
                to: emailAddress,
                html: "Hello,<br><br><p>Your main account email address has just been switched to this one.</p><br><br>Best Regards, TPH"
            };

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    async function sendLogFile( jobName ) {
        try
        {
            const fileName = jobName + '.csv';
            const filePath = path.resolve('./logs/' + jobName + '.log' );

            const options = 
            {
                subject: 'FW: ' + fileName,
                from: process.env.SMTP_USER,
                to: process.env.ADMIN_EMAIL,
                attachments: [ { filename: fileName, path: filePath } ]
            };

            await transporter.sendMail( options );
        }
        catch ( err ) { throw err; }
    };

    module.exports = { 
        issueInvoice,
        sendNewPassword, 
        sendConfirmation, 
        sendWelcome, 
        sendEmailChangedConfirmation ,
        sendSwitchReceipt,
        sendLogFile
    };

})();