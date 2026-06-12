require("dotenv").config();

const axios =
  require("axios");

const TOKEN =
  process.env.WHATSAPP_TOKEN;

const PHONE_NUMBER_ID =
  process.env.PHONE_NUMBER_ID;

// 🔥 ENVIAR TEXTO

async function enviarTexto(
  numero,
  mensaje
) {

  const response =
    await axios.post(

      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,

      {
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: {
          body: mensaje
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

  return response.data;

}

// 🔥 ENVIAR IMAGEN

async function enviarImagen(
  numero,
  imagen,
  caption
) {

  const response =
    await axios.post(

      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,

      {
        messaging_product: "whatsapp",
        to: numero,
        type: "image",
        image: {
          link: imagen,
          caption
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

  return response.data;

}

// 🔥 TEMPLATE

async function enviarTemplateComprobante(
  numero
) {

  const response =
    await axios.post(

      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,

      {
        messaging_product: "whatsapp",
        to: numero,
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

  return response.data;

}

module.exports = {

  enviarTexto,
  enviarImagen,
  enviarTemplateComprobante

};