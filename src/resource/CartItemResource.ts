import {firebaseAuthServiceGetAccessToken} from "../service/AuthService";
import axios, {AxiosResponse} from "axios";
import {ShoppingCartData} from "../data/ShoppingCartData";
import getEnvConfig from "../Config/Config";

export function getCartItemList(setCartItemDataList: (cartItemDataList: ShoppingCartData[] | null) => void) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token: string) => {  //從firebase羅token返黎，然後放入get API個header入面，好似postman我地要用token去羅資料一樣
            //return個promise先.then
            return axios.get<ShoppingCartData[]>(`${getEnvConfig().baseUrl}/cart`,
                {
                    headers: {Authorization: 'Bearer ' + token} //模擬postman的authorization
                })
        })
        .then((response) => {
            setCartItemDataList(response.data);
        }).catch((error) => {
        console.log(error);
        setCartItemDataList(null);
    })
}

/* 這個方法不好,因為readability低,會有三角形陷入去
export default function getCartItemList (setCartItemDataList: (cartItemDataList: ShoppingCartData[]|null) => void) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token:string) => {
            axios.get<ShoppingCartData[]>('${getEnvConfig().baseUrl}/cart',
                {
                    headers:{Authorization:'Bearer' + token}
                }).then((response)=>{
                setCartItemDataList(response.data);
            }).catch((error)=>{
                console.log(error);
                setCartItemDataList(null);
            })
        })
}
 */

export function removeCartItem(pid: number, onApiRemoveCartItem: (isSuccess: boolean, pid: number) => void) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token: string) => {
            return axios.delete(`${getEnvConfig().baseUrl}/cart/${pid}`,
                {
                    headers: {Authorization: 'Bearer ' + token}
                })
        })
        .then(() => {
            onApiRemoveCartItem(true, pid);
        })
        .catch(() => {
            onApiRemoveCartItem(false, pid);
        })
}

export function patchCartItemQuantity(pid: number, quantity: number,
                                      onApiPatchCartItemQuantity: (isSuccess: boolean, pid?: number, quantity?: number) => void) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token: string) => {
            return axios.patch(`${getEnvConfig().baseUrl}/cart/${pid}/${quantity}`,
                undefined, //patch method needs a body, but we don't have, that's why we need to put undefined
                {
                    headers: {Authorization: 'Bearer ' + token}
                })
        })
        .then(() => onApiPatchCartItemQuantity(true, pid, quantity))
        .catch(() => onApiPatchCartItemQuantity(false));

}

//handle a rejection of promise, but don't work
export function putCartItem(pid: number, quantity: number, onApiPutCartItem: (isSuccess: boolean) => void,
                            setShowRemindAddToCart: (isLogout: boolean) => void) {
    firebaseAuthServiceGetAccessToken()
        ?.then(()=>{
            console.log("Dor's method: firebase success")
    },
        ()=>{ //suppose return null then will show this
            console.log("Dor's method: firebase failed")
    })
}

//from Max's example
export function finishTransaction(pid: number, quantity: number, onApiPutCartItem: (isSuccess: boolean) => void,
                                  setShowRemindAddToCart: (isLogout: boolean) => void) {
    let idToken: string = "";

    firebaseAuthServiceGetAccessToken() // 1 promise: getAccessToken
        ?.then((token) => {
            idToken = token;
            console.log("max's method: firebase success")
            return axios.patch(`${getEnvConfig().baseUrl}/cart/${pid}/${quantity}`,
                undefined, //patch method needs a body, but we don't have, that's why we need to put undefined
                {
                    headers: {Authorization: 'Bearer ' + token}
                })
        }).catch((error) => { //I think this is for axios, not firebase error
        console.log("max's method: firebase failed")
        console.log(error);
    })
}


/*
export function putCartItem (pid:number, quantity:number, onApiPutCartItem:(isSuccess:boolean)=>void,
                             setShowRemindAddToCart:(isLogin:boolean)=>void) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token:string) => { //if can get firebase token
            return axios.put(`${getEnvConfig().baseUrl}/cart/add-item/${pid}/${quantity}`,
                undefined,
                {headers:{Authorization:'Bearer ' + token}})
        }).catch(() => { //if can't get firebase token
            console.log("firebase token failed")
            setShowRemindAddToCart(true);
    }).then(() => {
        console.log("called API successfully")
            onApiPutCartItem(true);
        }).catch((error) => {
            console.log("onApiPutCartItem false")
            onApiPutCartItem(false);
    })
}

 */