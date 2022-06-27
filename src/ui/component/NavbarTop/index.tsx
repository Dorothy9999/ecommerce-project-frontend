import {Button, Container, Nav, Navbar, NavDropdown, Spinner} from "react-bootstrap";
import loginIcon from './user.png'
import {Link} from "react-router-dom";
import shoppingCartImg from './shopping-cart.png'
import logo from './logo.png'
import './styles.css'
import {useEffect, useState} from "react";
import {UserData} from "../../../data/UserData";
import {firebaseAuthServiceOnAuthStateChanged, firebaseAuthServiceSignOut} from "../../../service/AuthService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import CartPage from "../../page/CartPage";

export default function NavbarTop() {
    //因為這是side effect所以要放入useEffect入面
    const [currentUser, setCurrentUser] = useState<UserData | null | undefined>(undefined);

    const onLoadedCurrentUser = (currentUser: UserData | null) => {
        setCurrentUser(currentUser);
    }

    const userSignout = () => {
        firebaseAuthServiceSignOut();
    }

    useEffect(() => {
        firebaseAuthServiceOnAuthStateChanged(onLoadedCurrentUser);
    }, [])

    let onLoginSuccess = () => {
        if (currentUser) {
            return (
                <>
                    <p>{currentUser.email}</p>
                    <Link to={"/login"}>
                        <Button variant="outline-primary" onClick={() => {
                            userSignout();
                        }}>Logout<FontAwesomeIcon icon={solid('right-to-bracket')}/></Button>
                    </Link>
                </>
            )
        } else if (currentUser === undefined) {
            return <Spinner animation="border" variant="primary"/>
        } else {
            return (
                <>
                    <Link to={"/login"}><Button variant="outline-primary">
                        <FontAwesomeIcon icon={solid('right-to-bracket')}/>
                        Login </Button>
                    </Link>
                </>
            )
        }
    }
    ///////OffCanvas/////////////
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }
    ///////OffCanvas//////////////

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
            <CartPage show={show} handleClose={handleClose}/>
            <Container>
                <img className={"logo"} src={logo}/>
                <Link to={"/"}><Navbar.Brand>Jujutsu Kaisen Figureines</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav id={"login-nav"}>
                        {onLoginSuccess()}
                        <Button variant={"primary"} onClick={handleShow} className={"shopping-cart"}>
                            <FontAwesomeIcon icon={solid('cart-shopping')}/>
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}