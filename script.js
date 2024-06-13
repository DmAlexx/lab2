const BUY_BUTTONS = document.querySelectorAll('.products .product button');
const ORDER_BUTTON = document.getElementById('checkoutButton');
const CANCEL_BUTTON = document.getElementById('cancelOrderButton');



const PRICE_PRODUCT_1 = 10;
const PRICE_PRODUCT_2 = 15;
const PRICE_PRODUCT_3 = 20;

let selectedProducts = [];

function changeButtonColor(event) {
    event.target.style.backgroundColor = '#006400';
}

function revertButtonColor(event) {
    event.target.style.backgroundColor = '';
}

function mouseDownButtonColor(event) {
    event.target.style.backgroundColor = '#4CAF50';
}

function addSelectedProducts(event) {
    const button = event.target;
    const product = button.parentNode;
    const productName = product.querySelector('h3').innerText;
    let productPrice = 0;
    let productIndex = -1;

    switch (productName) {
        case 'Гель для прання чорного':
            productPrice = PRICE_PRODUCT_1;
            break;
        case 'Гель для прання універсальний':
            productPrice = PRICE_PRODUCT_2;
            break;
        case 'Гель для прання білого':
            productPrice = PRICE_PRODUCT_3;
            break;
    }

    selectedProducts.forEach((product, index) => {
        if (product.name === productName) {
            productIndex = index;
        }
    });

    if (productIndex !== -1) {
        selectedProducts[productIndex].quantity += 1;
        selectedProducts[productIndex].totalPrice += productPrice;
    } else {
        let newProduct = {
            name: productName,
            quantity: 1,
            price: productPrice,
            totalPrice: productPrice
        };
        selectedProducts.push(newProduct);
    }

    let totalCost = selectedProducts.reduce((total, product) => total + product.totalPrice, 0);

    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    localStorage.setItem('totalCost', totalCost);
}

function displaySelectedProducts() {
    const listContainer = document.getElementById('selectedProductsList');
    listContainer.innerHTML = '';

    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

    selectedProducts.forEach(product => {
        const listItem = document.createElement('li');

        const productName = document.createElement('span');
        productName.textContent = `Товар: ${product.name}, Цена за единицу: $${product.price}, Количество: `;

        const quantity = document.createElement('span');
        quantity.textContent = product.quantity;

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener('click', () => {
            if (product.quantity > 0) {
                product.quantity--;
                product.totalPrice -= product.price;
                quantity.textContent = product.quantity;
                updateLocalStorage(selectedProducts);
            }
        });

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.addEventListener('click', () => {
            product.quantity++;
            product.totalPrice += product.price;
            quantity.textContent = product.quantity;
            updateLocalStorage(selectedProducts);
        });

        const totalPrice = document.createElement('span');
        totalPrice.textContent = `, Общая стоимость товара: $${product.totalPrice}`;

        listItem.appendChild(productName);
        listItem.appendChild(decreaseButton);
        listItem.appendChild(quantity);
        listItem.appendChild(increaseButton);
        listItem.appendChild(totalPrice);

        listContainer.appendChild(listItem);
    });

    const totalCost = localStorage.getItem('totalCost');
    if (totalCost) {
        const totalCostElement = document.createElement('li');
        totalCostElement.textContent = `Общая стоимость всех товаров: $${totalCost}`;
        listContainer.appendChild(totalCostElement);
    }
}



function updateLocalStorage(products) {
    let totalCost = 0;
    products.forEach(product => {
        totalCost += product.totalPrice;
    });

    localStorage.setItem('selectedProducts', JSON.stringify(products));
    localStorage.setItem('totalCost', totalCost);

    displaySelectedProducts();
}

function signForm() {
    ORDER_BUTTON.removeEventListener('click', signForm);
    const formData = {};
    const formContainer = document.createElement('div');
    formContainer.classList.add('client-form');

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Имя: ';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.required = true;

    const phoneLabel = document.createElement('label');
    phoneLabel.textContent = 'Телефон: ';
    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.required = true;

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Почта: ';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Подтвердить заказ';

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        formData.name = nameInput.value;
        formData.phone = phoneInput.value;
        formData.email = emailInput.value;

        const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        const orderWithClientData = {
            client: formData,
            products: selectedProducts
        };
        formContainer.innerHTML = '<p>Спасибо за заказ!</p>';
    });

    formContainer.appendChild(nameLabel);
    formContainer.appendChild(nameInput);
    formContainer.appendChild(document.createElement('br'));

    formContainer.appendChild(phoneLabel);
    formContainer.appendChild(phoneInput);
    formContainer.appendChild(document.createElement('br'));

    formContainer.appendChild(emailLabel);
    formContainer.appendChild(emailInput);
    formContainer.appendChild(document.createElement('br'));

    formContainer.appendChild(submitButton);

    const main = document.querySelector('main');
    main.appendChild(formContainer);
}

function clearOrderData() {
    localStorage.removeItem('selectedProducts');
    localStorage.removeItem('totalCost');
    clearMainContent();
    //displaySelectedProducts();
}

function clearMainContent() {
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.innerHTML = '';
    }
}

BUY_BUTTONS.forEach((button, index) => {
    button.addEventListener('mouseenter', changeButtonColor);
    button.addEventListener('mouseleave', revertButtonColor);
    button.addEventListener('mousedown', mouseDownButtonColor);
    button.addEventListener('mouseup', changeButtonColor);
    button.addEventListener('click', addSelectedProducts);
});

ORDER_BUTTON.addEventListener('mouseenter', changeButtonColor);
ORDER_BUTTON.addEventListener('mouseleave', revertButtonColor);
ORDER_BUTTON.addEventListener('click', signForm);

CANCEL_BUTTON.addEventListener('mouseenter', changeButtonColor);
CANCEL_BUTTON.addEventListener('mouseleave', revertButtonColor);
CANCEL_BUTTON.addEventListener('click', clearOrderData);