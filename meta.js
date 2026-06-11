require("dotenv").config();

const axios =
  require("axios");

const TOKEN =
  process.env.WHATSAPP_TOKEN;

const PHONE_NUMBER_ID =
  process.env.PHONE_NUMBER_ID;

async function enviarMensaje() {

  try {

    const response =

      await axios.post(

        `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,

        {

          messaging_product: "whatsapp",

          to: "573015632069",

          type: "template",

          template: {

            name: "hello_world",

            language: {
              code: "en_US"
            }

          }

        },

        {

          headers: {

            Authorization:
              `Bearer ${TOKEN}`,

            "Content-Type":
              "application/json"

          }

        }

      );

    console.log(
      response.data
    );

  }

  catch (err) {

    console.log(

      err.response?.data ||
      err.message

    );

  }

}

enviarMensaje();