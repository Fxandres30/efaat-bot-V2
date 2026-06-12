const router =
  require("express").Router();

const supabase =
  require("../lib/supabase");

// 🔥 VERIFY

router.get(

  "/webhook",

  (req, res) => {

    const verifyToken =
      "efaat_verify";

    const mode =
      req.query["hub.mode"];

    const token =
      req.query["hub.verify_token"];

    const challenge =
      req.query["hub.challenge"];

    if (

      mode === "subscribe" &&
      token === verifyToken

    ) {

      return res
        .status(200)
        .send(challenge);

    }

    res.sendStatus(403);

  }

);

// 🔥 RECEIVE

router.post(

  "/webhook",

  async (req, res) => {

    try {

      const message =

        req.body?.entry?.[0]
          ?.changes?.[0]
          ?.value?.messages?.[0];

      if (!message) {

        return res.sendStatus(200);

      }

      const telefono =
        message.from;

      const mensaje =
        message.text?.body || "";

      console.log(

        telefono,
        mensaje

      );

      const { data, error } =
  await supabase
    .from("messages")
    .insert({

      telefono,
      mensaje,
      from_me: false

    });

console.log(
  "SUPABASE RESULT:",
  data
);

console.log(
  "SUPABASE ERROR:",
  error
);

      res.sendStatus(200);

    }

    catch (err) {

      console.log(err);

      res.sendStatus(500);

    }

  }

);

module.exports =
  router;