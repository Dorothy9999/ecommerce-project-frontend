import {Spinner} from "react-bootstrap";
import './styles.css'

export default function LoadingSpinner () {
    return (
        <div className={"loading-spinner-container"}>
            <Spinner animation="grow" />
        </div>

    )
}