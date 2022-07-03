import NavbarTop from "../../component/NavbarTop";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TransactionDetailsData} from "../../../data/TransactionData";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import "./styles.css";
import {getTransactionDetailsByTidfromResource} from "../../../resource/TransactionResource";

type Params = {
    transactionId: string
}

export default function ThankYou() {
    const navigate = useNavigate();
    // const [count, setCount] = useState<number>(10);

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (count > 1) {
    //             setCount(count - 1)
    //         } else {
    //             navigate("/")
    //         }
    //     }, 1000)
    // })

    ///////load product details to page
    const [transactionDetailsData, setTransactionDetailsData] = useState<TransactionDetailsData | undefined>(undefined);
    const params = useParams<Params>();

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
    //////////////

    return (
        <>
            <NavbarTop/>
            <Container>
                <Row>
                    <h2>Thank you for your purchase! </h2>
                </Row>
                <Row>
                    <h4>Your order details: </h4>
                </Row>
            </Container>
            {
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
                                                <Col xs sm={6} md lg={4}>Product #{index+1}</Col>
                                            </Row>
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
            }
        </>
    )
}