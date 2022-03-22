import { useRef, useContext, useState } from 'react';
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import {CircularProgress} from "@material-ui/core";

const Login = () => {
    const email = useRef();
    const password = useRef();

    const {isFetching, dispatch} = useContext(AuthContext);
    const [invalid, setInvalid] = useState(false);

    const navigate = useNavigate();

    const login = async (e)=>{
        e.preventDefault();
        dispatch({type: "LOGIN_START"});
        const user = {
            email: email.current.value,
            password: password.current.value
        }
        
        try{
            const res = await axios.post("http://localhost:3001/api/login", user);
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            navigate("/");
        }
        catch(err){
            dispatch({type: "LOGIN_FAIL", payload: err});
            setInvalid(true);
        }
    }

    const goSignUp =()=>{
        navigate("/signup");
    }

  return (
    <div className="login">
        <div className="login-wrapper">
            <div className="login-left">
                <h1 className="login-left-title">
                    MEMER
                </h1>
                <p className="login-left-paragraph">
                    Share memes with others!
                </p>
            </div>
            <div className="login-right">
                <form className="login-right-panel" onSubmit={login}>
                    <input className="login-input" placeholder='Email' type="email" required ref={email} />
                    <input className="login-input" placeholder='Password' type="password" required ref={password} />
                    { invalid && <p className="login-invalidText">Invalid email or password!</p>}
                    <button className="login-loginBtn" type="submit">
                        {isFetching ? <CircularProgress size="20px" /> : "Log In"}
                    </button>
                    <button className="login-signUpBtn" onClick={goSignUp}>Sign Up</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login;