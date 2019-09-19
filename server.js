const express = require("express");
const app = express();
app.use(express.json({ extended: false }));
const routes = require("./routes/index");

//Define Routes
app.use("/", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
