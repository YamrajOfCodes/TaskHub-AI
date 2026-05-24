import emailjs from "@emailjs/browser"

export async function sendEmail(
  to_name: string,
  message: string
) {

  try {

    await emailjs.send(

      "service_n4hug1k",

      "template_tgi3euo",

      {
        to_name,
        message
      },

      "aLGIkV_ZiAU4S0GvL"
    )

    console.log("Email sent")

  } catch (error) {

    console.log(error)
  }
}