const Store = require('electron-store');
const store = new Store();
export function sendEmail(data){
    var nodemailer = require('nodemailer');
    return new Promise((resolve, reject) => {
    var emailInfo = store.get('mailInfo')
    if(emailInfo==null){
        return;
    }
    var transporter = nodemailer.createTransport({
        //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
        service: 'qq',
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: emailInfo.mailUserName,
            //这里密码不是qq密码，是你设置的smtp密码
            pass: emailInfo.mailPassword
        }
    });
    
    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails
    
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: emailInfo.mailUserName, // 发件地址
        to: emailInfo.addressee, // 收件列表
        subject: data.subject, // 标题
        //text和html两者只支持一种
        text: data.text, // 标题
        html: data.text // html 内容
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            resolve({status:-999,data:error});
        }
        resolve({status:0,data:error})
    
    });
});
}