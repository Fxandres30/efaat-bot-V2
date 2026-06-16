const router = require("express").Router();
const supabase = require("../lib/supabase");

router.post("/", async (req, res) => {

  try {

    const { telefono } = req.body;

    const result =
      await supabase
        .from("contacts")
        .update({
          favorite: true
        })
        .eq(
          "telefono",
          telefono
        );

    res.json(result);

  } catch (err) {

    res.status(500).json({
      error: true
    });

  }

});

module.exports = router;