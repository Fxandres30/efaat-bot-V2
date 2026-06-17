module.exports =
  function parseMessage(
    message
  ) {

    const tipo =
      message.type || "text";

    let mensaje = "";
    let media_id = null;

    if (tipo === "text") {

      mensaje =
        message.text?.body || "";

    }

    else if (
      tipo === "image"
    ) {

      media_id =
        message.image?.id ||
        null;

      mensaje =
        message.image?.caption ||
        "";

    }

    else if (
      tipo === "video"
    ) {

      media_id =
        message.video?.id ||
        null;

      mensaje =
        message.video?.caption ||
        "";

    }

    else if (
      tipo === "audio"
    ) {

      media_id =
        message.audio?.id ||
        null;

    }

    else if (
      tipo === "document"
    ) {

      media_id =
        message.document?.id ||
        null;

      mensaje =
        message.document
          ?.filename || "";

    }

    else if (
      tipo === "sticker"
    ) {

      media_id =
        message.sticker?.id ||
        null;

    }

    return {

      tipo,
      mensaje,
      media_id

    };

  };