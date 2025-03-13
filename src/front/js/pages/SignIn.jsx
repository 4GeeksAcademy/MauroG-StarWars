import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const SignIn = () => {
    
    const { actions } = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [viewPassword, setViewPassword] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('') 

    const handleEmail= (event) => {setEmail(event.target.value)}
    const handleName= (event) => {setFirstName(event.target.value)}
    const handleLastName= (event) => {setLastName(event.target.value)}
    
    const handlePassword= (event) => {setPassword(event.target.value)}
    
    const handleViewPassword= () => {setViewPassword(!viewPassword)}

    const navigate = useNavigate();
    
    const handleSignIn = (event) => {
        event.preventDefault();
    };

    const handleRegister = (event) => {
        event.preventDefault();
        const dataToSend = {first_name: firstName, last_name: lastName, email, password}
        actions.register(dataToSend);
        navigate('/');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form className="p-4 bg-light rounded shadow" onSubmit={handleRegister}>
                <h2 className="text-center mb-4">Sign In</h2>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input onChange={handleName} type="text" className="form-control" id="firstName" />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input onChange={handleLastName} type="text" className="form-control" id="lastName" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input onChange={handleEmail} type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={handlePassword} type="password" className="form-control" id="password" required />
                </div>
                <button type="submit" className="btn btn-success w-100">Sign In</button>
                <div className="text-center mt-3">
                    <span>Ya tienes cuenta? </span>
                    <a href="#" onClick={() => navigate("/login")}>Login</a>
                </div>
            </form>
        </div>
    );
};
