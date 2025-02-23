import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const LikeButton = ({ item }) => {
    const {store, actions} = useContext(Context)
    const isLiked = store.favourites.some(fav => fav.uid === item.uid)

    return (
        <button onClick={() => actions.setFavourites(item)} className="btn btn-black border border-warning me-1">
            <i className={`${isLiked ? "fa-solid fa-heart-circle-plus text-warning" : "far fa-heart text-warning" } `}></i>
        </button>


    );

};