import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-profile")
  }

  return (
    <div className="d-flex justify-content-center p-4">
      <ul className="col-10 list-group">
         <li key={store.user.id} className="list-group-item">
            <div className="card mb-3" >
              <div className="row">
                <div className="col-md-4 d-flex justify-content-center ">
                  <img src={`https://randomuser.me/api/portraits/men/${store.user.id}.jpg`} className="img-fluid rounded" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body ">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{store.user.first_name} {store.user.last_name}</h5>
                      <div>
                        <button onClick={() => handleEdit(store.user)} className="btn btn-warning me-2" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit Contact">
                          <i className='fa fa-pencil'></i></button>
                        <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-bs-placement="bottom" title="Delete Contact">
                          <i className='fas fa-trash-alt'></i></button>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div >{ store.user.is_admin ? "Es Administrador" : "No es Admin" }</div>
                    </div>
                    <div className="d-flex">
                      <div >{ store.user.is_active ? "Esta Activo" : "No esta Activo" }</div>
                    </div>
                    <div className="d-flex">
                      <i className="fas fa-envelope"></i>
                      <p className="card-text ms-5">{store.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
      </ul>
    </div>
  )
};
