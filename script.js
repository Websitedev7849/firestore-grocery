const blur = document.getElementsByClassName('blur')[0];
const qty = document.getElementsByClassName('qty');
const confirm = document.getElementById('confirm');
const userInfo = document.getElementsByClassName('userInfo')[0];
const confirmMsg = document.getElementsByClassName('confirmMessage')[0];
const refreshBtn = document.getElementsByClassName('refreshBtn')[0];
let credentials = document.getElementsByClassName('credentials');

const bagButton = document.getElementsByClassName('bagButton')[0];
const bag = document.getElementsByClassName('bag')[0];

const sendOrderBtn = document.getElementById('sendOrder');

const grossTotal = document.getElementById('grossTotal');
let tbody = document.getElementById('tbody');
let selectedItems = [
    {
        name: 'Potato',
        qty: 0,
        price: 20,
        total: 0
    },
    {
        name: 'Tomato',
        qty: 0,
        price: 30,
        total: 0
    },
    {
        name: 'Lasoon',
        qty: 0,
        price: 10,
        total: 0
    }
];

//var to send to server
let packageToServer = {
    userCred: {},
    itemsToServer: []
}
let itemsToServer = [];
let userCred = {
    name: '',
    phno: '',
    addr: ''
};


// adding event listner to select tag
for (let i = 0; i < qty.length; i++) {
    qty[i].addEventListener('change', e => {
        bagButton.style.display = "block"
        let target = e.target;

        //to update the selectedItems Array
        switch (target.id) {
            case 'Potato':
                selectedItems[0].qty = target.value;
                selectedItems[0].total = selectedItems[0].qty * selectedItems[0].price;
                break;
        
            case 'Tomato':
                selectedItems[1].qty = target.value;
                selectedItems[1].total = selectedItems[1].qty * selectedItems[1].price;
                break;
        
            case 'Lasoon':
                selectedItems[2].qty = target.value;
                selectedItems[2].total = selectedItems[2].qty * selectedItems[2].price;
                break;
        }
    }); 
}


//adding event listener to get userinfo
for (let i = 0; i < credentials.length; i++) {
    credentials[i].addEventListener('blur', e=>{
        let target = e.target;
        switch (target.id) {
            case 'name':
                userCred.name = target.value;
                break;
            case 'phno':
                userCred.phno = target.value;
                break;
            case 'addr':
                userCred.addr = target.value;
                break;
        }
    });  
}

bagButton.addEventListener('click', ()=>{
    blur.style.display = "block";
    let total = 0;

    //adding to table
    selectedItems.forEach(item => {
        let tr = document.createElement('tr');
        if (item.qty !== 0) {

            // adding items to itemsToServer to send to server
            itemsToServer.push(item);

            

            //loop to append to tr tag
            Object.values(item).forEach(property => {
                let td = document.createElement('td');
                td.innerText = property;
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        }
    });

    //loop to calculate Gross total
    selectedItems.forEach(item => {
        total += item.total;
    });

    grossTotal.innerText = total;
    bag.style.display = "flex";
    bagButton.style.display = "none"

});

confirm.addEventListener('click', ()=>{
    userInfo.style.display = "flex";
});

sendOrderBtn.addEventListener('click',()=>{
    packageToServer.userCred = userCred;
    packageToServer.itemsToServer = itemsToServer;   
    console.log(packageToServer); 
    // sendToServer(packageToServer);
    confirmMsg.style.display = "flex";
});

refreshBtn.addEventListener('click', ()=>{
    location.reload();
});

async function sendToServer(arr) {
    fetch('/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(arr)
    });
}