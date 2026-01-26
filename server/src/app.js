require("dotenv").config();

const express = require('express');
const app = express();

app.use("/api", require("./routes"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});