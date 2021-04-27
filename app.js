const express = require('express');
const app = express();
const PORT = 3300;

app.use( express.json() );
app.use( express.static('public') );

app.post('/postOrder', (req,res)=>{
    let package = req.body;
    console.log(package);
    res.json(package)
});

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});