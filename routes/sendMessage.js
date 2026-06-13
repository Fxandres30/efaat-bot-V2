const router = require("express").Router();
const axios = require("axios");

const supabase =
  require("../lib/supabase");

router.post("/", async (req, res) => {

  try {

    const {
      telefono,
      mensaje
    } = req.body;

    const response =
      await axios.post(
        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: telefono,
          type: "text",
          text: {
            body: mensaje
          }
        },
        {
          headers: {
            Authorization:
              `Bearer ${process.env.WHATSAPP_TOKEN}`
          }
        }
      );

    // GUARDAR EN SUPABASE

    const {
      data,
      error
    } = await supabase
      .from("messages")
      .insert([
        {
          telefono,
          mensaje,
          tipo: "text",
          from_me: true
        }
      ]);

    console.log(
      "SUPABASE:",
      data,
      error
    );

    res.json(response.data);

  }

  catch (err) {

    console.log(
      err.response?.data ||
      err.message
    );

    res.status(500).json({
      error: true
    });

  }

});

module.exports = router;