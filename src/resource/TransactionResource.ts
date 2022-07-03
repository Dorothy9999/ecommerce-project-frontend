import axios, {AxiosResponse} from "axios";
import {firebaseAuthServiceGetAccessToken} from "../service/AuthService";
import {TransactionDetailsData} from "../data/TransactionData";
import getEnvConfig from "../Config/Config";

export function createTransactionfromResource(handleCheckoutOnCLick: (tid: number | null) => void) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token: string) => {
                return axios.post(`${getEnvConfig().baseUrl}/transaction/prepare`, undefined, {
                    headers: {Authorization: 'Bearer ' + token}
                })
            }
        ).then((response: AxiosResponse<TransactionDetailsData>) => {
        handleCheckoutOnCLick(response.data.tid); //can't set return type as number!! Promise不可return
    }).catch(() => {
        handleCheckoutOnCLick(null)
    })
}

export function getTransactionDetailsByTidfromResource
(onLoadTransactionDetailsData: (data: TransactionDetailsData | null) => void, tid?: string) {
    firebaseAuthServiceGetAccessToken()
        ?.then((token: string) => {
                return axios.get(`${getEnvConfig().baseUrl}/transaction/${tid}`, {
                    headers: {Authorization: 'Bearer ' + token}
                })
            }
        ).then((response: AxiosResponse<TransactionDetailsData>) => {
            onLoadTransactionDetailsData(response.data);
    }).catch(() => {
            onLoadTransactionDetailsData(null);
    })
}

export function updateStatusToProccessingAndSuccess(onApiFinishTransaction:(isSuccess: boolean) => void, tid?: string) {
    let idToken: string = "";

    firebaseAuthServiceGetAccessToken()
        ?.then((token: string) => { //if firebase success
            idToken = token;
            return axios.patch(`${getEnvConfig().baseUrl}/transaction/${tid}/pay`, undefined, {
                headers: {Authorization: 'Bearer ' + idToken}
            })
        }).catch(()=>{ //if firebase error
             onApiFinishTransaction(false);
    }).then(() => {  //if pay success
            return axios.patch(`${getEnvConfig().baseUrl}/transaction/${tid}/finish`, undefined, {
            headers: {Authorization: 'Bearer ' + idToken}
        }).catch (()=>{ //if pay failed
                onApiFinishTransaction(false);
            })
    }).then(()=>{ //if finish API success
        onApiFinishTransaction(true);
    }).catch(()=>{ //if finish API fail
        onApiFinishTransaction(false);
    })
}