const {

  enviarTexto,
  enviarTemplateComprobante

} = require(
  "./whatsapp/api"
);

async function enviarComprobanteAdmin(
  data
) {

  console.log(
    "🔥 ADMIN OK"
  );

}

async function enviarConfirmacionCliente(
  data
) {

  console.log(data);

  const {

    nombre,
    telefono

  } = data;

  const numeroCliente =

    telefono.includes("57")

      ? telefono

      : `57${telefono}`;

  console.log(
    numeroCliente
  );

  // 🔥 TEMPLATE OFICIAL

  await enviarTemplateComprobante(

    numeroCliente

  );

  // 🔥 ESPERA

  await new Promise(

    resolve =>

      setTimeout(
        resolve,
        3000
      )

  );

  // 🔥 MENSAJE LIBRE

  await enviarTexto(

    numeroCliente,

`Hola 👋🏼

Mucho gusto, bienvenid@ a EFAAT 💎

✨ Tu comprobante fue recibido correctamente.

🙏🏼 Gracias por participar.`

  );

}

module.exports = {

  enviarComprobanteAdmin,
  enviarConfirmacionCliente

};