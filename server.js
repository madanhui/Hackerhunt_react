const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());


require('./route')(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server is running at port " + PORT);
});
