require("dotenv").config();

const axios =
  require("axios");

const TOKEN =
  process.env.WHATSAPP_TOKEN;

const PHONE_NUMBER_ID =
  process.env.PHONE_NUMBER_ID;

const supabase =
  require("../../lib/supabase");

const crypto =
  require("crypto");

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

// 🔥 OBTENER URL DE MEDIA

async function obtenerMediaUrl(
  mediaId
) {

  const response =

    await axios.get(

      `https://graph.facebook.com/v22.0/${mediaId}`,

      {

        headers: {

          Authorization:
            `Bearer ${TOKEN}`

        }

      }

    );

  return response.data.url;

}

// 🔥 DESCARGAR MEDIA

async function descargarMedia(
  mediaUrl
) {

  const response =

    await axios.get(

      mediaUrl,

      {

        responseType:
          "arraybuffer",

        headers: {

          Authorization:
            `Bearer ${TOKEN}`

        }

      }

    );

  return response.data;

}

// 🔥 SUBIR MEDIA A SUPABASE

async function subirMediaASupabase(
  buffer,
  extension = "jpg"
) {

  const fileName =

    `${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}.${extension}`;

  const { error } =

    await supabase.storage

      .from("chat-media")

      .upload(
        fileName,
        buffer,
        {
          upsert: false
        }
      );

  if (error) {

    throw error;

  }

  const { data } =

    supabase.storage

      .from("chat-media")

      .getPublicUrl(
        fileName
      );

  return data.publicUrl;

}

module.exports = {

  enviarTexto,
  enviarImagen,
  enviarTemplateComprobante,

  obtenerMediaUrl,
  descargarMedia,

  subirMediaASupabase

};