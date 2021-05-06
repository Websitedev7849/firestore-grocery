const DB_API = 'http://localhost:3300/get-orders';

fetch(DB_API)
.then(res=>{
    return res.json();
})
.then(data => {
    console.log(data);
})