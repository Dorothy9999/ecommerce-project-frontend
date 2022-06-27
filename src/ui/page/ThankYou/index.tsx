import NavbarTop from "../../component/NavbarTop";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

type Params = {

}

export default function ThankYou () {
    const navigate = useNavigate();
    const [count, setCount] = useState<number>(5);

    useEffect(()=>{
        setTimeout(()=>{
            if (count > 1) {
                setCount(count-1)
            } else {
                navigate("/")
            }
        }, 1000)
    })

    return (
        <>
            <NavbarTop/>
            <h1>Thank you for your purchase! </h1>
            <h3>Go back to home page in {count} seconds</h3>
        </>
    )
}