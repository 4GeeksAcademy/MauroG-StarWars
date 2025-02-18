import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container-fluid text-center mt-5 ">
			<img src="https://starwars.chocobar.net/star-wars-back0.jpg" alt="" />
		</div>
	);
};
