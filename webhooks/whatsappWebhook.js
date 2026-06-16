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

  const { error } =
    await supabase
      .from("messages")
      .update({
        estado: status.status
      })
      .eq(
        "wamid",
        status.id
      );

  if (error) {

    console.log(
      "ERROR ACTUALIZANDO ESTADO:"
    );

    console.log(error);

  } else {

    console.log(
      `ESTADO ACTUALIZADO: ${status.status}`
    );

  }

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

      // ======================================
// CREAR CLIENTE SI NO EXISTE
// ======================================

const {
  data: clienteExistente,
  error: clienteError
} = await supabase
  .from("clientes")
  .select("id")
  .eq("telefono", telefono)
  .maybeSingle();

if (clienteError) {

  console.log(
    "ERROR BUSCANDO CLIENTE:"
  );

  console.log(clienteError);

}

if (!clienteExistente) {

  const contacto =
    value.contacts?.[0];

  const nombre =
    contacto?.profile?.name ||
    "Sin nombre";

  const {
    error: insertClienteError
  } = await supabase
    .from("clientes")
    .insert({
      telefono,
      nombre
    });

  if (insertClienteError) {

    console.log(
      "ERROR CREANDO CLIENTE:"
    );

    console.log(
      insertClienteError
    );

  } else {

    console.log(
      `CLIENTE CREADO: ${telefono}`
    );

  }

}

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