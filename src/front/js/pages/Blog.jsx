import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { BlogHeader } from "../component/BlogHeader.jsx";
import { LikeButton } from "../component/LikeButton.jsx";

export const Blog = () => {
    const defaultImage = 'https://github.com/tbone849/star-wars-guide/blob/master/build/assets/img/placeholder.jpg?raw=true'
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleDetail = (id) => {
        actions.getDetailData(id);
        navigate("/detail")
    };

    return (
        <div className="container-fluid bg-dark min-vh-100 mt-5">
            <BlogHeader />
            <div className="container py-5">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {store[store.section].map((item) => (
                        <div key={item.uid} className="col">
                            <div className="card h-100 bg-black border-warning shadow-lg hover-shadow-lg">
                                <img className="" alt={""} src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${store.section}/${item.uid}.jpg`}
                                    onError={event => { event.target.onerror = null; event.target.src = defaultImage }} />
                                <div className="card-header border-warning">
                                    <h3 className="card-title text-warning text-center mb-0 text-uppercase">
                                        {item.name}
                                    </h3>
                                </div>
                                <div className="card-footer d-flex justify-content-between border-warning bg-black">
                                    <div>
                                        <span onClick={() => handleDetail(item.uid)} className="btn btn-secondary me-1">Details</span>
                                    </div>
                                    <div>
                                        <LikeButton item={item} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};