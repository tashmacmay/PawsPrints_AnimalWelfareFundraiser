//!! NB - As I am unfamiliar with JavaScript, I followed and adapted the tutorian by Lun Dev Code to learn and achieve project funtionality: https://www.youtube.com/watch?v=gXWohFYrI0M

let cart = []; //Empty array to initialise the cart
let listProducts = [] //Array of website's products for acces from the json file
let CartHTML = document.querySelector('.listCart');
let iconCartBadge = document.querySelector('.fa-cart-shopping');

const initApp = () => { //Called when the application starts, therefore product data is immediately stored to the product list array
    //get the data from the json file
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();

        //Restore data from local memory on app startup
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML(); //Shows data on screen
        }
    })
}
initApp();

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){ //If the cart is empty, simply add it
        cart = [{
            product_id: product_id,
            quantity: 1 //ID is automatically 1 as there were none before it
        }]
    }else if(positionThisProductInCart < 0){ //The product is not yet in the cart AT ALL
        cart.push({
            product_id: product_id,
            quantity: 1 //ID is automatically 1 as there were none before it
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToHTML = () => {
    CartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id)
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">
                ${info.price * cart.quantity}
            </div>
            <div class="quantity" data-id="${cart.product_id}">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
            </div>
            `;
        CartHTML.appendChild(newCart);
        })
    }
    iconCartBadge.innerText = totalQuantity;
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart)); //save to local storage (can only store string, not array, so we "stringify")
}

CartHTML.addEventListener('click', (event) => {
    let positionClick = event.target; //Note what the user has clicked
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.dataset.id;
        let type = 'minus'; //Must determine whether to add or subtract - we assume subtract by default
        if(positionClick.classList.contains('plus')){ //check whether plus, and if so, change accordingly
            type = 'plus'
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = cart[positionItemInCart].quantity - 1; //Check the value once subtracted
                if(valueChange > 0){ //There were more than one of the item, therefore it remains in the cart
                    cart[positionItemInCart].quantity = valueChange;
                }else{ //If there are no more of the product left (quantity now zero)
                   cart.splice(positionItemInCart, 1); 
                }
                break;
        }
    }
    addCartToMemory(); //Update the memory to reflect the quantity change
    addCartToHTML(); //Make the quantity change visible on the cart page
}

// const addDataToHTML = () => { //Loads the products from the json file to the html page
//     listProductHTML.innerHTML = '';
//     if(listProducts.length > 0){
//         listProducts.forEach(product => {
//             let newProduct = document.createElement('div');
//             newProduct.classList.add('item');
//             newProduct.innerHTML = `
//                 <img class="product-img" src="images/product8.jpg">
//                 <img class="product-img hover-img" src="images/product8_alt.jpg">
//                 <h3>Cat and Chick Mug</h3>
//                 <p>An artistic mug featuring little kittens, perfect for any cat lover wishing to spruce up the kitchen and bring joy to their morning coffee.</p>
//                 <div class="side-by-side-details">
//                     <p class="creator">By Jen Designs</p>
//                     <p class="price">R500.00</p>
//                 </div>
//                 <a class="button box-highlight" href="about.html"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</a>
//             `;
//             listProductHTML.appendChild(newProduct);
//         })
//     }
// }







