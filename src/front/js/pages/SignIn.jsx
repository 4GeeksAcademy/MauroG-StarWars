import React from "react";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
    const navigate = useNavigate();

    const handleSignIn = (event) => {
        event.preventDefault();
        
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form className="p-4 bg-light rounded shadow" onSubmit={handleSignIn}>
                <h2 className="text-center mb-4">Sign In</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" required />
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
