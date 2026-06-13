const router = require("express").Router();

const supabase =
  require("../lib/supabase");

// ======================================
// VERIFY WEBHOOK
// ======================================

router.get(
  "/webhook",
  (req, res) => {

    const verifyToken =
      "efaat_verify";

    const mode =
      req.query["hub.mode"];

    const token =
      req.query["hub.verify_token"];

    const challenge =
      req.query["hub.challenge"];

    if (
      mode === "subscribe" &&
      token === verifyToken
    ) {

      return res
        .status(200)
        .send(challenge);

    }

    return res.sendStatus(403);

  }
);

// ======================================
// RECEIVE WEBHOOK
// ======================================

router.post(
  "/webhook",
  async (req, res) => {

    try {

      console.log(
        "WEBHOOK RECIBIDO"
      );

      console.log(
        JSON.stringify(
          req.body,
          null,
          2
        )
      );

      const value =
        req.body?.entry?.[0]
          ?.changes?.[0]
          ?.value;

      if (!value) {

        return res.sendStatus(200);

      }

      // ======================================
      // STATUS MENSAJES SALIENTES
      // ======================================

      if (value.statuses) {

        const status =
          value.statuses[0];

        console.log(
          "STATUS RECIBIDO:"
        );

        console.log(
          JSON.stringify(
            status,
            null,
            2
          )
        );

        /*
        status.id
        status.status

        sent
        delivered
        read
        failed
        */

        return res.sendStatus(200);

      }

      // ======================================
      // MENSAJES ENTRANTES
      // ======================================

      const message =
        value.messages?.[0];

      if (!message) {

        return res.sendStatus(200);

      }

      console.log(
        "MENSAJE:"
      );

      console.log(
        JSON.stringify(
          message,
          null,
          2
        )
      );

      const telefono =
        message.from;

      const wamid =
        message.id;

      const tipo =
        message.type || "text";

      let mensaje = "";
      let media_id = null;

      // ======================================
      // TEXTO
      // ======================================

      if (tipo === "text") {

        mensaje =
          message.text?.body || "";

      }

      // ======================================
      // IMAGEN
      // ======================================

      else if (tipo === "image") {

        media_id =
          message.image?.id || null;

        mensaje =
          message.image?.caption || "";

      }

      // ======================================
      // VIDEO
      // ======================================

      else if (tipo === "video") {

        media_id =
          message.video?.id || null;

        mensaje =
          message.video?.caption || "";

      }

      // ======================================
      // AUDIO
      // ======================================

      else if (tipo === "audio") {

        media_id =
          message.audio?.id || null;

      }

      // ======================================
      // DOCUMENTO
      // ======================================

      else if (tipo === "document") {

        media_id =
          message.document?.id || null;

        mensaje =
          message.document?.filename || "";

      }

      // ======================================
      // STICKER
      // ======================================

      else if (tipo === "sticker") {

        media_id =
          message.sticker?.id || null;

      }

      console.log({
        telefono,
        wamid,
        tipo,
        mensaje,
        media_id
      });

      const { data, error } =
  await supabase
    .from("messages")
    .insert({

      telefono,
      wamid,
      mensaje,
      tipo,
      media_id,
      from_me: false

    })
    .select();

console.log(
  "INSERT RESULT:"
);

console.log({
  data,
  error
});

      if (error) {

        console.log(
          "SUPABASE ERROR:"
        );

        console.log(error);

      }

      return res.sendStatus(200);

    }

    catch (err) {

      console.log(
        "ERROR WEBHOOK:"
      );

      console.log(err);

      return res.sendStatus(500);

    }

  }
);


module.exports =
  router;