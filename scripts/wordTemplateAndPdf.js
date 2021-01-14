var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');


////////////////////////////////////////////
var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
 
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = "30b871aa-96e4-48b5-8807-483b97f21728"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Apikey.apiKeyPrefix['Apikey'] = "Token"
 
var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

////////////////////////////////////////////

let create_document = (client,res) => {
    let doc=setData(client);
    // console.log(client);
    try {
        doc.render();
        var buf = doc.getZip()
            .generate({ type: 'nodebuffer' });
            console.log("The buffer is readed and converted");
        var callback = function (error, data, response) {
            if (error) {
                console.error(error);
            } else {
                // console.log('API called successfully. Returned data: ' + data);
                console.log("there is no error proced");
                // fs.writeFileSync(output, data);
                console.log("the file is writed");
                // res.sendFile(output)
                res.set("Access-Control-Allow-Origin","*")
                res.send(data);
            }
        };
        apiInstance.convertDocumentDocxToPdf(buf, callback);

    }
    catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(key, value) {
            if (value instanceof Error) {
                return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                    error[key] = value[key];
                    return error;
                }, {});
            }
            return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (error) {
                return error.properties.explanation;
            }).join("\n");
            console.log('errorMessages', errorMessages);
       }
        throw error;
    }
}


function setData(client) {

    var content = fs
        .readFileSync(path.resolve(__dirname+ '/template.docx'), 'binary');

    var zip = new PizZip(content);

    var doc = new Docxtemplater();
    let { data_semnare,
        nume_client,
        localitate,
        adresa,
        judet,
        telefon_fix,
        telefon_mobil,
        email_1,
        email_2,
        cod_fiscal,
        cont_bancar,
        banca,
        persoana_contact,
        perioada_contract,
        data_expirare,
        limita_credit,
        termen_plata,
        responsabil,
        registru_comert,
        numar_contract } = client;


    doc.loadZip(zip);

    data_semnare = formatDate(data_semnare);

    data_expirare = formatDate(data_expirare);

    doc.setData({
        email: email_1 !== "" ? email_1 : email_2,
        registru_comert: registru_comert || "____________",
        data_semnare: data_semnare,
        nume_client: nume_client,
        localitate: localitate || "____________",
        adresa: adresa || "_________________",
        judet: judet || "____________",
        telefon_fix: telefon_fix || "____________",
        telefon_mobil: telefon_mobil || "____________",
        cod_fiscal: cod_fiscal || "____________",
        cont_bancar: cont_bancar || "____________",
        banca: banca || "____________",
        persoana_contact: persoana_contact || "____________",
        perioada_contract: perioada_contract || "____________",
        data_expirare: data_expirare,
        limita_credit: limita_credit || "____________",
        termen_plata: termen_plata || "____",
        responsabil: responsabil || "____________",
        numar_contract: numar_contract || "____________"
    });
    return doc;

}



function formatDate(date) {
    date = new Date(date)
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
    return date;
}
module.exports = create_document
