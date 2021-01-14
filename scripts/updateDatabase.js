let mongoose=require('mongoose')
let Client=require('../models/ClientModel')
let fs=require('fs')
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
mongoose.connect(process.env.MONGO_URI||"mongodb+srv://catena:catena@cluster0-qsztw.mongodb.net/test?retryWrites=true&w=majority",
 {useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("Connected to db");
})
// Client.find({deleted:false})
// .then(clients => {
//     clients.sort((a, b) => {
//         if (a["nr_crt"] < b["nr_crt"]) {
//             return -1;
//         }
//         if (a["nr_crt"] > b["nr_crt"]) {
//             return 1;
//         }
//         return 0;
//     })
//     fs.writeFile("users.json", JSON.stringify(clients), 'utf8', function (err) {
//         if (err) {
//             console.log("An error occured while writing JSON Object to File.");
//             return console.log(err);
//         }
     
//         console.log("JSON file has been saved.");
//     });
//     // res.json(clients)
// })
let rawdata = fs.readFileSync('users2.json');
let users = JSON.parse(rawdata);
console.log(users[100])


// // console.log(users);
// for(let i=0; i<173;i++){
//     if(users[i].adresa!==""&&users[i].judet!==""){
//     users[i].adresa=`${users[i].adresa} nr. ${users[i].judet}`;}
//     users[i].judet=users[i].localitate==="Iasi"|| users[i].localitate==="IASI" ? "Iasi":"";

// }
// fs.writeFile("users2.json", JSON.stringify(users), 'utf8', function (err) {
//             if (err) {
//                 console.log("An error occured while writing JSON Object to File.");
//                 return console.log(err);
//             }
         
//             console.log("JSON file has been saved.");
//         });


let clients=[];
//Update data base
users.forEach(elems=>{
            // console.log(elems[2]);
            let client={
                    "nr_crt":elems.nr_crt,
                    "numar_contract":elems.numar_contract!=="" ? elems.numar_contract :"",
                    "data_semnare":elems.data_semnare!=="" ? elems.data_semnare :"",
                    "nume_client":elems.nume_client!=="" ? elems.nume_client :"",
                    "localitate":elems.localitate!=="" ? elems.localitate :"",
                    "adresa":elems.adresa!=="" ? elems.adresa :"",
                    "judet":elems.judet!=="" ? elems.judet :"",
                    "telefon_fix":elems.telefon_fix,
                    "telefon_mobil":elems.telefon_mobil,
                    "email_1":elems.email_1!=="" ? elems.email_1 :"",
                    "email_2":elems.email_2!=="" ? elems.email_2 :"",
                    "registru_comert":elems.registru_comert!=="" ? elems.registru_comert :"",
                    "cod_fiscal":elems.cod_fiscal!=="" ? elems.cod_fiscal :"",
                    "cont_bancar":elems.cont_bancar!=="" ? elems.cont_bancar :"",
                    "banca":elems.banca!=="" ? elems.banca :"",
                    "persoana_contact":elems.persoana_contact!=="" ? elems.persoana_contact :"",
                    "perioada_contract":elems.perioada_contract!=="" ? elems.perioada_contract :"",
                    "data_expirare":elems.data_expirare!=="" ? elems.data_expirare :"",
                    "limita_credit":elems.limita_credit!=="" ? elems.limita_credit :"",
                    "termen_plata":elems.termen_plata!=="" ? elems.termen_plata :"",
                    "modalitate_plate":elems.modalitate_plate!=="" ? elems.modalitate_plate :"",
                    "observatii":elems.observatii!=="" ? elems.observatii :"",
                    "alte_observatii":elems.alte_observatii!=="" ? elems.alte_observatii :"",
                    "responsabil":elems.responsabil!=="\r" ? elems.responsabil :"",
            }
            clients.push( Client(client))
            
    // console.log(elems[2],elems[3],elems[4],elems[5],elems[6],elems[7],change_number(elems[8]),change_number(elems[9]),elems[10],elems[11],elems[12],elems[13],elems[14],elems[15],elems[16],elems[17],elems[18],elems[19],elems[20],elems[21],elems[22],elems[23],elems[24])
            
        })
    
        Client.collection.insert(clients).then(
            resp=>{
                console.log(resp);
            }
        ).catch(err=>{
            console.log("ERROR AT INSERTING ",err);
        })







//Writing into a file with changes 

// // console.log(users);
// for(let i=0; i<173;i++){
//     if(users[i].adresa!==""&&users[i].judet!==""){
//     users[i].adresa=`${users[i].adresa} nr: ${users[i].judet}`;}
//     users[i].judet=users[i].localitate==="Iasi"|| users[i].localitate==="IASI" ? "Iasi":"";

// }
// fs.writeFile("users2.json", JSON.stringify(users), 'utf8', function (err) {
//             if (err) {
//                 console.log("An error occured while writing JSON Object to File.");
//                 return console.log(err);
//             }
         
//             console.log("JSON file has been saved.");
//         });









// Client.collection.inse

// fs.readFile('./registru.csv', 'utf8', function(err, contents) {
//     let rows=contents.split("\n")
//     let clients=[];

//     rows.forEach(row=>{
//         elems=row.split(',');
//         // console.log(elems[2]);
//         let client={
//                 "nr_crt":elems[1],
//                 "numar_contract":elems[2]!=="" ? elems[2] :"",
//                 "data_semnare":elems[3]!=="" ? elems[3] :"",
//                 "nume_client":elems[4]!=="" ? elems[4] :"",
//                 "localitate":elems[5]!=="" ? elems[5] :"",
//                 "adresa":elems[6]!=="" ? elems[6] :"",
//                 "judet":elems[7]!=="" ? elems[7] :"",
//                 "telefon_fix":change_number(elems[8]),
//                 "telefon_mobil":change_number(elems[9]),
//                 "email_1":elems[10]!=="" ? elems[10] :"",
//                 "email_2":elems[11]!=="" ? elems[11] :"",
//                 "registru_comert":elems[12]!=="" ? elems[12] :"",
//                 "cod_fiscal":elems[13]!=="" ? elems[13] :"",
//                 "cont_bancar":elems[14]!=="" ? elems[14] :"",
//                 "banca":elems[15]!=="" ? elems[15] :"",
//                 "persoana_contact":elems[16]!=="" ? elems[16] :"",
//                 "perioada_contract":elems[17]!=="" ? changePerioada(elems[17]) :"",
//                 "data_expirare":elems[18]!=="" ? elems[18] :"",
//                 "limita_credit":elems[19]!=="" ? elems[19] :"",
//                 "termen_plata":elems[20]!=="" ? elems[20] :"",
//                 "modalitate_plate":elems[21]!=="" ? elems[21] :"",
//                 "observatii":elems[22]!=="" ? elems[22] :"",
//                 "alte_observatii":elems[23]!=="" ? elems[23] :"",
//                 "responsabil":elems[24]!=="\r" ? elems[24] :"",
//         }
//         clients.push( Client(client))
        
// // console.log(elems[2],elems[3],elems[4],elems[5],elems[6],elems[7],change_number(elems[8]),change_number(elems[9]),elems[10],elems[11],elems[12],elems[13],elems[14],elems[15],elems[16],elems[17],elems[18],elems[19],elems[20],elems[21],elems[22],elems[23],elems[24])
        
//     })

//     Client.collection.insert(clients).then(
//         resp=>{
//             console.log(resp);
//         }
//     ).catch(err=>{
//         console.log("ERROR AT INSERTING ",err);
//     })

    
// });


function change_number(number){
    // console.log(number)
    if(number.lenght===9){
    number=number.toString();
    number=number.splice(0,0,"0")
    number=number.splice(4,0,"-")
    number=number.splice(8,0,"-")}
    return number!=="0--" ? number : "";
}

// function changePerioada(perioada) {
//     if (perioada.match("ANI") || perioada.match("ani")) {
//         perioada = perioada.replace("ANI", '');
//         perioada = perioada.replace("ani", '');
//         perioada = Number(perioada) * 12
//         return perioada
//     }
//     if (perioada.match("luni") || perioada.match("luni")) {
//         perioada = perioada.replace("LUNI", '');
//         perioada = perioada.replace("luni", '');
//         return perioada
//     }
// }


