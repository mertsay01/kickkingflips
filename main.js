const productImage = document.getElementById("productimg");
const productTitle = document.getElementById("producttitle");
const priceElement = document.querySelector(".price");
const symbolOverlay = document.getElementById("symbolOverlay");

const products = {
    skateboard: {
        name: 'Skateboard',
        image: 'Media-assets/products/skateboard.png',
        basePrice: 24.5,
        colors: {
            white: 'Media-assets/products/skateboard.png',
            blue: 'Media-assets/products/skateboard-blauw.png',
            gold: 'Media-assets/products/skateboard-goud.png',
            red: 'Media-assets/products/skateboard-rood.png',
            silver: 'Media-assets/products/skateboard-zilver.png'
        }
    },
    shoe: {
        name: 'Schoen',
        image: 'Media-assets/products/schoen.png',
        basePrice: 20.05,
        colors: {
            white: 'Media-assets/products/schoen.png',
            blue: 'Media-assets/products/schoen-blauw.png',
            gold: 'Media-assets/products/schoen-goud.png',
            red: 'Media-assets/products/schoen-rood.png',
            silver: 'Media-assets/products/schoen-zilver.png'
        }
    },
    hat: {
        name: 'Pet',
        image: 'Media-assets/products/pet.png',
        basePrice: 12.95,
        colors: {
            white: 'Media-assets/products/pet.png',
            blue: 'Media-assets/products/pet-blauw.png',
            gold: 'Media-assets/products/pet-goud.png',
            red: 'Media-assets/products/pet-rood.png',
            silver: 'Media-assets/products/pet-zilver.png'
        }
    }
};

const colorPrices = {
    white: 0,
    blue: 0,
    gold: 3,
    red: 0,
    silver: 2
};

const symbols = {
    bam: 'Media-assets/symbols/symbol-BAM.png',
    bang: 'Media-assets/symbols/symbol-BANG.png',
    boo: 'Media-assets/symbols/symbol-BOO.png',
    boom: 'Media-assets/symbols/symbol-BOOM!.png',
    lol: 'Media-assets/symbols/symbol-LOL.png',
    oh: 'Media-assets/symbols/symbol-OH.png',
    omg: 'Media-assets/symbols/symbol-OMG!.png',
    pow: 'Media-assets/symbols/symbol-POW.png',
    wow: 'Media-assets/symbols/symbol-WOW.png'
};

const productTypeMap = {
    skateboard: 1,
    shoe: 2,
    hat: 3
};

const colorMap = {
    white: 1,
    blue: 2,
    gold: 3,
    red: 4,
    silver: 5
};

const symbolMap = {
    bam: 1,
    bang: 2,
    boo: 3,
    boom: 4,
    lol: 5,
    oh: 6,
    omg: 7,
    pow: 8,
    wow: 9
};

let activeProduct = 'skateboard';
let activeColor = 'white';
let activeSymbol = null;

function clearSymbol() {
    symbolOverlay.innerHTML = '';
}

function updateProduct(product) {
    productTitle.textContent = products[product].name;
    productImage.src = products[product].image;
    activeColor = 'white';
    activeSymbol = null;
    clearSymbol();
    updatePrice();
}

function updateColor(color) {
    const product = products[activeProduct];
    if (product.colors[color]) {
        productImage.src = product.colors[color];
        activeColor = color;
        updatePrice();
    }
}

function updatePrice() {
    const product = products[activeProduct];
    const basePrice = product.basePrice;
    const colorPrice = colorPrices[activeColor];
    const totalPrice = basePrice + colorPrice;
    priceElement.textContent = `€${totalPrice.toFixed(2)}`;
}

function showSymbol(symbol) {
    clearSymbol();
    const img = document.createElement('img');
    img.src = symbols[symbol];
    img.classList.add('center-symbol');
    symbolOverlay.appendChild(img);
    activeSymbol = symbol;
}

function getOrderData() {
    const productType = productTypeMap[activeProduct];
    const symbolId = symbolMap[activeSymbol] || null;
    const colorId = colorMap[activeColor];

    if (!productType || !symbolId || !colorId) {
        throw new Error('Een of meer vereiste velden ontbreken.');
    }

    return {
        productType: productType,
        symbol: symbolId,
        colour: colorId
    };
}

function showThankYouMessage() {
    alert('Bedankt voor je bestelling!');
}

document.querySelectorAll('.productkeuze').forEach(item => {
    item.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        activeProduct = product;
        updateProduct(product);
    });
});

document.querySelectorAll('[data-color]').forEach(item => {
    item.addEventListener('click', function() {
        const color = this.getAttribute('data-color');
        updateColor(color);
    });
});

document.querySelectorAll('.symbols').forEach(item => {
    item.addEventListener('click', function() {
        const symbol = this.getAttribute('data-symbol');
        showSymbol(symbol);
    });
});

document.querySelector('button').addEventListener('click', function() {
    try {
        const orderData = getOrderData();
        fetch('https://skills.canvasaccept.com/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showThankYouMessage();
            } else {
                alert('Er is een fout opgetreden: ' + data.error);
            }
        })
        .catch(error => {
            alert('Er is een fout opgetreden: ' + error.message);
        });
    } catch (error) {
        alert('Er is een fout opgetreden: ' + error.message);
    }
});

updatePrice();
