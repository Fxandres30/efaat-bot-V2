const router = require("express").Router();
const axios = require("axios");
const supabase = require("../lib/supabase");

router.post("/", async (req, res) => {

  console.log("================================");
  console.log("SEND MESSAGE RECIBIDO");
  console.log(req.body);
  console.log("================================");

  try {

    const {
      telefono,
      mensaje
    } = req.body;

    console.log("ENVIANDO A:", telefono);
    console.log("MENSAJE:", mensaje);

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

    console.log("META OK:");
    console.log(response.data);

    const { error } =
      await supabase
        .from("messages")
        .insert([
          {
            telefono,
            mensaje,
            from_me: true,
            tipo: "text",
            media_id: null,
            media_url: null
          }
        ]);

    if (error) {

      console.log(
        "SUPABASE ERROR:"
      );

      console.log(error);

    }

    res.json(response.data);

  }

  catch (err) {

    console.log("META ERROR:");

    console.log(
      err.response?.data ||
      err.message ||
      err
    );

    res.status(500).json({
      error: true
    });

  }

});

module.exports = router;