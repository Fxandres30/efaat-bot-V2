const router =
  require("express").Router();

const verifyWebhook =
  require("./helpers/verifyWebhook");

const parseMessage =
  require("./helpers/parseMessage");

const crearCliente =
  require("./services/clientes");

const guardarMensaje =
  require("./services/mensajes");

const actualizarEstado =
  require("./services/estados");

const ejecutarComando =
  require("./commands");

// ======================================
// VERIFY
// ======================================

router.get(
  "/webhook",
  verifyWebhook
);

// ======================================
// RECEIVE
// ======================================

router.post(
  "/webhook",
  async (req, res) => {

    try {

      console.log(
        "WEBHOOK RECIBIDO"
      );

      const value =
        req.body?.entry?.[0]
          ?.changes?.[0]
          ?.value;

      if (!value) {

        return res.sendStatus(
          200
        );

      }

      // ======================
      // STATUS
      // ======================

      if (
        value.statuses
      ) {

        await actualizarEstado(
          value.statuses[0]
        );

        return res.sendStatus(
          200
        );

      }

      // ======================
      // MESSAGE
      // ======================

      const message =
        value.messages?.[0];

      if (!message) {

        return res.sendStatus(
          200
        );

      }

      const telefono =
        message.from;

      const wamid =
        message.id;

      const {

        tipo,
        mensaje,
        media_id

      } = parseMessage(
        message
      );

      const comando =
        await ejecutarComando(

          telefono,
          mensaje

        );

      if (comando) {

        return res.sendStatus(
          200
        );

      }

      await crearCliente(

        telefono,
        value.contacts?.[0]

      );

      const {
        error
      } =
        await guardarMensaje({

          telefono,
          wamid,
          mensaje,
          tipo,
          media_id,
          from_me: false

        });

      if (error) {

        console.log(
          "SUPABASE ERROR:"
        );

        console.log(error);

      }

      return res.sendStatus(
        200
      );

    }

    catch (err) {

      console.log(
        "ERROR WEBHOOK:"
      );

      console.log(err);

      return res.sendStatus(
        500
      );

    }

  }
);

module.exports =
  router;