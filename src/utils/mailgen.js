
import Mailgen from "mailgen";
import { Resend } from "resend";
import dotenv from "dotenv"
import { Apierror } from "./api-error.js";
dotenv.config({
    
})
const resend=new Resend(process.env.RESEND_API_KEY)
const sendEmail=async(options)=>{
    const mailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:'VideoTube',
            link:`${process.env.FRONTEND_URL}`,
        }
    })
    const emailText=mailGenerator.generatePlaintext(options.mailgencontent);
    const emailHtml=mailGenerator.generate(options.mailgencontent);
 try {
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHtml
    });

    console.log("RESEND DATA:", data);
    console.log("RESEND ERROR:", error);

    if (error) {
        throw new Apierror(
            500,
            "Something went wrong while sending the email"
        );
    }

    console.log("Email sent successfully");

} catch (err) {
    console.log("EMAIL ERROR:", err);
    throw err;
}


}



const userVerificationMailGen=(username,verificationurl)=>{
    return{
        body:{
            name:username,
        intro: 'Welcome to our platform VideoTube',
        action: [
            {instructions: 'To get started with our Platform, please verify',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: verificationurl
            }
        }
        ],
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
};
const forgotPasswordmailgen=(username,forgotPasswordurl)=>{
return{
    body:{
        name:username,
          action:[
          {instructions:"To change your password, go through the provided link",
            button:{
                color:"#284535",
                text:"Forgot your password, Click here to change",
                link:forgotPasswordurl
            }
          }
        ]
    }
}

}

export{sendEmail,forgotPasswordmailgen,userVerificationMailGen};