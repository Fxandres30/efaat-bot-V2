const supabase =
  require("../../lib/supabase");

module.exports =
  async function guardarMensaje(
    data
  ) {

    const {
      data: result,
      error
    } = await supabase
      .from("messages")
      .insert(data)
      .select();

    console.log(
      "INSERT RESULT:"
    );

    console.log({
      data: result,
      error
    });

    return {
      result,
      error
    };

  };