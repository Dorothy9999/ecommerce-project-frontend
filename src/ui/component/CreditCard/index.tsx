import { Form } from "react-bootstrap";
import './styles.css'

export default function CreditCard () {
    return (
        <div className={"credit-card-container"}>
            <Form.Group controlId="card-number" className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="card-name" className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="card-data" className="mb-3">
                <Form.Label>Valid Thru</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="card-cv" className="mb-3">
                <Form.Label>CVC</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
        </div>
    )
}