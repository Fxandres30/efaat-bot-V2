require("dotenv").config();

const cors =
  require("cors");

const express =
  require("express");

const whatsappWebhook =
  require(
    "./webhooks/whatsappWebhook"
  );

const {

  enviarComprobanteAdmin,
  enviarConfirmacionCliente

} = require(
  "./services/enviarComprobante"
);

const app =
  express();

app.use(
  cors({
    origin: "*"
  })
);

app.use(
  express.json({
    limit: "20mb"
  })
);

app.use(
  "/debug",
  require("./routes/test-media")
);

app.use(
  "/media",
  require("./routes/media")
);

app.use(
  "/meta/send-template",
  require(
    "./routes/sendTemplate"
  )
);

app.use(
  "/meta",
  whatsappWebhook
);

app.use(
  "/meta/send-message",
  require("./routes/sendMessage")
);

app.use(
  "/meta/send-media",
  require("./routes/sendMedia")
);

app.use(
  "/meta/send-message",
  require("./routes/sendMessage")
);

app.use(
  "/meta/send-media",
  require("./routes/sendMedia")
);

/* NUEVAS */

app.use(
  "/meta/archive-chat",
  require("./routes/archiveChat")
);

app.use(
  "/meta/favorite-chat",
  require("./routes/favoriteChat")
);

app.use(
  "/meta/mute-chat",
  require("./routes/muteChat")
);

app.use(
  "/meta/delete-chat",
  require("./routes/deleteChat")
);

app.post(

  "/enviar-comprobante",

  async (req, res) => {

    try {

      console.log(
        "📥 NUEVO COMPROBANTE"
      );

      console.log(
        req.body
      );

      console.log(
  "BODY RECIBIDO:"
);

console.log(req.body);

      await enviarComprobanteAdmin(
        req.body
      );

      console.log(
        "✅ ADMIN OK"
      );

      await enviarConfirmacionCliente(
        req.body
      );

      console.log(
        "✅ CLIENTE OK"
      );

      res.json({
        ok: true
      });

    }

    catch (err) {

      console.log(
        "❌ ERROR EN /enviar-comprobante"
      );

      console.log(
        "MENSAJE:",
        err?.message
      );

      console.log(
        "RESPUESTA META:"
      );

      console.dir(
        err?.response?.data,
        { depth: null }
      );

      console.dir(
        err,
        { depth: null }
      );

      res.status(500).json({

        ok: false,

        error:
          err?.message ||
          "Error desconocido"

      });

    }

  }

);

app.listen(3001, () => {

  console.log(
    "🚀 META API ACTIVA EN 3001"
  );

});