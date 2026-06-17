const supabase =
  require("../../lib/supabase");

module.exports =
  async function crearCliente(
    telefono,
    contacto
  ) {

    const {
      data: clienteExistente
    } = await supabase
      .from("clientes")
      .select("id")
      .eq(
        "telefono",
        telefono
      )
      .maybeSingle();

    if (
      clienteExistente
    ) {

      return;

    }

    const nombre =
      contacto?.profile
        ?.name ||
      "Sin nombre";

    const {
      error
    } = await supabase
      .from("clientes")
      .insert({

        telefono,
        nombre

      });

    if (error) {

      console.log(
        "ERROR CREANDO CLIENTE:"
      );

      console.log(error);

      return;

    }

    console.log(
      `CLIENTE CREADO: ${telefono}`
    );

  };