const router = require("express").Router();
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const supabase =
  require("../lib/supabase");

const upload = multer({
  dest: "media/"
});

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {

    console.log("🔥🔥🔥 ENTRÓ A SEND MEDIA 🔥🔥🔥");

    try {

      const telefono =
  req.body.telefono;

const mensaje =
  req.body.mensaje || "";

const archivo =
  req.file;

      if (!archivo) {

        return res.status(400).json({
          error: "No file"
        });

      }

      const mimeType =
        archivo.mimetype;

        const formatos = {

  image: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  video: [
    "video/mp4",
    "video/3gpp"
  ],

  audio: [
    "audio/mpeg",
    "audio/mp4",
    "audio/aac",
    "audio/amr",
    "audio/ogg",
    "audio/opus"
  ],

  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain"
  ]

};

const permitido =
  Object.values(formatos)
    .flat()
    .includes(mimeType);

if (!permitido) {

  fs.unlinkSync(
    archivo.path
  );

  return res.status(400).json({

    error:true,

    message:
      `Formato no soportado (${mimeType})`

  });

}

const LIMITE =
  16 * 1024 * 1024;

if (
  archivo.size > LIMITE
){

  fs.unlinkSync(
    archivo.path
  );

  return res.status(400).json({

    error:true,

    message:
      "Archivo demasiado grande."

  });

}

      // =====================
      // SUBIR A WHATSAPP
      // =====================

      const FormData =
        require("form-data");

      const form =
        new FormData();

      form.append(
        "messaging_product",
        "whatsapp"
      );

      form.append(
        "file",
        fs.createReadStream(
          archivo.path
        ),
        {
          filename:
            archivo.originalname,
          contentType:
            mimeType
        }
      );

      const uploadResponse =
        await axios.post(

          `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/media`,

          form,

          {
            headers: {
              Authorization:
                `Bearer ${process.env.WHATSAPP_TOKEN}`,
              ...form.getHeaders()
            }
          }

        );

      const mediaId =
        uploadResponse.data.id;

      let type =
        "document";

      if (
        mimeType.startsWith(
          "image/"
        )
      ) {
        type = "image";
      }

      if (
        mimeType.startsWith(
          "video/"
        )
      ) {
        type = "video";
      }

      if (
        mimeType.startsWith(
          "audio/"
        )
      ) {
        type = "audio";
      }

      // =====================
      // ENVIAR MENSAJE
      // =====================

      const payload = {

        messaging_product:
          "whatsapp",

        to: telefono,

        type

      };

    payload[type] = {
  id: mediaId
};

if (
  mensaje &&
  [
    "image",
    "video",
    "document"
  ].includes(type)
) {
  payload[type].caption = mensaje;
}

      const response =
        await axios.post(

          `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,

          payload,

          {
            headers: {
              Authorization:
                `Bearer ${process.env.WHATSAPP_TOKEN}`,
              "Content-Type":
                "application/json"
            }
          }

        );

        const wamid =
  response.data?.messages?.[0]?.id || null;

const insertResult =
  await supabase
    .from("messages")
    .insert({

      telefono,

      mensaje,

      from_me: true,

      tipo: type,

      media_id: mediaId,

      media_url:
        `https://efaat.com/media/${mediaId}`,

      file_name:
        archivo.originalname,

      mime_type:
        mimeType,

      file_size:
        archivo.size,

      wamid,

      estado: "sent",

      leido: false

    });

console.log(
  "MEDIA INSERT:"
);

console.log(
  JSON.stringify(
    insertResult,
    null,
    2
  )
);

      return res.json({
        success: true,
        mediaId,
        data:
          response.data
      });

    }

    catch (err) {

  console.error(
    "ERROR META:"
  );

  console.error(
    err.response?.data ||
    err
  );

  return res.status(

    err.response?.status ||
    500

  ).json({

    error:true,

    message:

      err.response?.data?.error?.message ||

      err.message

  });

}

  }
);

module.exports =
  router;