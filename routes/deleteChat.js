const router = require("express").Router();
const supabase = require("../lib/supabase");

router.delete("/", async (req, res) => {

  try {

    const { telefono } = req.body;

    await supabase
      .from("messages")
      .delete()
      .eq(
        "telefono",
        telefono
      );

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      error: true
    });

  }

});

module.exports = router;