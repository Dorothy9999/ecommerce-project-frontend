import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import './styles.css'
import MockData from './response.json';
import {ProductListingItemData} from "../../../data/ProductData";
import NavbarTop from "../../component/NavbarTop";
import {Link} from "react-router-dom";
import {getProductListingItems} from "../../../resource/ProductResource";
import TopBanner from "../../component/TopBanner";
import {SelectCallback} from "@restart/ui/types";


export default function ProductListing() {
    const [productListItem, setProductListItem] = useState<ProductListingItemData[] | undefined>(undefined)

    let setProductListingPageData = (data: ProductListingItemData[]) => {
        setProductListItem(data);
    }

    useEffect(() => {
        getProductListingItems(setProductListingPageData);
    }, [])

    const [priceSortedList, setPriceSortedList] = useState<ProductListingItemData[] | undefined>(undefined)

    let handleSelect = (evetKey:string|null) => {
        if (evetKey === "price-ascending") {
            let priceSortedListVariable:ProductListingItemData[]|undefined;
            priceSortedListVariable = productListItem?.sort((a, b) => a.price-b.price);
            setPriceSortedList(
                priceSortedListVariable
            )
            //why I didn't use priceSortedList this variable but it can update?
        } else if (evetKey === "productName-ascending") {
            let nameSortedListVariable:ProductListingItemData[]|undefined;
            nameSortedListVariable = productListItem?.sort((a, b) => a.name > b.name ? 1:-1)
            setPriceSortedList(
                nameSortedListVariable
            )
        }
    }

    return (
        <>
            <NavbarTop/>
            <Container>
                <TopBanner/>
                <Row>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title="Sort By" onSelect={ (evetKey)=>{
                            console.log("onSelect: " +evetKey);
                            handleSelect(evetKey);
                        }}>
                            <Dropdown.Item eventKey="price-ascending">Price (Ascending)</Dropdown.Item>
                            <Dropdown.Item eventKey="productName-ascending">Product name (Ascending)</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <Row xs={1} md={2} lg={3} className="products-list">{
                    productListItem?.map((value) => (
                        <Col key={value.pid}>
                            <Card>
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
            </Container>
        </>
    )
}