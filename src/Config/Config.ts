import DevConfig from "./DevConfig";
import ProdConfig from "./ProdConfig";

export default function getEnvConfig () {
    //this attribute is showing what env you are in
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        return DevConfig
    } else {
        return ProdConfig
    }
}