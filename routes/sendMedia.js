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

      if (
  type === "image" ||
  type === "video"
) {

  payload[type] = {
    id: mediaId,
    caption: mensaje
  };

}

else {

  payload[type] = {
    id: mediaId
  };

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

        await supabase
  .from("messages")
  .insert({

    telefono,

    mensaje,

    from_me: true,

    tipo: type,

    media_id: mediaId,

    media_url:
      `/media/${mediaId}`

  });

      return res.json({
        success: true,
        mediaId,
        data:
          response.data
      });

    }

    catch (err) {

      console.log(
        err.response?.data ||
        err.message
      );

      return res.status(500).json({
        error: true
      });

    }

  }
);

module.exports =
  router;