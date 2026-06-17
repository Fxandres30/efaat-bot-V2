const {
enviarImagen
} = require("./whatsapp/api");

const ADMIN = "573009760140";

async function enviarComprobanteAdmin(data) {

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
  total,
  comprobanteUrl
} = data;

if (!comprobanteUrl) {

  throw new Error(
    "No se recibió comprobanteUrl"
  );

}

await enviarImagen(

  ADMIN,

  comprobanteUrl,

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
$${Number(total).toLocaleString("es-CO")}

🏦 Método:
${metodo || "No informado"}

🕒 Estado:
Pendiente de validación`

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
  telefono,
  metodo,
  cantidad,
  total,
  comprobanteUrl
} = data;

if (!comprobanteUrl) {

  throw new Error(
    "No se recibió comprobanteUrl"
  );

}

const numeroCliente =
  telefono.startsWith("57")
    ? telefono
    : `57${telefono}`;

console.log(
  "📱 ENVIANDO A:",
  numeroCliente
);

await enviarImagen(

  numeroCliente,

  comprobanteUrl,

`Hola ${nombre} 👋🏼

💎 Bienvenid@ a EFAAT

✨ Tu comprobante fue recibido correctamente.

🎟️ Cantidad:
${cantidad}

💰 Total:
$${Number(total).toLocaleString("es-CO")}

🏦 Método:
${metodo || "No informado"}

📋 Nuestro equipo validará tu pago.

🎯 Una vez aprobado recibirás tus números automáticamente.

🙏🏼 Gracias por participar y mucha suerte 🍀`

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
