const express = require('express');
const app = express();

const admin = require('firebase-admin');

const serviceAccount = require('./servicekey.json');

//here you intitliaze the firestore api by verifying the user credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const PORT = 3300;

app.use( express.json() );
app.use( express.static('public') );

app.post('/postOrder', (req,res)=>{
    let package = req.body;
    console.log(package);
    // addToDb(package);
    res.status(200).send(package);
});

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});

function addToDb(obj) {

    obj = JSON.stringify(obj);
    let docId = new Date().getTime() + '';

    db.collection('orders').doc( docId ).set(obj)
    .then(()=>{
        console.log("package has been adapted succesfully");
    })
}