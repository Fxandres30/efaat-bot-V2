const router = require("express").Router();
const supabase = require("../lib/supabase");

router.post("/", async (req, res) => {

  try {

    const { telefono } = req.body;

    const result =
      await supabase
        .from("contacts")
        .update({
          archived: true
        })
        .eq(
          "telefono",
          telefono
        );

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: true
    });

  }

});

module.exports = router;