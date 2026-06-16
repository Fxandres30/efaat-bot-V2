const router = require("express").Router();
const axios = require("axios");
const supabase = require("../lib/supabase");

router.post("/", async (req, res) => {

  console.log("================================");
  console.log("SEND MESSAGE RECIBIDO");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("================================");

  try {

    const {
      telefono,
      mensaje
    } = req.body;

    console.log("PHONE_NUMBER_ID:");
    console.log(process.env.PHONE_NUMBER_ID);

    console.log("TOKEN EXISTE:");
    console.log(!!process.env.WHATSAPP_TOKEN);

    console.log("ENVIANDO A:");
    console.log(telefono);

    console.log("MENSAJE:");
    console.log(mensaje);

    const payload = {
      messaging_product: "whatsapp",
      to: telefono,
      type: "text",
      text: {
        body: mensaje
      }
    };

    console.log("PAYLOAD:");
    console.log(
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    const response =
  await axios.post(
    `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
    payload,
    {
      headers: {
        Authorization:
          `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type":
          "application/json"
      }
    }
  );

  const waId =
  response.data?.contacts?.[0]?.wa_id
  || telefono;

    console.log("================================");
    console.log("META OK");
    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );
    console.log("================================");

    const insertResult =
  await supabase
    .from("messages")
    .insert([
      {
        telefono: waId,
        mensaje,
        from_me: true,
        tipo: "text",
        media_id: null,
        media_url: null,
        wamid:
          response.data?.messages?.[0]?.id || null,
        estado: "sent"
      }
    ])
    .select();

    console.log("SUPABASE INSERT:");
    console.log(
      JSON.stringify(
        insertResult,
        null,
        2
      )
    );

    res.json(response.data);

  }

  catch (err) {

    console.log("================================");
    console.log("META ERROR");
    console.log("================================");

    console.log(
      err.response?.status
    );

    console.log(
      JSON.stringify(
        err.response?.data,
        null,
        2
      )
    );

    console.log(err.message);

    res.status(500).json({
      error: true
    });

  }

});

module.exports = router;