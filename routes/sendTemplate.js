const router =
  require("express").Router();

const axios =
  require("axios");

router.post("/", async (req, res) => {

  try {

    const {
      telefono,
      template
    } = req.body;

    console.log(
      "ENVIANDO TEMPLATE:",
      template,
      "A:",
      telefono
    );

    const response =
      await axios.post(

        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,

        {
          messaging_product:
            "whatsapp",

          to: telefono,

          type: "template",

          template: {

            name: template,

            language: {
              code: "es_CO"
            }

          }

        },

        {
          headers: {

            Authorization:
              `Bearer ${process.env.WHATSAPP_TOKEN}`,

            "Content-Type":
              "application/json"

          }
        }

      );

    console.log(
      response.data
    );

    return res.json(
      response.data
    );

  }

  catch (err) {

    console.log(
      "ERROR TEMPLATE:"
    );

    console.log(
      err.response?.data ||
      err.message
    );

    return res
      .status(500)
      .json({
        error: true
      });

  }

});

module.exports =
  router;