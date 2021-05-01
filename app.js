const express = require('express');
const app = express();

const admin = require('firebase-admin');

const serviceAccount = require('./servicekey.json');

//here you intitliaze the firestore api by verifying the user credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const collection = db.collection('orders');


const PORT = 3300;

app.use( express.json() );
app.use( express.static('public') );

app.post('/postOrder', (req,res)=>{
    let package = req.body;
    setDoc(package);
    res.status(200).send(package);
});

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});


function setDoc(package) {

    let docId = new Date().getTime() + "";

    let userCred = {
        name : package.credArray[0],
        phno : package.credArray[1],
        addr : package.credArray[2]
    };
    
    let items = package.itemsToServer;
    
    let stringifiedPackage = {
        userCred: JSON.stringify(userCred),
        items: JSON.stringify(items)
    };
    
    collection.doc(docId).set(stringifiedPackage)
    .then(()=>{
        console.log('data appended succefully');
    })
    .catch(err=>{
        console.log(err);
    });
}
// setDoc();

function getDoc() {
    collection.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            console.log(doc.data());
        });
    });
}
// getDoc();
