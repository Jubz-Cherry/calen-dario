var appointment = require("../models/Appointment");
var mongoose = require("mongoose");
var AppointmentFactory = require("../factories/AppointmentFactory");
var mailer = require("nodemailer");

const Appo = mongoose.model("Appointment",appointment);

class AppointmentService {

    async Create(name, email, cpf, description, date, time){
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        });

        try{
            await newAppo.save()
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async GetAll(showFinished){

        if(showFinished){
            return await Appo.find();
        }else{
            var appos = await Appo.find({'finished': false});
            var appointments = [];

            appos.forEach(appointment => {

                if(appointment.date != undefined){
                    appointments.push(AppointmentFactory.Build(appointment) )
                }
            });

            return appointments;

        }
    }

    async GetById(id){
        try{
            var event = await Appo.findOne({_id: id});
            return event;
        }catch(err){
            console.log("Deu erro", err);
        }
    }

    async Finish(id){
        try{
        await Appo.findByIdAndUpdate(id,{finished: true});
        return true;
        }catch(err){
            console.log("Deu erro", err);
            return false;
        }
    }

    async Search(query){
        try{
            var appos = await Appo.find().or([{email: query},{cpf: query}]);
            return appos;
        }catch(err){
            console.log("CPF ou email inválido", err);
            return [];
        }
        
    }

    async SendNotification(){
        var appos = await this.GetAll(false);

        var transporter = mailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                user: "5f9a9cf8013213",
                pass: "28dac597a538e0"
                }
        });

        for (const app of appos) {

            const date = app.start.getTime()
            const hour = 1000 * 60 * 60;
            const gap = date-Date.now();

            if(gap <= hour){

                if(!app.notified){

                    await Appo.findByIdAndUpdate(app.id,{notified: true});

                    transporter.sendMail({
                        from: "Gabriel <gabriel@gmail.com>",
                        to: app.email,
                        subject: "Sua consulta irá ocorrer embreve",
                        text: "Se prepare!!"
                    }).then( () => {
                        console.log("Email enviado!", app.email);
                    }).catch(err => {
                        console.log("Erro ao enviar email:", app.email, err);
                    })

                }
                
            }
        }
    }
}

module.exports= new AppointmentService();

