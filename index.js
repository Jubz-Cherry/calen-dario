const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.send("Oiiii");
});

app.listen(1515, () => {

})