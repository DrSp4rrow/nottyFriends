require("dotenv").config();
const express = require("express");
const videoRoutes = require("./src/routes/video.routes");

const app = express();
const PORT = process.env.PORT || 5080;

app.use(express.static("public"));
app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
