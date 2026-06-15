const {

  enviarTexto,
  enviarTemplateComprobante

} = require(
  "./whatsapp/api"
);

const ADMIN =
  "573226848246"; // CAMBIA POR TU NÚMERO

async function enviarComprobanteAdmin(
  data
) {

  try {

    console.log(
      "📩 ENVIANDO AL ADMIN"
    );

    const {

      nombre,
      telefono,
      correo,
      metodo,
      cantidad,
      total

    } = data;

    await enviarTexto(

      ADMIN,

`🛒 NUEVA COMPRA

👤 Cliente:
${nombre}

📱 Teléfono:
${telefono}

📧 Correo:
${correo || "No informado"}

🎟️ Cantidad:
${cantidad}

💰 Total:
$${Number(total)
  .toLocaleString("es-CO")}

🏦 Método:
${metodo || "No informado"}

📎 Comprobante recibido correctamente.`

    );

    console.log(
      "✅ ADMIN OK"
    );

  }

  catch (err) {

    console.log(
      "❌ ERROR ADMIN"
    );

    console.log(err);

    throw err;

  }

}

async function enviarConfirmacionCliente(data) {

  try {

    const {
      nombre,
      telefono
    } = data;

    const numeroCliente =
      telefono.startsWith("57")
        ? telefono
        : `57${telefono}`;

    console.log(
      "📱 ENVIANDO A:",
      numeroCliente
    );

    // await enviarTemplateComprobante(
    //   numeroCliente
    // );

    // console.log(
    //   "✅ TEMPLATE OK"
    // );

    await enviarTexto(

      numeroCliente,

`Hola ${nombre} 👋🏼

Mucho gusto, bienvenid@ a EFAAT 💎

✨ Tu comprobante fue recibido correctamente.

📋 Nuestro equipo validará tu pago.

🙏🏼 Gracias por participar.`

    );

    console.log(
      "✅ CLIENTE OK"
    );

  }

  catch (err) {

    console.log(
      "❌ ERROR CLIENTE"
    );

    console.log(err);

    throw err;

  }

}

module.exports = {

  enviarComprobanteAdmin,
  enviarConfirmacionCliente

};