import './styles.css'
import {Button} from "react-bootstrap";

export type Props = {
    quantity : number,
    setQuantityMinusOne : () => void,
    setQuantityPlusOne: () => void
}

export default function Selector (props:Props) {

    return (
        <div className="selector">
            <Button className="selector-btn" variant="outline-danger" onClick={props.setQuantityMinusOne}>-</Button>
            <div>{props.quantity}</div>
            <Button className="selector-btn" variant="outline-success" onClick={props.setQuantityPlusOne}>+</Button>
        </div>
    );
}