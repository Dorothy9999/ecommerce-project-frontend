import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row} from "react-bootstrap";
import './styles.css'
import MockData from './response.json';
import {ProductListingItemData} from "../../../data/ProductData";
import NavbarTop from "../../component/NavbarTop";
import {Link} from "react-router-dom";
import {getProductListingItems} from "../../../resource/ProductResource";

export default function ProductListing() {
    const [productListItem, setProductListItem] = useState<ProductListingItemData[] | undefined>(undefined)

    let setProductListingPageData = (data: ProductListingItemData[]) => {
        setProductListItem(data);
    }

    useEffect(() => {
        getProductListingItems(setProductListingPageData);
    }, [])

    return (
        <>
            <NavbarTop/>
            <Row xs={1} md={2} lg={3} className="products-list">{
                productListItem?.map((value) => (
                    <Col key={value.pid}>
                        <Card >
                            <Card.Img variant="top" src={value.image_url}/>
                            <Card.Body>
                                <Card.Title>{value.name}</Card.Title>
                                <Card.Text>
                                    Price: ${value.price}
                                </Card.Text>
                                <Link to={`/product/${value.pid}`}>
                                    <Button variant="outline-primary">Details</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>

                ))}
            </Row>
        </>
    )
}