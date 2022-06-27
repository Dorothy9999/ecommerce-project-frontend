// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged, //this is to check if the user is logged in. When a user successfully signs in, you can get information about the user in the observer.
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import {UserData} from "../data/UserData";
import {firebaseConfig} from "./FirebaseConfig";

export const firebaseAuthServiceInit = () => {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    // Initialize Firebase
    //intializeApp is from firebase library,it knows what project to link to
    initializeApp(firebaseConfig);
}

// https://firebase.google.com/docs/auth/web/start#sign_in_existing_users
export const firebaseAuthServiceSignInWithEmailAndPassword = (email: string, password: string, callback: (isSuccess: boolean) => void) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user)
            callback(true);
        }).catch((error) => {
        console.log(error);
        callback(false);
    });
}

// https://firebase.google.com/docs/auth/web/google-signin#before_you_begin
export const firebaseAuthServiceSignInWithGoogle = (callback: (isSuccess: boolean) => void) => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            callback(true);
        }).catch((error) => {
        // // Handle Errors here.
        callback(false);
    });
}

// https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
export const firebaseAuthServiceOnAuthStateChanged = (callback: (user: UserData | null) => void) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        let loginUser: UserData | null;
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            loginUser = {
                email: user.email || "Login User" //if it's true, then put user.email, otherwise assign "LoginUser"
            }
        } else {
            // User is signed out
            loginUser = null;
        }
        callback(loginUser);
    });
};

export const firebaseAuthServiceGetAccessToken = () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
        return null;
    }
    return currentUser.getIdToken(false);
    //this is returning a promise object
}

/* original code:
export const firebaseAuthServiceGetAccessToken = () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
        return null;
    }
    return currentUser.getIdToken(false);
    //this is returning a promise object
}

 */

export const firebaseAuthServiceSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
}