router.post(
  "/",
  async (req, res) => {

    const {
      telefono,
      template
    } = req.body;

    console.log(
      telefono,
      template
    );

    res.json({
      success: true
    });

  }
);