const mongoose=require("mongoose")
const mongoose_auto_increment=require('mongoose-auto-increment-reworked').MongooseAutoIncrementID

const ClientSchema=mongoose.Schema({
    nr_crt:{
      type:Number,
      unique:true,      
    },
    numar_contract:{
        type:String,
        unique:true
    },
    data_semnare:{
        type:Date,
        require:true,
    },
    nume_client:{
        type:String,
        require:true,
    },
    localitate:{
        type:String,
    },
    adresa:{
        type:String,

    },
    judet:{
        type:String,
        
    },
    telefon_fix:{
        type:String,
        maxlength:12,
    },
    telefon_mobil:{
        type:String,
        maxlength:12,
    },
    email_1:{
        type:String,
        require:true,
    },
    email_2:{
        type:String,
        
    },
    registru_comert:{
        type:String,
        
    },
    cod_fiscal:{
        type:String,
        require:true,
    },
    cont_bancar:{
        type:String,
        maxlength:28
    },
    banca:{
        type:String,

    },
    persoana_contact:{
        type:String,
        require:true,
    },
    perioada_contract:{
        type:String,
        require:true,
    },
    data_expirare:{
        type:Date,
        require:true,
    },
    limita_credit:{
        type:String,
        
    },
    termen_plata:{
        type:String,
        
    },
    modalitate_plate:{
        type:String,
        
    },
    observatii:{
        type:String,
        
    },
    alte_observatii:{
        type:String,
        
    },
    responsabil:{
        type:String,
        require:true,
    },
    deleted:{
        type:Boolean,
        default:false
    }

});

mongoose_auto_increment.initialise("numar_contract");
const options = {
    field: 'numar_contract',
    incrementBy: 155, // incremented by 2 every time
    startAt: 1, // Start the counter at 1000
    // unique: true // Don't add a unique index
  };
const options2 = {
    field: 'nr_crt',
    incrementBy: 1, // incremented by 2 every time
    startAt: 1, // Start the counter at 1000
    unique: true // Don't add a unique index
};
// const plugin=new mongoose_auto_increment(ClientSchema,"Client",options);
const secondPlugin=new mongoose_auto_increment(ClientSchema,"Client",options2);
// plugin.applyPlugin();
secondPlugin.applyPlugin();
module.exports=mongoose.model("Client",ClientSchema);