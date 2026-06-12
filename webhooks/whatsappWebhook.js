const router = require("express").Router();

const supabase =
require("../lib/supabase");

// ======================================
// VERIFY WEBHOOK
// ======================================

router.get("/webhook", (req, res) => {

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

});

// ======================================
// RECEIVE WEBHOOK
// ======================================

router.post(

"/webhook",

async (req, res) => {


try {

  const message =

    req.body?.entry?.[0]
      ?.changes?.[0]
      ?.value?.messages?.[0];

  console.log(
    "========= MENSAJE COMPLETO ========="
  );

  console.log(
    JSON.stringify(
      message,
      null,
      2
    )
  );

  console.log(
    "===================================="
  );

  if (!message) {

    console.log(
      "NO MESSAGE",
      JSON.stringify(
        req.body,
        null,
        2
      )
    );

    return res.sendStatus(200);

  }

  const telefono =
    message.from;

  const tipo =
    message.type || "text";

  let mensaje = "";
  let media_id = null;
  let media_url = null;

  // ==========================
  // TEXTO
  // ==========================

  if (tipo === "text") {

    mensaje =
      message.text?.body || "";

  }

  // ==========================
  // IMAGEN
  // ==========================

  else if (tipo === "image") {

    media_id =
      message.image?.id;

    media_url =
      message.image?.url || null;

    mensaje =
      message.image?.caption || "";

  }

  // ==========================
  // VIDEO
  // ==========================

  else if (tipo === "video") {

    media_id =
      message.video?.id;

    media_url =
      message.video?.url || null;

    mensaje =
      message.video?.caption || "";

  }

  // ==========================
  // AUDIO
  // ==========================

  else if (tipo === "audio") {

    media_id =
      message.audio?.id;

    media_url =
      message.audio?.url || null;

  }

  // ==========================
  // DOCUMENTO
  // ==========================

  else if (tipo === "document") {

    media_id =
      message.document?.id;

    media_url =
      message.document?.url || null;

    mensaje =
      message.document?.filename || "";

  }

  // ==========================
  // STICKER
  // ==========================

  else if (tipo === "sticker") {

    media_id =
      message.sticker?.id;

    media_url =
      message.sticker?.url || null;

  }

  console.log(
    "DATOS A GUARDAR"
  );

  console.log({

    telefono,
    tipo,
    mensaje,
    media_id,
    media_url

  });

  const {
    data,
    error
  } = await supabase

    .from("messages")

    .insert({

      telefono,
      mensaje,
      tipo,
      media_id,
      media_url,
      from_me: false

    })

    .select();

  if (error) {

    console.log(
      "SUPABASE ERROR:",
      error
    );

  }

  else {

    console.log(
      "GUARDADO OK:",
      data
    );

  }

  return res.sendStatus(200);

}

catch (err) {

  console.log(
    "ERROR WEBHOOK"
  );

  console.log(
    err.response?.data ||
    err.message ||
    err
  );

  return res.sendStatus(500);

}


}

);

module.exports =
router;
