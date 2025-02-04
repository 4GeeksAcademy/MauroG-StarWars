import React, { useEffect, useState } from "react";

export const ContactsList = () => {
    const [userAgenda, setUserAgenda] = useState([])

    const url = 'https://playground.4geeks.com/contact'
    const user = 'MauroG'

    const getUserAgenda = async () => {
        const uri = `${url}/agendas/${user}/contacts`
        const options = {
            method: 'GET'
        }
        const response = await fetch(uri, options)

        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText)
            return;
        }
        const data = await response.json()
        console.log(data);

        setUserAgenda(data.contacts)

    };

    const postNewContactInAgenda = async () => {
        const uri = `${url}/agendas/${user}/contacts`
        const bodyRequest = {
            "name": "exampleName",
            "phone": "examplePhone",
            "email": "exampleEmail",
            "address": "exampleAddress"
          }
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bodyRequest)
        }
        const response = await fetch(uri , options)

        if(!response.ok){
            console.log('Error: ', response.status, response.statusText);
            return;
        }
        
        getUserAgenda()

    };

    useEffect(() => {
        getUserAgenda()
    }, [])


    return (

        <div className="container bg-dark p-3">
            <div className="d-flex justify-content-center mb-3">
                <h1 className="text-warning">Agenda Contact List</h1>
            </div>
            <div className="d-flex justify-content-center mb-4">
                <ul className="col-10 list-group">{
                    userAgenda.map((contact) => <li key={contact.id} className="list-group-item">
                    <div className="card mb-3" >
                        <div className="row g-0">
                            <div className="col-md-4 d-flex justify-content-center ">
                                <img src={`https://randomuser.me/api/portraits/men/${contact.id}.jpg`} className="img-fluid rounded" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{contact.name}</h5>
                                    <p className="card-text">{contact.phone}</p>
                                    <p className="card-text">{contact.address}</p>
                                    <p className="card-text">{contact.email}</p>                                     
                                </div>
                            </div>
                        </div>
                    </div>
                </li> )
                }
                </ul>
            </div>
        </div>

    );

};