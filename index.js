require("dotenv").config();

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

// 🔥 PRIMERO CREAS APP

const app =
  express();

// 🔥 DESPUÉS USE

app.use(
  express.json({
    limit: "20mb"
  })
);

app.use(
  "/debug",
  require("./routes/testMedia")
);

// 🔥 WEBHOOK

app.use(
  "/meta",
  whatsappWebhook
);

// 🔥 ENDPOINT

app.post(

  "/enviar-comprobante",

  async (req, res) => {

    try {

      await enviarComprobanteAdmin(
        req.body
      );

      await enviarConfirmacionCliente(
        req.body
      );

      res.json({
        ok: true
      });

    }

    catch (err) {

      console.log(

  err.response?.data ||
  err.message ||
  err

);

      res.status(500).json({
        ok: false
      });

    }

  }

);

app.listen(3001, () => {

  console.log(
    "🚀 META API ACTIVA EN 3001"
  );

});