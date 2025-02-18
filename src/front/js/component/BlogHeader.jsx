import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const BlogHeader = () => {
    const { store } = useContext(Context);



    return (
        <div className="text-center py-5 bg-black border-bottom border-warning">
            <h1 className="display-4 text-warning fw-bold mb-3">
                STAR WARS {store.section.toUpperCase()} CATALOG
            </h1>
            <p className="lead text-light opacity-75 fs-2">
                Imperial Galactic Database
            </p>
        </div>
    );
}       