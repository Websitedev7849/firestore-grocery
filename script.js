// const blur = document.getElementsByClassName('blur')[0];
// const confirmMsg = document.getElementsByClassName('confirmMessage')[0];
// const refreshBtn = document.getElementsByClassName('refreshBtn')[0];
let credentials = document.getElementsByClassName('credentials');

const bagButton = document.querySelector('.bagButton');
const editItems = document.querySelector('.edit-items');
// const bag = document.getElementsByClassName('bag')[0];

const sendOrderBtn = document.getElementById('send-order');

// const grossTotal = document.getElementById('grossTotal');
let tbody = document.querySelector('#tbody');

const firstLayer = document.querySelector('.first-layer');
const secondLayer = document.querySelector('.second-layer');
const thirdLayer = document.querySelector('.third-layer');

secondLayer.classList.remove('d-flex');
secondLayer.classList.add('d-none');

thirdLayer.classList.add('d-none');

const confirm = document.querySelector('.confirm');


let items = [];

let selectedItems = [];

async function appendtoFirstLayer(){
    let response = await fetch('./stock.json');
    items = await response.json();

    items.forEach(item => {
        if(item.availibility === 'y'){
            let divCard = createDivCard(item);
            firstLayer.appendChild(divCard);
        }
    });
    
    //function to create div.card element
    function createDivCard(item){
        let divCard = document.createElement('div');
        divCard.setAttribute('class', 'card m-2');

        let img = document.createElement('img');
        img.setAttribute('class', 'card-img-top');
        
        let divCardBody = document.createElement('div');
        divCardBody.setAttribute('class', 'card-body');
        
        divCard.appendChild(img);
        divCard.appendChild(divCardBody);

        let h5 = document.createElement('h5');
        h5.setAttribute('class', 'card-title');

        let p = document.createElement('p');
        p.setAttribute('class', 'card-text');

        let select = document.createElement('select');
        select.setAttribute('class', 'form-control qty');
        
        for(let i=0; i<=5; i++){
            let option = document.createElement('option');
            option.value = i;
            option.innerText = i + 'kg';
            select.appendChild(option);
        }
        
        divCardBody.appendChild(h5);
        divCardBody.appendChild(p);
        divCardBody.appendChild(select);
        
        img.setAttribute('src', item.imgSrc);
        h5.innerText = item.name;
        p.innerText = 'Rs.' + item.price;
        select.setAttribute('id', item.name);

        return divCard;

    }


    // code to update selctedItems
    const qty = document.querySelectorAll('.qty');
    qty.forEach(element => {
        element.addEventListener('change', e=>{
            let target = e.target;
            
            for (let i = 0; i < items.length; i++) {
                if (target.id === items[i].name) {
                    items[i].qty = target.value;
                    items[i].total = items[i].qty * items[i].price;
                }                
            }
        });
    });
    
    
    
}
appendtoFirstLayer();

//event handler to create array of selected items
bagButton.addEventListener('click', ()=>{
    updateSelectedItem();

    appendToTable();
    
    firstLayer.classList.remove('d-flex');
    firstLayer.classList.add('d-none');

    secondLayer.classList.remove('d-none');
    secondLayer.classList.add('d-flex');

    bagButton.style.display = "none";

});

confirm.addEventListener('click', ()=>{
    secondLayer.classList.remove('d-flex');
    secondLayer.classList.add('d-none');

    thirdLayer.classList.remove('d-none');

});

sendOrderBtn.addEventListener('click', ()=>{
    credentials = Array.from(credentials);
    let credArray = [];

    credentials.forEach(cred =>{
        credArray.push(cred.value);
    });

    console.log(credArray);

});

function updateSelectedItem() {
    items.forEach(element => {
        let selObject = {
            name: '',
            qty: '',
            price: 0,
            total: 0
        }
        
        // REMEMBER item.qty == 0 when initialized and item.qty == "0" when changed
        if (element.qty !== 0) {
            //this for loop checks if item is already selected
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].name == element.name) {
                    selectedItems[i].qty = element.qty;
                    selectedItems[i].price = element.price;
                    selectedItems[i].total = element.total;
                    return;
                }
            }

            //if item is not selected then it is appended here
            selObject.name = element.name;
            selObject.qty = element.qty;
            selObject.price = element.price;
            selObject.total = element.total;
            selectedItems.push(selObject);
        }
    });
}

function appendToTable() {

    // to display total amount to user. 
    // total amount will be vaildated on server too.
    let grossTotal = document.querySelector('.grossTotal');
    let total = 0;

    //adding to table
    selectedItems.forEach(item => {

        // REMEMBER item.qty == 0 when initialized and item.qty == "0" when changed
        if (item.qty !== "0") {

            let tr = document.createElement('tr');

            //loop to append to tr tag
            Object.values(item).forEach(property => {
                let td = document.createElement('td');
                td.innerText = property;
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);

        }
        
        total += item.total;
        grossTotal.innerText = "Rs. " + total;

    });    

}

// to edit selected items
editItems.addEventListener('click', ()=>{
    let tbodyChild = tbody.children;
    for (let i = tbodyChild.length - 1 ; i >=0 ; i--) {
        tbody.removeChild(tbodyChild[i]);
    }

    firstLayer.classList.add('d-flex');

    secondLayer.classList.remove('d-flex');
    secondLayer.classList.add('d-none');

    bagButton.style.display = "flex";
});
