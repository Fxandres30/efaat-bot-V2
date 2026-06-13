const router = require("express").Router();
const axios = require("axios");

router.post("/", async (req, res) => {

  console.log("BODY RECIBIDO:");
  console.log(req.body);

  try {

    const {
      telefono,
      mensaje
    } = req.body;

    console.log("TELEFONO:", telefono);
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

    console.log("META RESPONSE:");
    console.log(response.data);

    res.json(response.data);

  } catch (err) {

    console.log("ERROR META:");
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