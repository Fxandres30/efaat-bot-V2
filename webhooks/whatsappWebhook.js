const router =
  require("express").Router();

const supabase =
  require("../lib/supabase");

const {
  obtenerMediaUrl
} = require("../services/whatsapp/api");

// 🔥 VERIFY

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

    res.sendStatus(403);

  }

);


// 🔥 RECEIVE

router.post(

  "/webhook",

  async (req, res) => {

    try {

      const message =

        req.body?.entry?.[0]
          ?.changes?.[0]
          ?.value?.messages?.[0];

      if (!message) {

        return res.sendStatus(200);

      }

      const telefono =
  message.from;

const tipo =
  message.type || "text";

let mensaje = "";
let media_id = null;
let media_url = null;

// TEXTO

if (tipo === "text") {

  mensaje =
    message.text?.body || "";

}

// IMAGEN

else if (tipo === "image") {

  media_id =
    message.image?.id;

  mensaje =
    message.image?.caption || "";

}

// VIDEO

else if (tipo === "video") {

  media_id =
    message.video?.id;

  mensaje =
    message.video?.caption || "";

}

// AUDIO

else if (tipo === "audio") {

  media_id =
    message.audio?.id;

}

// DOCUMENTO

else if (tipo === "document") {

  media_id =
    message.document?.id;

  mensaje =
    message.document?.filename || "";

}

// STICKER

else if (tipo === "sticker") {

  media_id =
    message.sticker?.id;

}

// OBTENER URL

if (media_id) {

  try {

    media_url =
      await obtenerMediaUrl(
        media_id
      );

  }

  catch (err) {

    console.log(
      "ERROR MEDIA:",
      err.response?.data ||
      err.message
    );

  }

}

// GUARDAR

const { data, error } =

  await supabase
    .from("messages")
    .insert({

      telefono,
      mensaje,
      tipo,
      media_id,
      media_url,
      from_me: false

    });

console.log({

  telefono,
  tipo,
  mensaje,
  media_id,
  media_url

});

console.log(
  "SUPABASE ERROR:",
  error
);

      res.sendStatus(200);

    }

    catch (err) {

      console.log(err);

      res.sendStatus(500);

    }

  }

);

module.exports =
  router;