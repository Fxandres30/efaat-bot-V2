module.exports = function parseMessage(
  message
) {

  const tipo =
    message.type || "text";

  let mensaje = "";
  let media_id = null;

  switch (tipo) {

    case "text":

      mensaje =
        message.text?.body || "";

      break;

    case "image":

      media_id =
        message.image?.id || null;

      mensaje = JSON.stringify({

        caption:
          message.image?.caption || "",

        mime_type:
          message.image?.mime_type || ""

      });

      break;

    case "video":

      media_id =
        message.video?.id || null;

      mensaje = JSON.stringify({

        caption:
          message.video?.caption || "",

        mime_type:
          message.video?.mime_type || ""

      });

      break;

    case "audio":

      media_id =
        message.audio?.id || null;

      mensaje = JSON.stringify({

        mime_type:
          message.audio?.mime_type || ""

      });

      break;

    case "sticker":

      media_id =
        message.sticker?.id || null;

      mensaje = JSON.stringify({

        animated:
          message.sticker?.animated || false

      });

      break;

    case "document":

      media_id =
        message.document?.id || null;

      mensaje = JSON.stringify({

        filename:
          message.document?.filename || "",

        mime_type:
          message.document?.mime_type || ""

      });

      break;

    case "contacts":

      mensaje =
        JSON.stringify(
          message.contacts || []
        );

      break;

    case "location":

      mensaje = JSON.stringify({

        latitude:
          message.location?.latitude || null,

        longitude:
          message.location?.longitude || null,

        name:
          message.location?.name || "",

        address:
          message.location?.address || ""

      });

      break;

    case "button":

      mensaje =
        message.button?.text || "";

      break;

    case "interactive":

      mensaje =
        JSON.stringify(
          message.interactive || {}
        );

      break;

    case "reaction":

      mensaje = JSON.stringify({

        emoji:
          message.reaction?.emoji || "",

        message_id:
          message.reaction?.message_id || ""

      });

      break;

    default:

      mensaje =
        JSON.stringify(message);

      break;

  }

  return {

    tipo,
    mensaje,
    media_id

  };

};