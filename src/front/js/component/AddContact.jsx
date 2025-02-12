import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const AddContact = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [form, setForm] = useState(
        {
            name: "",
            phone: "",
            email: "",
            address: ""
        })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    };
    const handleAddSubmit = async (event) => {
        event.preventDefault();
        // actions.addContact(form);
        const resp = await actions.addContact(form);
        if (!resp.ok) {
            console.log('Error: ', resp.status, resp.statusText)
            return;
        };
        actions.getUserAgenda();
        navigate("/contacts")
    };


    return (
        <div className="container mt-4 bg-light bg-opacity-25 text-center rounded">
            <h1 className="p-2">New Contact</h1>
            <form onSubmit={handleAddSubmit}>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Full Name '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="name" value={form.name} placeholder="Enter Full Name" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Email '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="email" value={form.email} placeholder="Enter Email" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Phone '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="phone" value={form.phone} placeholder="Enter Phone" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className="form-label">{'Address '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="address" value={form.address} placeholder="Enter Address" />
                </div>
                <div className="d-grid gap-2 rounded mt-3 ">
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
                <div className="d-flex align-content-start">
                    <Link to="/contacts" className="link-primary">or get back to contacts</Link>
                </div>
            </form>
        </div>
    );
};