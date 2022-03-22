import { useRef } from 'react';
import "./signUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const navigate = useNavigate();
    
    const signUp = async(e)=>{
        e.preventDefault();
        if(password.current.value === confirmPassword.current.value){
            const newUser = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            }
            try{
                await axios.post("http://localhost:3001/api/signup", newUser);
                navigate("/login");
            }
            catch(err){
                console.log(err);
            }
        }
        else{
            password.current.setCustomValidity("Password dont match!");
        }
        
    }


    return (
        <div className="signUp">
            <div className="signUp-wrapper">
                <div className="signUp-left">
                    <h1 className="signUp-left-title">
                        MEMER
                    </h1>
                    <p className="signUp-left-paragraph">
                        Share memes with others!
                    </p>
                </div>
                <form className="signUp-right" onSubmit={signUp}>
                    <div className="signUp-right-panel">
                        <input className="signUp-input" placeholder='Username' ref={username} minLength="3" required></input>
                        <input className="signUp-input" placeholder='Email' type="email" ref={email} required></input>
                        <input className="signUp-input" placeholder='Password' type="password" ref={password} minLength="3" required></input>
                        <input className="signUp-input" placeholder='Confirm Password' type="password" ref={confirmPassword} required></input>
                        <button className="signUp-signUpBtn" type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;