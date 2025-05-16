const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const FullCalendar = require("fullcalendar");
const appointmentService = require("./services/AppointmentService");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/calendario", {})
.then(() => {
    console.log("Mongo funcionando!");
}).catch((err) => {
    console.log("Mongo não esta conectado", err);
}); 


app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index");
});


app.get("/cadastro", (req, res) => {
    res.render("create");
});

app.post("/create", async (req, res) => {

    var status = await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.description,
        req.body.date,
        req.body.time,
    )
    
    if(status){
        res.redirect("/");
    }else{
        res.send("Ocorreu uma falha");
    }

});

app.get("/getcalendar", async (req,res) => {
    var consultas = await appointmentService.GetAll(false);
    res.json(consultas);
});


app.listen(1515, () => {

})