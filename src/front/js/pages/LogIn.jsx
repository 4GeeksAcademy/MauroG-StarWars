import React, { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useContext, useState } from "react";

export const Login = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [viewPassword, setViewPassword] = useState(false)

    const handleEmail= (event) => {setEmail(event.target.value)}

    const handlePassword= (event) => {setPassword(event.target.value)}

    const handleViewPassword= () => {setViewPassword(!viewPassword)}  /// seteamos asi el view "!viewPassword" por que es lo contrario al default value = viewPassword

    const handleLogin = (event) => {
        event.preventDefault();
        const dataToSend = {email, password}
        console.log(dataToSend);
        actions.login(dataToSend);
        navigate('/');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form className="p-4 bg-light rounded shadow" onSubmit={handleLogin}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input onChange={handleEmail} value={email} type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <span className="input-group-text" onClick={handleViewPassword}>
                        { viewPassword ? 
                        <i className="fa fa-eye-slash"></i>
                        :
                        <i className="fa fa-eye"></i>
                        }
                    </span>
                    <input onChange={handlePassword} value={password} type={viewPassword ? "text" : "password"} className="form-control" id="password" required />
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
