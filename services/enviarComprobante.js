const {
enviarImagen,
enviarTexto
} = require("./whatsapp/api");

const ADMIN = "573009760140";

// =====================================
// ENVIAR COMPROBANTE AL ADMIN
// =====================================

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

`🛒 NUEVA COMPRA RECIBIDA

👤 Cliente:
${nombre}

📱 Teléfono:
${telefono}

📧 Correo:
${correo || "No informado"}

🎟️ Cantidad de números:
${cantidad}

💰 Valor reportado:
$${Number(total).toLocaleString("es-CO")}

🏦 Método de pago:
${metodo || "No informado"}

📋 Estado:
PENDIENTE DE VALIDACIÓN ⏳

🕒 Revisar comprobante y aprobar compra.`

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

// =====================================
// CONFIRMACIÓN AL CLIENTE
// =====================================

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

// MENSAJE 1 (CON IMAGEN)

await enviarImagen(

  numeroCliente,

  comprobanteUrl,

`Hola ${nombre} 👋🏼

Hemos recibido correctamente tu comprobante de pago. ✅

🎟️ Cantidad de números:
${cantidad}

💰 Valor reportado:
$${Number(total).toLocaleString("es-CO")}

🏦 Método de pago:
${metodo || "No informado"}

📋 Estado actual:
PENDIENTE DE VALIDACIÓN ⏳

Nuestro equipo ya se encuentra verificando la información enviada. ✍️

🎯 Una vez aprobado el pago, recibirás automáticamente tus números en este mismo chat.

📝 No es necesario enviar nuevamente el comprobante.

☘️ Gracias por participar con EFAAT.`

);

// MENSAJE 2 (CONTINUAR CONVERSACIÓN)

await enviarTexto(

  numeroCliente,

`🚀 Mientras validamos tu pago queremos darte la bienvenida a EFAAT.

Desde este chat también puedes:

👥 Escribir GRUPOS para acceder a nuestros grupos oficiales.

🎟️ Escribir MIS NÚMEROS para consultar tus participaciones.

🎁 Escribir PROMOS para conocer promociones y eventos disponibles.

🌐 Escribir SITIO WEB para visitar nuestra plataforma.

🤝 Estamos trabajando para brindarte la mejor experiencia posible.

¡Mucha suerte! 🍀`

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
