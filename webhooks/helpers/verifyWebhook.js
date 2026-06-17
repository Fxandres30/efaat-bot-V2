module.exports = function verifyWebhook(
  req,
  res
) {

  const verifyToken =
    "efaat_verify";

  const mode =
    req.query["hub.mode"];

  const token =
    req.query["hub.verify_token"];

  const challenge =
    req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === verifyToken
  ) {

    return res
      .status(200)
      .send(challenge);

  }

  return res.sendStatus(403);

};