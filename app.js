require('dotenv').config();
const express = require('express');
const app = express();

const admin = require('firebase-admin');

let serviceAccount = require('./servicekey.json');

//fetching private key
serviceAccount.private_key_id = process.env.private_key_id;
serviceAccount.private_key = process.env.private_key;

//here you intitliaze the firestore api by verifying the user credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const collection = db.collection('orders');


const PORT = 3300;

app.use( express.json() );
app.use( express.static('public') );
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/postOrder', (req,res)=>{
    let package = req.body;

    setDoc(package);

});

app.get('/get-orders', (req,res)=> {
    console.log('api is being accesed');
    getDoc(orders => {
    
        for (let i = 0; i < orders.length; i++) {
            orders[i].userCred = JSON.parse(orders[i].userCred);
            orders[i].items = JSON.parse(orders[i].items)
        }
        console.log('json string delivered as response');
        res.send(JSON.stringify(orders));

    });

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
    
    
    generateInvoice(package.itemsToServer)
    .then(items=>{

        let grossTotal = 0;
        
        for (let i = 0; i < items.length; i++)
            grossTotal += items[i].total;
        
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
        
        console.log( userCred, items, grossTotal);

    });
   
}
// setDoc();

function getDoc(callback) {

    let orders = [];

    collection.get()
    .then(snapshot => {
       let docs = snapshot.docs;

       for (let i = 0; i < docs.length; i++)
           orders.push( docs[i].data() );

        callback(orders)
    })
    .catch(err => {
        console.log(err);
    });
}



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

