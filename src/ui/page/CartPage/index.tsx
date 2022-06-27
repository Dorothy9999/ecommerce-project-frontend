import {Button, Card, Col, Container, ListGroup, Offcanvas, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import Selector from "../../component/Selector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import './styles.css'
import MockData from './response.json';
import {ShoppingCartData} from '../../../data/ShoppingCartData';
import {getCartItemList, patchCartItemQuantity, removeCartItem} from "../../../resource/CartItemResource";
import {Link, useNavigate} from "react-router-dom";
import {TransactionDetailsData} from "../../../data/TransactionData";
import {createTransactionfromResource} from "../../../resource/TransactionResource";
import LoadingSpinner from "../../component/LoadingSpinner";

export type Props = {
    show: boolean,
    handleClose: () => void
}

export default function CartPage(props: Props) {
    const [cartItemDataList, setCartItemDataList] = useState<ShoppingCartData[] | undefined | null>(undefined)

    useEffect(() => {
        if (cartItemDataList === undefined) {
            getCartItemList(setCartItemDataList);
        }
    }, [cartItemDataList])

    //////offcanvas entering
    let handleOnEnter = () => {
        setCartItemDataList(undefined);
    }

    //////Selector
    let quantityMinusOne = (pid: number, quantity: number) => {
        if (quantity > 1) {
            patchCartItemQuantity(pid, quantity - 1, onApiPatchCartItemQuantity)
        }
    }

    let quantityPlusOne = (pid: number, quantity: number, stock: number) => {
        if (quantity < stock) {
            patchCartItemQuantity(pid, quantity + 1, onApiPatchCartItemQuantity)
        }
    }

    let onApiPatchCartItemQuantity = (isSuccess: boolean, pid?: number, quantity?: number) => {
        if (isSuccess && cartItemDataList) {
            setCartItemDataList(cartItemDataList.map((value) => {
                if (value.pid === pid) {
                    value.cart_quantity = quantity!; //quantity有機會係undefined，所以比! 叫佢一定要做
                }
                return value;
            }))
        }
    }
    //////Selector

    let calTotalPrice = (): number => {
        let totalPrice: number = 0;
        if (cartItemDataList) {
            for (let item of cartItemDataList) {
                totalPrice += item.price * item.cart_quantity;
            }
        }
        return totalPrice;
    }

    let onApiRemoveCartItem = (isSuccess: boolean, pid: number) => {
        if (isSuccess && cartItemDataList) {
            setCartItemDataList(cartItemDataList.filter((value) => {
                return value.pid !== pid;
            }))
        }
    }

    ///create transaction:
    const navigate = useNavigate();
    let handleCheckoutOnCLick = (tid:number|null) => {
        if (tid) {
            console.log("show "+tid);
            navigate (`/checkout/${tid}`);
        } else if (tid === null) {
            console.log("null");
            navigate (`/404`);
        } else {
            return (
                <Spinner animation="border" variant="primary" />
            )
        }
    }
    ///create transaction

    return (
        <>
        <Offcanvas show={props.show} onHide={props.handleClose} placement={"end"}
                   onEntering={handleOnEnter}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart items</Offcanvas.Title>
            </Offcanvas.Header>
            <Row className={"total-price-row"}>
                <Col md={4}>Total</Col>
                <Col md={4}>${calTotalPrice()}</Col>
                <Col md={4}>
                    <Button variant={"success"} className={"checkout-btn"}
                            onClick={() => {
                                createTransactionfromResource(handleCheckoutOnCLick);
                            }}
                    >Checkout
                    </Button>
            </Col>
        </Row>
        <Offcanvas.Body>
            {cartItemDataList?.map((value, index) => {
                return (
                    <Card key={index}>
                        <Card.Img variant="top" src={value.image_url}/>
                        <Card.Title>{value.name}</Card.Title>
                        <Container>
                            <Row>
                                <Col>Unit</Col>
                                <Col>{value.cart_quantity}</Col>
                            </Row>
                            <Row>
                                <Col>Unit Price</Col>
                                <Col>${value.price}</Col>
                            </Row>
                            <Row>
                                <Selector
                                    quantity={value.cart_quantity}
                                    setQuantityMinusOne={() => {
                                        console.log("minusone")
                                        quantityMinusOne(value.pid, value.cart_quantity);
                                    }}
                                    setQuantityPlusOne={() => {
                                        quantityPlusOne(value.pid, value.cart_quantity, value.stock);
                                    }}
                                />
                            </Row>
                            <Row>
                                <Col>Subtotal</Col>
                                <Col>${value.price * value.cart_quantity}</Col>
                            </Row>
                            <Row className={"remove-item-row"}>
                                <Col>Delete from cart</Col>
                                <Col>
                                    <Button className={"remove-btn"} variant={"danger"} onClick={() => {
                                        removeCartItem(value.pid, onApiRemoveCartItem)
                                    }}>
                                        <FontAwesomeIcon icon={solid('trash-can')}/>
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                )
            })}
        </Offcanvas.Body>
        </Offcanvas>

</>
)
}