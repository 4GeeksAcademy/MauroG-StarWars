import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const ProfileForm = () => {
    const { store, actions } = useContext(Context);
    const user = store.user;
    const navigate = useNavigate();

    const [form, setForm] = useState(
        {
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            isAdmin: user.is_admin,
            isActive: user.is_active,
        })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name == "isAdmin" || name == "isActive" ? e.target.checked : value })
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const userId = store.user.id;
        await actions.editProfile(form, id)
        navigate("/user-profile")
        console.log("este es el form: ", form);
        console.log("este es el id: ", userId);
    };

    return (
        <div className="container mt-4 bg-light bg-opacity-25 text-center rounded">
            <h1 className="p-2">Edit Profile</h1>
            <form onSubmit={handleEditSubmit}>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'First Name '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="firstName" value={form.firstName} placeholder="Enter Name" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Last Name '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="text" className="form-control" name="lastName" value={form.lastName} placeholder="Enter Name" />
                </div>
                <div className="text-start mb-3 fs-5">
                    <label className=" form-label">{'Email '}
                        <span className="text-danger">*</span>
                    </label>
                    <input onChange={handleChange} type="email" className="form-control" name="email" value={form.email} placeholder="Enter Email" />
                </div>
                <div className="mb-3 form-check">
                    <input name="isAdmin" onChange={handleChange} type="checkbox" className="form-check-input" checked={form.isAdmin} />
                    <label className="form-check-label" htmlFor="exampleCheck1">Is Admin</label>
                </div>
                <div className="mb-3 form-check">
                    <input name="isActive" onChange={handleChange} type="checkbox" className="form-check-input" checked={form.isActive} />
                    <label className="form-check-label" htmlFor="exampleCheck1">Is Active</label>
                </div>
                <div className="d-grid gap-2 rounded mt-3 ">
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
                <div className="d-flex align-content-start">
                    <Link to="/user-profile" className="link-primary">or get back to your profile</Link>
                </div>
            </form>
        </div>
    );
};