const PORT = 3001;
const express = require('express');
var session = require('express-session');
let app = express();
let cors = require('cors')
let body_parser=require('body-parser')
const mongoose = require('mongoose')
const Client = require("./models/ClientModel")
const create_doc = require('./scripts/wordTemplateAndPdf')
const dotenv=require("dotenv");
const verify=require("./auth route/verify")
const User = require("./models/User")
const { registerValidation, loginValidation} = require("./auth route/validation")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
dotenv.config();    
app.use(express.json())
app.use(cors());
app.use(body_parser.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));


mongoose.connect(process.env.MONGO_URI || "mongodb+srv://catena:catena@cluster0-qsztw.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log("Connected to db");
    })

// app.use("/api/",auth_route)

app.get('/clients', verify,(req, res) => {
        Client.find({deleted:false})
            .then(clients => {
                clients.sort((a, b) => {
                    if (a["nr_crt"] < b["nr_crt"]) {
                        return -1;
                    }
                    if (a["nr_crt"] > b["nr_crt"]) {
                        return 1;
                    }
                    return 0;
                })
                res.json(clients)
            }).
        catch(err=>{
            console.log(err)
            res.status(500).send("Internal Server Error. Please try again!")
        })
})


app.get("/clientByFiscalCode/:codFiscal",verify, (req, res) => {
        let cod = req.param("codFiscal");
        let search = new RegExp("(.+" + cod + ".+)|(.+" + cod + ")|(" + cod + ".+)");
        Client.find({ cod_fiscal: { $regex: search, $options: "i" } ,deleted:false })
            .then(client => {
                client.sort((a, b) => {
                    if (a["nr_crt"] < b["nr_crt"]) {
                        return -1;
                    }
                    if (a["nr_crt"] > b["nr_crt"]) {
                        return 1;
                    }
                    return 0;
                })
                res.json(client);
            }).catch(err => {
                console.log(err)
                res.status(500).send("Internal Server Error. Please try again!")
            })
})

app.get("/clientByName/:name", verify,(req, res) => {
        let name = req.param("name");
        let search = new RegExp("(.+" + name + ".+)|(.+" + name + ")|(" + name + ".+)");
        Client.find({ nume_client: { $regex: search, $options: "i" },deleted:false  })
            .then(client => {
                client.sort((a, b) => {
                    if (a["nr_crt"] < b["nr_crt"]) {
                        return -1;
                    }
                    if (a["nr_crt"] > b["nr_crt"]) {
                        return 1;
                    }
                    return 0;
                })
                res.json(client);
            }).catch(err => {
                console.log(err)
                res.status(500).send("Internal Server Error. Please try again!")
            })
})

app.get("/clientByContractNumber/:contractNumber",verify, (req, res) => {
        let contractNumber = req.param("contractNumber");
        console.log(contractNumber);
        Client.find({ numar_contract: contractNumber})
            .then(client => {
                res.json(client)
            }).catch(err => {
                console.log(err)
                res.status(500).send("Internal Server Error. Please try again!")
            })
})


app.post("/add_user",verify, async (req, res) => {
        Client.find().sort({ nr_crt: -1 }).limit(1)
            .then(clients => {
                let numar_contract = Number(clients[0]["numar_contract"]) + 1
                const post = new Client({
                    numar_contract:String(numar_contract),
                    data_semnare: req.body.data_semnare !== "" ? req.body.data_semnare.trim() : "",
                    nume_client: req.body.nume_client !== "" ? req.body.nume_client.trim() : "",
                    localitate: req.body.localitate !== "" ? req.body.localitate.trim() : "",
                    adresa: req.body.adresa !== "" ? req.body.adresa.trim() : "",
                    judet: req.body.judet !== "" ? req.body.judet.trim() : "",
                    telefon_fix: req.body.telefon_fix !== "" ? req.body.telefon_fix.trim() : "",
                    telefon_mobil: req.body.telefon_mobil !== "" ? req.body.telefon_mobil.trim() : "",
                    email_1: req.body.email_1 !== "" ? req.body.email_1.trim() : "",
                    email_2: req.body.email_2 !== "" ? req.body.email_2.trim() : "",
                    registru_comert: req.body.registru_comert !== "" ? req.body.registru_comert.trim() : "",
                    cod_fiscal: req.body.cod_fiscal !== "" ? req.body.cod_fiscal.trim() : "",
                    cont_bancar: req.body.cont_bancar !== "" ? req.body.cont_bancar.trim() : "",
                    banca: req.body.banca !== "" ? req.body.banca.trim() : "",
                    persoana_contact: req.body.persoana_contact !== "" ? req.body.persoana_contact.trim() : "",
                    perioada_contract: req.body.perioada_contract !== "" ? req.body.perioada_contract.trim() : "",
                    data_expirare: req.body.data_expirare !== "" ? req.body.data_expirare.trim() : "",
                    limita_credit: req.body.limita_credit !== "" ? req.body.limita_credit.trim() : "",
                    termen_plata: req.body.termen_plata !== "" ? req.body.termen_plata.trim() : "",
                    modalitate_plate: req.body.modalitate_plate !== "" ? req.body.modalitate_plate.trim() : "",
                    observatii: req.body.observatii !== "" ? req.body.observatii.trim() : "",
                    alte_observatii: req.body.alte_observatii !== "" ? req.body.alte_observatii.trim() : "",
                    responsabil: req.body.responsabil !== "" ? req.body.responsabil.trim() : "",
                })
                try {
                    const savedUser = post.save();
                    res.json({ message: "success",client:post });
                }
                catch (err) {
                    res.status(400).send(err)
                }
            }).catch(err => {
                console.log(err)
                res.status(500).send("Internal Server Error. Please try again!")
            });
  
});


app.put("/update_client",verify, (req,res)=>{
    Client.findOneAndUpdate({nr_crt:req.body.nr_crt},{...req.body})
    .then(()=>{
        Client.findOne({nr_crt:req.body.nr_crt}).then(resp=>{console.log(resp);
        res.json({message:"success"})})
    }).catch(err => {
        console.log(err)
        res.status(500).send("Internal Server Error. Please try again!")
    })
})

app.put("/delete_client",verify, (req,res)=>{
    Client.findOneAndUpdate({nr_crt:req.body.nr_crt},{deleted:true})
    .then(()=>{
        Client.findOne({nr_crt:req.body.nr_crt}).then(resp=>{console.log(resp);
        res.json({message:"success"})})
    }).catch(err => {
        console.log(err)
        res.status(500).send("Internal Server Error. Please try again!")
    })
})

app.put("/restore_client",verify, (req,res)=>{
    Client.findOneAndUpdate({nr_crt:req.body.nr_crt},{deleted:false})
    .then(()=>{
        Client.findOne({nr_crt:req.body.nr_crt}).then(resp=>{console.log(resp);
        res.json({message:"success"})})
    }).catch(err => {
        console.log(err)
        res.status(500).send("Internal Server Error. Please try again!")
    })
})

app.post("/createContract",verify, (req, res) => {
        let client = req.param('client')
        try {
            console.log("here");
            create_doc(client, res);
        }
        catch (err) {
            console.log(err);
            res.json(err)
        }
})

app.get('/getTemplate',verify, (req, res) => {
        res.download(__dirname + "/resources/Template.docx")
}) 

app.get('/get_deleted',verify,(req,res)=>{
    Client.find({deleted:true})
    .then(resp=>{res.json(resp)}
    ).catch(err => {
        console.log(err)
        res.status(500).send("Internal Server Error. Please try again!")
    })
})



app.get("/", (req, res) => {
    res.send("This is the route");
    res.end();
})



app.post("/register", async (req, res) => {
    //Validate
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    //Check for user 
    const emailExists= await User.findOne({email:req.body.email})
    if(emailExists) return res.status(400).json({error:"Email already exists"})

    // Hasing the password 
    const salt= await bcrypt.genSalt(10)
    const hashPass= await bcrypt.hash(req.body.password,salt);



    //Create a new user 
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPass,
    }) 
    //Saving into database
    try {
        const savedUser=await user.save();
        res.json({user:savedUser._id})
    }
    //Catching any errors
    catch (e) {
        res.status(400).send(e)
    }


})


app.post("/login", async(req,res)=>{
    console.log(req.body);
    //Validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    //Check for user 
    const user= await User.findOne({email:req.body.email})
    if(!user) return res.status(400).json({error:"Email ''or Password ''is wrong"});

    //Password is correct 
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if (!validPass) return res.status(400).json({error:"''Email or'' Password is wrong"});
    
    //Create and asign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header("auth-token",token).json({message:"success",jwt:token});
})


app.listen(PORT, () => {
    console.log(`Server starts at http://localhost:${PORT}`);
});