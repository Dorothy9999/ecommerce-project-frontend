import React, {useEffect, useState} from 'react';
import './styles.css'
import {Button, Card, CardGroup, Col, Container, ListGroup, Row, Table, Toast} from "react-bootstrap";
import * as https from "https";
import NavbarTop from "../../component/NavbarTop";
import Selector from "../../component/Selector";
import {ProductDetailsData} from "../../../data/ProductData";
import MockData from './propduct_details_response.json'
import LoadingSpinner from "../../component/LoadingSpinner";
import {Navigate, useNavigate, useParams} from 'react-router-dom'
import {getProductDetailsData} from "../../../resource/ProductResource";
import {finishTransaction, putCartItem} from "../../../resource/CartItemResource";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type Params = {
    productId: string
}

export default function ProductDetails() {
    const params = useParams<Params>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(1);

    let setQuantityPlusOne = () => {
        if (quantity < productDetailsData!.stock) {
            //why don't need to check if productDetailData is undefined? becoz below checked already
            //so here can forcefully put !, and it's safe
            setQuantity(quantity + 1);
        }
    }

    let setQuantityMinusOne = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const [productDetailsData, setProductDetailsData] = useState<ProductDetailsData | undefined | null>(undefined)

    useEffect(() => {
        //params can be undefined,need to check first
        if (params.productId) {
            getProductDetailsData(params.productId,loadProductDetailsData);
        } else {
            navigate ("/404");
        }
    },[])

    let loadProductDetailsData = (data: ProductDetailsData|null) => {
        setProductDetailsData(data);
    }

    const [show, setShow] = useState(false); //for toast
    const [showRemindAddToCart, setShowRemindAddToCart] = useState(false); //show when user is login

    const onApiPutCartItem = (isSuccess: boolean) => {
        if(isSuccess){
            setShow(true);
        }
    }

    return (
        <>
            <NavbarTop/>
            { (productDetailsData)?
            <Container>
                <Row>
                    <Col id={"img-col"}>
                        <Card.Img id={"card-img"} variant="top" src={productDetailsData?.image_url}/>
                    </Col>
                    <Col>
                        <Card.Body>
                            <Card.Title>{productDetailsData?.name}</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Price</ListGroup.Item>
                                <ListGroup.Item>${productDetailsData?.price}</ListGroup.Item>
                                <ListGroup.Item>Available Stock:</ListGroup.Item>
                                <ListGroup.Item>{productDetailsData?.stock}</ListGroup.Item>
                                <ListGroup.Item>Description</ListGroup.Item>
                                <ListGroup.Item>{productDetailsData?.description}</ListGroup.Item>
                                {
                                    (productDetailsData?.stock > 0)?
                                        <>
                                        <Selector quantity={quantity}
                                                  setQuantityMinusOne={setQuantityMinusOne}
                                                  setQuantityPlusOne={setQuantityPlusOne}/>
                                        <Card.Text>
                                            <Button variant="primary" onClick={ ()=>{
                                                console.log("triggered onClick")
                                                putCartItem(productDetailsData.pid, quantity, onApiPutCartItem, setShowRemindAddToCart);
                                                finishTransaction(productDetailsData.pid, quantity, onApiPutCartItem, setShowRemindAddToCart)
                                            }
                                            }>
                                                <FontAwesomeIcon icon={solid('cart-shopping')}/>
                                                Add to cart
                                            </Button>
                                        </Card.Text>
                                        </>
                                        :
                                        <Button variant="primary" disabled>
                                            Out of stock
                                        </Button>
                                }
                            </ListGroup>
                        </Card.Body>
                    </Col>
                </Row>
            </Container>
                 : (productDetailsData === null)
            ? <Navigate to="/404" replace />
            : <LoadingSpinner/> }

            <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide
                   style={{position:"absolute", right:24, bottom:24}}
            >
                <Toast.Header>
                    <strong className="me-auto">Succeeded!</strong>
                </Toast.Header>
                <Toast.Body>Woohoo! You have added 1 {productDetailsData?.name} to cart
                    </Toast.Body>
            </Toast>
            <Toast onClose={() => setShowRemindAddToCart(false)} show={true} delay={5000} autohide
                   style={{position:"absolute", right:24, bottom:24}}
            >
                <Toast.Header>
                    <strong className="me-auto">Sorry!</strong>
                </Toast.Header>
                <Toast.Body>
                    Please log in first before adding item to cart!
                </Toast.Body>
            </Toast>
        </>
    )
}
// <FontAwesomeIcon icon={solid('face-smile-hearts')}/>