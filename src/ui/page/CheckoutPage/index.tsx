import './styles.css'
import {Button, Card, CardGroup, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import NavbarTop from "../../component/NavbarTop";
import CreditCard from "../../component/CreditCard";
import mockData from './response.json'
import {SyntheticEvent, useEffect, useState} from "react";
import {TransactionDetailsData} from "../../../data/TransactionData";
import {useNavigate, useParams} from "react-router-dom";
import {
    getTransactionDetailsByTidfromResource,
    updateStatusToProccessingAndSuccess
} from "../../../resource/TransactionResource";
import LoadingSpinner from "../../component/LoadingSpinner";
import ThankYou from "../ThankYou";

type Params = {
    transactionId: string
}

export default function CheckoutPage() {
    const [transactionDetailsData, setTransactionDetailsData] = useState<TransactionDetailsData | undefined>(undefined);
    const params = useParams<Params>();
    const navigate = useNavigate();

    ///load checkout data to the page:
    useEffect(() => {
        getTransactionDetailsByTidfromResource(onLoadTransactionDetailsData, params.transactionId);
    }, [])

    let onLoadTransactionDetailsData = (data:TransactionDetailsData|null) => {
        if (data) {
            setTransactionDetailsData(data);
        } else if (data === null) {
            navigate (`/404`);
        } else {
            return (
                <Spinner animation="border" variant="primary" />
            )
        }
    }
    ///load checkout data to the page

    let calTotalPrice = (): number => {
        let totalPrice: number = 0;
        if (transactionDetailsData) {
            for (let item of transactionDetailsData.items) {
                totalPrice += item.subtotal;
            }
        }
        return totalPrice;
    }

    ////update status to finish
    let onApiFinishTransaction = (isSuccess: boolean) => {
        if (isSuccess) {
            navigate(`/thankyou/${params.transactionId}`)
        } else if (isSuccess === null) {
            navigate('/404')
        }
    }

    let handleSubmit = (event:SyntheticEvent) => {
        event.preventDefault();
        updateStatusToProccessingAndSuccess(onApiFinishTransaction, params.transactionId)
    }
    ////update status to finish

    return (
        <>
            <NavbarTop/>
            <Container>
                <Row>
                    <h3>Confirm your order:</h3>
                </Row>
            </Container>
            {
                (transactionDetailsData) ?
                transactionDetailsData?.items.map((value, index) => {
                    return (
                        <Container key={value.product.pid}>
                            <Row className={"pic-spec-row"}>
                                <Col md={6}>
                                    <img id="product-pic" src={value.product.image_url}/>
                                </Col>
                                <Col md={6}>
                                    <Container className="spec-div-container">
                                        <Row>
                                            <Col xs sm={6} md lg={4}>Name</Col>
                                            <Col xs sm={6} md lg={7}>{value.product.name}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs sm={6} md lg={4}>Unit</Col>
                                            <Col xs sm={6} md lg={7}>{value.quantity}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs sm={6} md lg={4}>Unit Price</Col>
                                            <Col xs sm={6} md lg={7}>${value.product.price}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs sm={6} md lg={4}>Subtotal</Col>
                                            <Col xs sm={6} md lg={7}>${value.subtotal}</Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    )
                })
                : (transactionDetailsData === undefined) ?
                    <LoadingSpinner/>
                    : null //equals to <></> empty action
            }
            <Container>
                <Row>
                    <Col md lg={{span: 6, offset:6}} className={"total-bar"}>Total: ${calTotalPrice()}</Col>
                </Row>
            </Container>
            <Container>
                <Row>
            <Form id="payment-form" onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <h5>Credit Card Details: </h5>
                    <Form.Group as={Col} controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name"/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name"/>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formCreditCardNumber">
                    <Form.Label>Credit Card Number</Form.Label>
                    <Form.Control placeholder="xxxx xxxx xxxx xxxx"/>
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formExpiryDate">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control type="text" placeholder="MM/YY"/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formCVV">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control type="text" placeholder="000"/>
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
                </Row>
            </Container>
        </>
    )
}

/* 令到img可以置中在Row中
<Row className="align-items-center">
       <Col md={3}>
            <div className="item-image" style={{
                 height: "100px",
                 backgroundImage: `url("https://www.price.com.hk/space/product/385000/385039_97jxad_4.png")`,
                 backgroundSize: "contain",
                 backgroundRepeat: "no-repeat",
                 backgroundPosition: "center"
              }}></div>
        </Col>
<Col md={5}>
    <div className="item-name-price">
        <h3><p>name</p></h3>
        <h3><p>$50000</p></h3>
    </div>
</Col>
*/