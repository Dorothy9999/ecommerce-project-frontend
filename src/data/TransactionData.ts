export type TransactionDetailsData = {
    tid:       number;
    datetime:  string;
    status:    string;
    items:     Item[];
    buyer_uid: number;
    total:     number;
}

export type Item = {
    tpid:     number;
    product:  ProductDetailsData; //same as ProductDetailsData in another file, can link tgt?
    quantity: number;
    subtotal: number;
}

export type ProductDetailsData = {
    pid:         number;
    name:        string;
    description: string;
    price:       number;
    stock:       number;
    image_url:   string;
}