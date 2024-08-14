import { constantes } from "./constantes.js";
export async function fetchProducts(url){
    let data = await fetch (url);
    let response = await data.json();      
    return response;
}

export async function fetchSingleProduct(id){
    fetchProducts(constantes.API_ENDPOINT+constantes.METHODS.GET_SINGLE+id)
}

export async function fetchCategories(){
    let data = await fetch (constantes.API_ENDPOINT+constantes.METHODS.GET_CATEGORIES);
    let response = await data.json();  
    return response;
}

export async function fetcProdByCat(categoria){
    let data = await fetch(constantes.API_ENDPOINT+constantes.METHODS.GET_PROD_FROM_CAT+categoria);
    let response = await data.json();
    return response;
}