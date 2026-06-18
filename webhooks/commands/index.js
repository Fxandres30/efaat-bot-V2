const comandoGrupos =
  require("./grupos");

const comandoPromos =
  require("./promos");

const comandoSitioWeb =
  require("./sitioWeb");

const comandoMisNumeros =
  require("./misNumeros");

const {
  enviarTexto
} = require(
  "../../whatsapp/api"
);

module.exports =
  async function ejecutarComando(
    telefono,
    mensaje
  ) {

    const texto =
      mensaje
        .trim()
        .toLowerCase();

    if (texto === "grupos") {

      await enviarTexto(
        telefono,
        await comandoGrupos()
      );

      return true;

    }

    if (texto === "promos") {

      await enviarTexto(
        telefono,
        await comandoPromos()
      );

      return true;

    }

    if (texto === "sitio web") {

      await enviarTexto(
        telefono,
        await comandoSitioWeb()
      );

      return true;

    }

    if (
      texto === "mis numeros" ||
      texto === "mis números"
    ) {

      await enviarTexto(
        telefono,
        await comandoMisNumeros(
          telefono
        )
      );

      return true;

    }

    return false;

  };