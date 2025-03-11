import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault()
        const dataToSend = {email, password}
        console.log(dataToSend);
        
        
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form className="p-4 bg-light rounded shadow" onSubmit={handleLogin}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                <div className="text-center mt-3">
                    <span>No tienes cuenta? </span>
                    <a onClick={() => navigate("/signin")} href="#">Sign In</a>
                </div>
            </form>
        </div>
    );
};
