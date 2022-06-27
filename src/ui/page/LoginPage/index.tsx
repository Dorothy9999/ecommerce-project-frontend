import {Button, Col, Container, Form, Row} from "react-bootstrap";
import './styles.css';
import NavbarTop from "../../component/NavbarTop";
import React, {ChangeEvent, FormEvent, FormEventHandler, useEffect, useState} from "react";
import {
    firebaseAuthServiceSignInWithEmailAndPassword,
    firebaseAuthServiceSignInWithGoogle
} from "../../../service/AuthService";
import {useNavigate} from "react-router-dom";
import {GoogleLoginButton} from "react-social-login-buttons";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    let navigate = useNavigate();

    let updateEmailValue = (event:ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    let updatePasswordValue = (event:ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    let onLoadedSignedIn = (isSuccess:boolean) => {
        if (isSuccess) {
            navigate(-1) //-1 means go back to the last page
        }
    }

    let handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        firebaseAuthServiceSignInWithEmailAndPassword(email, password, onLoadedSignedIn)
    }

    return (
        <div id={"body"}>
            <NavbarTop/>
            <Container className={"form-login"}>
                <Row>
                    <Col>
                        <Form onSubmit={(event:React.SyntheticEvent)=>{
                            handleSubmit(event);
                        }}>
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <h3>Welcome!</h3>
                                <h5>Explore Your Favourite Figurines</h5>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter email" value={email}
                                    onChange={(event:ChangeEvent<HTMLInputElement>)=>{
                                        updateEmailValue(event);
                                    }}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Password" value={password}
                                              onChange={(event:ChangeEvent<HTMLInputElement>)=> {
                                                  updatePasswordValue(event);
                                }}/>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                            <GoogleLoginButton onClick={() => {
                                firebaseAuthServiceSignInWithGoogle(onLoadedSignedIn);
                            }} />
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}