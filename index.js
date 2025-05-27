const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");

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


app.get("/getcalendar",async (req,res) => {
    var appointments = await appointmentService.GetAll(false);
    res.json(appointments);
});


app.get("/event/:id", async (req, res) => {
    const appointments = await appointmentService.GetById(req.params.id);

    if (!appointments) {
        return res.status(404).send('Consulta não encontrada');
    }

    res.render('event', { appo: appointments });
});


app.post("/finish", async (req,res) => {
    var id = req.body.id;
    var result = await appointmentService.Finish(id);
    res.redirect("/");
});


app.get("/list", async (req,res) => {
    var appos = await appointmentService.GetAll(true);
    res.render("list",{appos});
});


app.get("/searchresult", async (req, res) => {
    var appos = await AppointmentService.Search(req.query.search)
    res.render("list",{appos});
});

var pollTime= 2000

setInterval(async () => {

    await AppointmentService.SendNotification()
    
},pollTime)


app.listen(1515, () => {   
});