require("dotenv").config();

const axios = require("axios");

const supabase =
  require("../../lib/supabase");

const TOKEN =
  process.env.WHATSAPP_TOKEN;

const PHONE_NUMBER_ID =
  process.env.PHONE_NUMBER_ID;

// =====================================
// ENVIAR TEXTO
// =====================================

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

// =====================================
// ENVIAR IMAGEN
// =====================================

async function enviarImagen(
  numero,
  imagen,
  caption = ""
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

  await guardarMensajeSaliente({

    telefono: numero,

    mensaje: caption,

    tipo: "image",

    media_url: imagen,

    response: response.data

  });

  return response.data;

}


// =====================================
// TEMPLATE
// =====================================

async function enviarTemplateComprobante(
  numero
) {

  try {

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

  catch (err) {

    console.log(
      "ERROR TEMPLATE:"
    );

    console.log(
      err.response?.data ||
      err.message
    );

    throw err;

  }

}

async function guardarMensajeSaliente({
  telefono,
  mensaje,
  tipo,
  media_url = null,
  response
}) {

  try {

    const wamid =
      response?.messages?.[0]?.id || null;

    await supabase
      .from("messages")
      .insert([{

        telefono,

        mensaje,

        from_me: true,

        tipo,

        media_id: null,

        media_url,

        wamid,

        estado: "sent",

        leido: true

      }]);

  }

  catch (err) {

    console.log(
      "ERROR GUARDANDO MENSAJE:"
    );

    console.log(err);

  }

}

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

  await guardarMensajeSaliente({

    telefono: numero,

    mensaje,

    tipo: "text",

    response: response.data

  });

  return response.data;

}

module.exports = {
  enviarTexto,
  enviarImagen,
  enviarTemplateComprobante
};