require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const whatsappWebhook = require("./webhooks/whatsappWebhook");

const {
  enviarComprobanteAdmin,
  enviarConfirmacionCliente
} = require("./services/enviarComprobante");

app.use(cors({
  origin: "*"
}));

app.use(express.json({
  limit: "20mb"
}));

// =====================
// RUTAS
// =====================

app.use(
  "/media",
  require("./routes/media")
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
  "/meta/send-template",
  require("./routes/sendTemplate")
);

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

// =====================
// COMPROBANTES
// =====================

app.post("/enviar-comprobante", async (req, res) => {

  try {

    console.log("📥 NUEVO COMPROBANTE");
    console.log(req.body);

    await enviarComprobanteAdmin(req.body);

    console.log("✅ ADMIN OK");

    await enviarConfirmacionCliente(req.body);

    console.log("✅ CLIENTE OK");

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      ok: false,
      error: err.message
    });

  }

});

// =====================
// ERROR GLOBAL
// =====================

app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    error: true,
    message: err.message
  });

});

// =====================

app.listen(3001, () => {

  console.log("🚀 META API ACTIVA EN 3001");

});