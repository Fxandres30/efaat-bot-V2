const supabase =
  require("../../lib/supabase");

module.exports =
  async function actualizarEstado(
    status
  ) {

    const { error } =
      await supabase
        .from("messages")
        .update({

          estado:
            status.status

        })
        .eq(
          "wamid",
          status.id
        );

    if (error) {

      console.log(
        "ERROR ACTUALIZANDO ESTADO:"
      );

      console.log(error);

    }

  };