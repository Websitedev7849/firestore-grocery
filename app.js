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
    
    let items;

    generateInvoice(package.itemsToServer)
    .then(data=>{

        items = data;

        let grossTotal = 0;

        for (let i = 0; i < data.length; i++) {
            grossTotal += data[i].total;
        }

        let stringifiedPackage = {
            userCred: JSON.stringify(userCred),
            items: JSON.stringify(items),
            grossTotal: grossTotal
        };
        
        collection.doc(docId).set(stringifiedPackage)
        .then(()=>{
            console.log('data appended succefully');
        })
        .catch(err=>{
            console.log(err);
        });

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

function generateInvoice(items) {
    return new Promise((res, rej)=>{
        const stock = require('./stock.json')

        let invoiceArray = [];

        items.forEach(item=>{

            let selObject = {
                name: '',
                qty: '',
                price: 0,
                total: 0
            };

            stock.forEach(stock => {
                if( item.name === stock.name ){
                    selObject.name = item.name;
                    selObject.qty = item.qty;
                    selObject.price = stock.price;
                    selObject.total = item.qty * stock.price;
                    
                    invoiceArray.push(selObject);

                }
            });
        });
        
        res(invoiceArray);

    });
}

