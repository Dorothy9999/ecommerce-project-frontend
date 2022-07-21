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
    //when you use this set, it only senses value changes, but not order, that's why when you use this set in soring, it doesn't change

    let setProductListingPageData = (data: ProductListingItemData[]) => {
        setProductListItem(data);
    }

    useEffect(() => {
        getProductListingItems(setProductListingPageData);
    }, [])

    const [priceSortedList, setPriceSortedList] = useState<ProductListingItemData[] | undefined | null>(undefined)
    const [nameSortedList, setNameSortedList] = useState<ProductListingItemData[] | undefined | null>(undefined)

    let handleSelect = (evetKey:string|null) => {
        if (evetKey === "price-ascending") {
            setPriceSortedList(
                productListItem?.sort((a, b) => a.price-b.price)
                //sort() returns the reference of the original array and change the original list
                //this is putting productListItem's reference to priceSortedList
                //now the state has changes(undefined to a new reference), will trigger component rendering, not just the state rendering
            )
            setNameSortedList(undefined);
            // why need to set undefined?
            // becoz the sorted values are the same, it won't trigger rendering.To ensure other list is undefined before it's sorted

        } else if (evetKey === "productName-ascending") {

            setNameSortedList(
                productListItem?.sort((a, b) => a.name > b.name ? 1:-1)
            )
            setPriceSortedList(undefined)
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
                            // console.log("onSelect: " +evetKey);
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
                                <Card.Img className={"product-img"} variant="top" src={value.image_url}/>
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