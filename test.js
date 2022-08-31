require('dotenv').config();
const datetime = require('node-datetime');
const axios  = require('axios');
const passKey = process.env.PASSKEY;
const shortCode = process.env.SHORTCODE;
const consumerKey = process.env.CONSUMERKEY;
const consumerSecret = process.env.CONSUMERSECRET;


// creating and generating password
    const dt = datetime.create();   
    const formartted = dt.format('YmdHMS');

const newPassword = () => {

    // concatinate shortCode + passKey + the formartted date and time to get newPasseord
    const passString = shortCode + passKey + formartted;
    const base64EncodedPassword =  Buffer.from(passString).toString('base64');     // converts the password to base64 Encoded string required by SAFARICOM

    return base64EncodedPassword;

}

//Generate token
exports.token =  (req, res, next) => {

    const url = 
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth =
     new Buffer.from(consumerKey + ':' + consumerSecret).toString('base64');

    // send headers axios
    const headers = {
        Authorization: "Basic " + auth,
    };
 
    axios
    .get(url, {
        headers: headers,
    }) 
    .then((response) => {
        let data = response.data; 
        let access_token = data.access_token;
        req.token = access_token;
        next();
    })
    .catch((error) => console.log(error));
 
};

exports.mpesaPassword = (req, res) => {
 res.send(newPassword());
};

exports.stkPush = (req, res) => {
    const token =  req.token;

    const headers = {
        Authorization: 'Bearer ' + token,
    };
    const stkURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const data = {
        BusinessShortCode: '174379',
        Password: newPassword(),
        Timetamp: formartted, 
        TransactionType:'CustomerPayBillOnline',
        Amount: '20',
        PartyA: '254759391093',
        PartyB: '174379',
        PhoneNumber: '+254759391093',
        CallBackURL: 'https://260a-154-123-3-21.ngrok.io/api/stk/push/callback/url',
        AccountReference: "TrailerMax",
        TransactionDesc:'lipa na M-PESA',

    };

    axios
    .post(stkURL, data, {headers: headers})
    .then((response) => res.send(response.data));
  
};
