import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const ContactsList = () => {
    const { store, actions } = useContext(Context);
               
    const navigate = useNavigate();

    const handleEdit = (contact) => {
        actions.setContact(contact),
        actions.setFormEditConctacTitle(),        
        navigate('/editcontact')
    };
    const handleAddContact = () =>{
        actions.setFormAddContactTitle(),
        navigate('/addcontact')
    };

    
    return (

        <div className="container">
            <div className="container bg-dark justify-content-center text-center mt-4 rounded p-3">
                <div className="d-flex justify-content-evenly">
                    <h1 className="text-warning">Agenda Contact List</h1>
                    <button onClick={handleAddContact} className="btn-sm btn-info" type="button">Add New Contact</button>
                </div>
                <div className="d-flex justify-content-center p-4">
                    <ul className="col-10 list-group">
                        {
                            store.contacts.map((contact) => <li key={contact.id} className="list-group-item">
                                <div className="card mb-3" >
                                    <div className="row">
                                        <div className="col-md-4 d-flex justify-content-center ">
                                            <img src={`https://randomuser.me/api/portraits/men/${contact.id}.jpg`} className="img-fluid rounded" alt="..." />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body ">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="card-title">{contact.name}</h5>                                                    
                                                    <div>
                                                        <button onClick={() => handleEdit(contact)} className="btn btn-success me-2" type="button">
                                                            <i className='fa fa-pencil'></i></button>
                                                        <button className="btn btn-danger" type="button">
                                                            <i className='fas fa-trash-alt'></i></button>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    <p className="card-text ms-5">{contact.address}</p>                                                    
                                                </div>
                                                <div className="d-flex mt-3 mb-3">
                                                    <i className="fas fa-phone-volume"></i>
                                                    <p className="card-text ms-5 ">{contact.phone}</p>
                                                </div>
                                                <div className="d-flex">
                                                    <i className="fas fa-envelope"></i>
                                                    <p className="card-text ms-5">{contact.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>)
                        }
                    </ul>
                </div>
            </div>
        </div>

    );

};