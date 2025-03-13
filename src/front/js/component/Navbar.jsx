import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "/workspaces/MauroG-StarWars/src/front/styles/index.css"


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLog = () => {
		if (store.isLogged) {
			actions.logout()
		} else { navigate("/login") }
	};

	const handleClick = (section) => {
		actions.setSection(section);
		navigate(`/${section}`)
	};

	const handleDeleteFavourite = (itemFavourite, event) => {
		event.stopPropagation();
		actions.setFavourites(itemFavourite);
	};

	return (
		<nav className="container-fluid bg-black navbar navbar-dark ">
			<div className="container-fluid justify-content-between ">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img height="55" src="https://starwars.chocobar.net/star-wars-logo.png" />
					</span>
				</Link>
				<div className="d-flex">

					<span onClick={() => handleClick("planets")} className="btn btn-warning ms-1 me-1">Planets
						<i className='fa fa-globe ms-2'></i>
					</span>
					<span onClick={() => handleClick("starships")} className="btn btn-warning me-1">Starships
						<i className='fas fa-plane-departure ms-2'></i>
					</span>
					<span onClick={() => handleClick("characters")} className="btn btn-warning me-1">Characters
						<i className='fa-solid fa-person-walking-dashed-line-arrow-right ms-2'></i>
					</span>
					<div className="dropdown col-2 me-3">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Favourites
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								{store.favourites.length}
							</span>
						</button>
						<ul className="dropdown-menu dropdown-menu-dark">
							{store.favourites.map((item) =>
								<li key={item.uid} className="d-flex justify-content-between">
									<a className="dropdown-item" href="#">{item.name}</a>
									<button onClick={(event) => handleDeleteFavourite(item, event)} className="btn btn-danger" type="button" >
										<i className='fas fa-trash-alt'></i>
									</button>
								</li>
							)}
						</ul>
					</div>
					{store.isLogged ?
						(
							<div>
								<span onClick={handleLog} className="btn btn-primary me-1"> Logout</span>
								<span onClick={() => navigate("/user-profile")} className="btn btn-primary me-1"> UserProfile</span>
							</div>
						)
						:
						(
						<span onClick={() => navigate("/login")} className="btn btn-primary me-1"> Login</span>
					)
					}
					<Link to="/contacts">
						<span className="btn btn-black text-light">Contact List</span>
					</Link>
					
				</div>
			</div>
		</nav>
	);
};
