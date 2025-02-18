import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { BlogHeader } from "../component/BlogHeader.jsx";

export const Detail = () => {
    const { store, actions } = useContext(Context)

    return (
        <div className="container-fluid bg-dark min-vh-100 mt-5">

            <BlogHeader />

            <div className="container d-flex py-5">
                <img className="me-4  img-fluid rounded border border-warning border-4" alt={""} src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${store.section}/${store.detailData.uid}.jpg`} />
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                    {Object.entries(store.detailData).map(([key, value]) => (
                        (key === "created" || key === "edited" || key === "url" || key === "uid" || key === "pilots" || key === "cost_in_credits" || key === "homeworld") ? " " : 
                        <div className="col">
                            <div className="card h-100 bg-black border-warning shadow-lg hover-shadow-lg">
                                <div className="card-header border-warning">
                                    <h3 className="card-title text-warning text-center mb-0 text-uppercase">
                                        {key} : {value}
                                    </h3>
                                </div>                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}