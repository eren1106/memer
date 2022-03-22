import React, { useReducer, createContext, useEffect } from "react";

const reducer = (currentState, action) =>{
    switch(action.type){
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            };
        case "LOGIN_FAIL":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            };

        case "RELOADING":
            return{
                user: currentState.user,
                isFetching: true,
                error: false
            }
        case "RELOAD_SUCCESS":
            return{
                user: action.payload,
                isFetching: false,
                error: false
            }
        
        case "LOGOUT":
            return {
                ...currentState,
                user: null
            }
        default:
            return currentState;
    }
}

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false
};

export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({children}) =>{
    const [currentState, dispatch] = useReducer(reducer, initialState);

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentState.user))
      },[currentState.user]);
      
    return (
        <AuthContext.Provider
            value={
                {
                    user: currentState.user,
                    isFetching: currentState.isFetching,
                    error: currentState.error,
                    dispatch
                }
            }>
            {children}
        </AuthContext.Provider>
    )
}
