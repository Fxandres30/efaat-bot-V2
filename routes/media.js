const router =
  require("express").Router();

const axios =
  require("axios");

const TOKEN =
  process.env.WHATSAPP_TOKEN;

router.get(
  "/:mediaId",
  async (req, res) => {

    try {

      const mediaId =
        req.params.mediaId;

      const mediaInfo =
        await axios.get(
          `https://graph.facebook.com/v22.0/${mediaId}`,
          {
            headers: {
              Authorization:
                `Bearer ${TOKEN}`
            }
          }
        );

      const fileUrl =
        mediaInfo.data.url;

      const file =
        await axios.get(
          fileUrl,
          {
            responseType:
              "stream",
            headers: {
              Authorization:
                `Bearer ${TOKEN}`
            }
          }
        );

      res.setHeader(
        "Content-Type",
        file.headers[
          "content-type"
        ]
      );

      file.data.pipe(res);

    }

    catch (err) {

      console.log(
        "ERROR MEDIA"
      );

      console.log(
        err.response?.data ||
        err.message
      );

      res
        .status(500)
        .send("Error");

    }

  }
);

module.exports =
  router;