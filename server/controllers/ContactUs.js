const { contactUsEmail } = require("../mail/templates/contactFormRes")
const { userResponse } = require("../mail/templates/userResponse")

const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res ", emailRes)
    const hostMail = "edulearn464@gmail.com";
    const recieveRes = await mailSender(
      hostMail,
      "User Response",
      userResponse(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Recieve Res - ", recieveRes);
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}