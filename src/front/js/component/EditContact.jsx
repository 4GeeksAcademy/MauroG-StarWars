import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditContact = () => {
    const { store, actions } = useContext(Context)
    const contact = store.currentContact;
    const navigate = useNavigate()

    const [form, setForm] = useState(
        {
            id: store.currentContact.id,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            address: contact.address
        })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    };
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        actions.setContact(form)
        // actions.updateContact(form)
        const resp = await actions.updateContact(form);
        if (!resp.ok) {
            console.log('Error: ', resp.status, resp.statusText)
            return;
        };
        actions.getUserAgenda()
        navigate("/contacts")

    };


    return (
        <div className="container mt-4 bg-light bg-opacity-25 text-center rounded">
            <h1 className="p-2">Edit Contact</h1>
            <form onSubmit={handleEditSubmit}>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Full Name '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="name" value={form.name} placeholder="Enter Name" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Email '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="email" className="form-control" name="email" value={form.email} placeholder="Enter Email" />
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
                    <div className="d-grid gap-2 rounded mt-3 ">
                    <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </div>
                <div className="d-flex align-content-start">
                    <Link to="/contacts" className="link-primary">or get back to contacts</Link>
                </div>
            </form>
        </div>
    );
};