import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const AddContact = () => {
    const { store, actions } = useContext(Context)   
    const contact = store.currentContact;
    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [address, setAddress] = useState(contact.address);
    const [email, setEmail] = useState(contact.email);
    const isForm = store.addOrEdit;

    const handleEditSubmit = (event) => {

        event.preventDefault();
        const contactEdited = {
            name,
            phone,
            address,
            email,
            id: store.currentContact.id
        }
        actions.setContact(contactEdited);
        actions.updateContact()
    }


    return (
        <div className={`container mt-4 bg-${(isForm) ? store.background : 'light'} text-center rounded`}>
            <h1 className="p-2">{(isForm) ? (store.formAddContactTitle) :( store.formEditConctacTitle)}</h1>
            <form onSubmit={handleEditSubmit}>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Full Name '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={(event) => setName(event.target.value)} type="text" className="form-control" value={name} placeholder="Enter Full Name" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Email '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={event => setEmail(event.target.value)} type="text" className="form-control" value={email} placeholder="Enter Email" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Phone '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={event => setPhone(event.target.phone)} type="text" className="form-control" value={phone} placeholder="Enter Phone" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className="form-label">{'Address '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={event => setAddress(event.target.address)} type="text" className="form-control" value={address} placeholder="Enter Address" />
                </div>
                <div className="d-grid gap-2 rounded ">
                    <button type="submit" className="btn btn-primary">save</button>
                </div>
                <div className="d-flex align-content-start">
                    <Link to="/contacts" className="link-primary">or get back to contacts</Link>
                </div>
            </form>            
        </div>
    );
};