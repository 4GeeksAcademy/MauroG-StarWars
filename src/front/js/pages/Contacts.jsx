import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { ModalDelete } from "../component/Modal.jsx";

export const ContactsList = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();

    const handleAddContact = (contact) => {
        actions.setContact(contact);
        navigate('/addcontact')
    };
    const handleEdit = (contact) => {
        actions.setContact(contact);
        navigate('/editcontact')
    };
    const handleDelete = async (id) => {

        const response = await actions.deleteContact(id);
        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText)
            return;
        };
        actions.getUserAgenda();
        navigate('/contacts')
    };

    return (

        <div className="container">
            <div className="container bg-secondary justify-content-center text-center mt-4 rounded p-3">
                <div className="d-flex justify-content-between">
                    <h1 className="text-light">Agenda Contact List</h1>
                    <button onClick={handleAddContact} className="btn-sm btn-primary" type="button">Add New Contact
                    <i className='fa fa-user-plus ms-2 text-black'></i></button>
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
                                                        <button onClick={() => handleEdit(contact)} className="btn btn-warning me-2" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit Contact">
                                                            <i className='fa fa-pencil'></i></button>
                                                        <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-placement="bottom" title="Delete Contact">
                                                            <i className='fas fa-trash-alt'></i></button>
                                                        <ModalDelete contactId={contact.id} handleDelete={handleDelete} title={'Are You Sure?'} body={'If you delete this contact, you wont be able to recover it later.'} />
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