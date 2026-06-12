const router = require("express").Router();
const axios = require("axios");

router.get(
  "/:id",
  async (req, res) => {

    try {

      const response =
        await axios.get(
          `https://graph.facebook.com/v22.0/${req.params.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${process.env.WHATSAPP_TOKEN}`
            }
          }
        );

      return res.json(
        response.data
      );

    } catch (err) {

      return res.json(
        err.response?.data ||
        err.message
      );

    }

  }
);

module.exports =
  router;