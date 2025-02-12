import React, { useContext } from "react";
import { Context } from "../store/appContext.js";

export const ModalDelete = ({ contactId, title, body}) => {
    const {actions} = useContext(Context)
    const handleDelete = async (id) => {
        const response = await actions.deleteContact(id);
        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText)
            return;
        };
        actions.getUserAgenda();
    };
    
    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button onClick={() => handleDelete(contactId)} type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};