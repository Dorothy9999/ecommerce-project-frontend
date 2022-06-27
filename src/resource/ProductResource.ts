import axios, {AxiosResponse} from "axios";
import {ProductDetailsData, ProductListingItemData} from "../data/ProductData";
import getEnvConfig from "../Config/Config";


export function getProductListingItems (setProductListingPageData:(data :ProductListingItemData[])=> void) {
    axios.get(`${getEnvConfig().baseUrl}/public/product`)
        .then((response:AxiosResponse<ProductListingItemData[]>) =>{
            setProductListingPageData(response.data);
        })
}

export function getProductDetailsData (productId:string,loadProductDetailsData:(data: ProductDetailsData | null) =>void) {
    axios.get(`${getEnvConfig().baseUrl}/public/product/${productId}`)
        .then((response:AxiosResponse<ProductDetailsData>) => {
            loadProductDetailsData(response.data)
        }).catch((error) => {
            console.log(error.message);
        loadProductDetailsData(null);
    })
}