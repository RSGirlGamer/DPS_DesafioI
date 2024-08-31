import { constantes } from "./constantes.js";
import { fetchProducts, fetchSingleProduct, fetchCategories, fetcProdByCat } from "./api_connection.js";

document.addEventListener('DOMContentLoaded', () => {
    showProducts();
    showCategories();
    loadMain();
});

let cart = [];

async function loadMain(){
    console.log("algo")
    document.querySelector("#onlineShop").addEventListener("click",(event)=>{
        event.preventDefault();
        showProducts();
    })
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.badge');
    cartCount.textContent = cart.reduce((total, product) => total + product.quantity, 0);
}

//Se cargan todos los productos y se agrega evento clic
async function showProducts() {
    const productCards = document.querySelector('#container-cards');
    const productos = await fetchProducts(constantes.API_ENDPOINT + constantes.METHODS.GET_ALL);

    productCards.innerHTML = productos.map(producto => `
        <div class="card mx-2 my-2">
            <img class="card-img-top" src="${producto.image}" alt="..." />
            <div class="card-body p-4">
                <div class="text-center">
                    <h5 class="fw-bolder">${producto.title}</h5>                                    
                </div>
                <div class="text-center">
                    $${producto.price.toFixed(2)}
                </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                    <button class="btn btn-outline-dark mt-auto" onclick="addToCart({id: ${producto.id}, title: '${producto.title}', price: ${producto.price}, image: '${producto.image}'})">
                        Comprar
                    </button>
                </div>
            </div>
        </div>`).join('');
}

async function showCategories() {
    const categoriesSelect = document.querySelector('#categories');
    const categorias = await fetchCategories();

    categoriesSelect.innerHTML = categorias.map(categoria => {
        const cat = encodeURIComponent(categoria);
        return `<li><a class="dropdown-item" href="#" onclick="filterByCategory(&quot;${cat}&quot;)">${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</a></li>`;
    }).join('');
}


async function filterByCategory(category) {
    console.log(`Categoria enviada para filtrar: ${category}`);
    const productCards = document.querySelector('#container-cards');
    const productos = await fetcProdByCat(category);

    productCards.innerHTML = productos.map(producto => `
        <div class="card mx-2 my-2">
            <img class="card-img-top" src="${producto.image}" alt="..." />
            <div class="card-body p-4">
                <div class="text-center">
                    <h5 class="fw-bolder">${producto.title}</h5>                                    
                </div>
                <div class="text-center">
                    $${producto.price.toFixed(2)}
                </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                    <button class="btn btn-outline-dark mt-auto" onclick="addToCart({id: ${producto.id}, title: '${producto.title}', price: ${producto.price}, image: '${producto.image}'})">
                        Comprar
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function showCart() {
    const modalBody = document.querySelector('#cart-modal-body');
    const modal = document.querySelector('#cart-modal');
    let total = 0;

    modalBody.innerHTML = cart.map(product => {
        total += product.price * product.quantity;
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.title}" class="cart-item-image px-2">
                <div class="cart-item-details px-3 py-2">
                    <h5>${product.title}</h5>
                    <p>Cantidad: ${product.quantity}</p>
                    <p>Precio: $${product.price.toFixed(2)}</p>
                </div>
            </div>`;
    }).join('');

    modalBody.innerHTML += `
        <div class="cart-total">
            <h5>Total: $${total.toFixed(2)}</h5>
            <div id="paypal-button-container"></div>
        </div>`;
    modal.style.display = "block";

    // Renderizar el botón de PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Pago realizado por ' + details.payer.name.given_name);
                cart = [];
                updateCartCount();
                showCart();
            });
        },
        onError: function (err) {
            console.error('Error en el pago:', err);
        }
    }).render('#paypal-button-container');

}

// Evento para abrir el modal del carrito
document.querySelector('#open-cart-modal').addEventListener('click', (event) => {
    event.preventDefault();
    showCart();
});
// Evnto para cerrar el modal cuando se hace clic en el botón de cerrar
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('#cart-modal').style.display = "none";
});

// Event listener para cerrar el modal cuando se hace clic fuera del modal
window.addEventListener('click', (event) => {
    const modal = document.querySelector('#cart-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Exponer funciones al contexto global
window.addToCart = addToCart;
window.showCart = showCart;
window.filterByCategory = filterByCategory;
