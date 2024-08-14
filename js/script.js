import { constantes } from "./constantes.js";
import {fetchProducts, fetchSingleProduct, fetchCategories, fetcProdByCat} from "./api_connection.js"
document.addEventListener('DOMContentLoaded', function(){
     /* fetchProducts(constantes.API_ENDPOINT+constantes.METHODS.GET_ALL);
     fetchSingleProduct(2);
     fetchCategories();
     fetcProdByCat('jewelery'); */

     showProducts();
     showCategories();
     
})

async function showProducts(){
    const productCards = document.querySelector('#container-cards') 
 let productos = await fetchProducts(constantes.API_ENDPOINT+constantes.METHODS.GET_ALL);

 for (let i = 0; i < productos.length; i++) {

    productCards.innerHTML += `
    <div class="card mx-2 my-2">
                            <img class="card-img-top" src="${productos[i].image}" alt="..." />
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder">${productos[i].title}</h5>                                    
                                </div>
                                <div class="text-center">
                                $${productos[i].price.toFixed(2)}
                                </div>
                            </div>
                            <!-- Product actions-->
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Comprar</a></div>
                            </div>
                        </div>`

 }
console.log(productos);
 }

 async function showCategories(){
    const categoriesSelect = document.querySelector('#categories')
    let categorias = await fetchCategories();
    
    for (let i = 0; i < categorias.length; i++) {
        categoriesSelect.innerHTML+= `<li><a class="dropdown-item">${categorias[i].charAt(0).toUpperCase()+categorias[i].slice(1)}</a></li>`
        
    }
 }