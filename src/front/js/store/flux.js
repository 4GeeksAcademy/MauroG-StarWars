const getState = ({ getStore, getActions, setStore }) => {
	const url = 'https://playground.4geeks.com/contact';
	const user = 'MauroG';
	const starWarsUrl = 'https://www.swapi.tech/api';


	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			contacts: [],
			currentContact: {},
			planets: [],
			characters: [],
			starships: [],
			detailData: {},
			section: "planets",
			favourites: [],
			user:{},
			isLogged: false,
			isAdmin: false,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			login : async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
                
                const options = {
                    method: 'POST',
                    headers: {"Content-Type": "Application/json"},
                    body: JSON.stringify(dataToSend)
                };
                const response = await fetch (uri, options)
                
                if(!response.ok) {
                    console.log('Error login:', response.status, response.statusText)
                    return
                }
                const data = await response.json();
                
                setStore({
                    user: data.results,
                    isAdmin: data.results.is_admin,
                    isLogged: true,
                    alert: {text: data.message, visible: true, background: 'success'},
                })
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('user', JSON.stringify(data.results))
                
			},
			
			logout: () => {
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				setStore({user: '',
						 isLogged: false,
						 isAdmin: false})
				
			},
			register: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/register`
				const options = {
					method:'POST',
					headers:{'Content-Type' : 'Application/json'},
					body: JSON.stringify(dataToSend)
				}
				const response = await fetch (uri, options)
				if(!response.ok){
					console.error('Algo salio mal', response.status, response.statusText)
					return
				}
				const data = await response.json()
				setStore({
					user: data.results,
                    isAdmin: data.results.is_admin,
                    isLogged: true})
				localStorage.setItem('token', data.access_token)
				localStorage.setItem('user', JSON.stringify(data.results))
			},
			editProfile:async (body) => {
				const uri = `${process.env.BACKEND_URL}/api/edit-profile`
				const token = localStorage.getItem('token');
				const options = {
					method: 'PUT',
					headers:{
						'Content-Type' : 'Application/json',
						'Authorization' : `Bearer ${token}`
					},
					body: JSON.stringify(body)
				};
				const response = await fetch(uri, options);
				if (!response.ok){
					console.error("Error update: ", response.status, response.statusText)
					return
				};
				const data = await response.json();
				setStore({
					user: data.results,
					id: data.results.id,
					firstName: data.results.first_name,
					lastName: data.results.last_name,
					email: data.results.email,
					isAdmin: data.results.is_admin
				})
				setStore({
					user: data.results
				})
				localStorage.setItem('user', JSON.stringify(data.results))
				
			},

			changeColor: (index, color) => {
				const store = getStore();
				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				//reset the global store
				setStore({ demo: demo });
			},

			getUserAgenda: async () => {
				const uri = `${url}/agendas/${user}`;
				const options = {
					method: 'GET'
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText)
					return;
				};
				const data = await response.json()
				setStore({ contacts: data.contacts });
			},

			addContact: async (body) => {
				const uri = `${url}/agendas/${user}/contacts`;
				const options = {
					method: 'POST',
					headers: {'Content-Type': 'Application/json'},
					body: JSON.stringify(body)
				};
				const response = await fetch(uri, options);
				return response;
			},

			updateContact: async (body, id) => {
				const uri = `${url}/agendas/${user}/contacts/${id}`;
				const options = {
					method: 'PUT',
					headers: { 'Content-Type': 'Application/json' },
					body: JSON.stringify(body)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText)
					return;
				};
				setStore({ currentContact: {} })
				getActions().getUserAgenda();
			},

			setContact: (contact) => {
				setStore({ currentContact: contact })
			},

			deleteContact: async (requestId) => {
				const uri = `${url}/agendas/${user}/contacts/${requestId}`;
				const options = {
					method: 'DELETE'
				};
				const response = await fetch(uri, options);
				/*  if (!response.ok) {
					  console.log('Error: ', response.status, response.statusText)
					  return;
				 }; */
				return response;
			},

			getSectionData: async (section) => {
				const uri = `${starWarsUrl}/${section}`
				const options = {
					method: 'GET'
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error :', response.status, response.statusText)
					return;
				};
				const data = await response.json();
				section = section === 'people' ? 'characters' : section;
				setStore({ [section]: data.results });
			},
			setSection: (sectionSelected) => {
				setStore({ section: sectionSelected });
				localStorage.setItem( "section", sectionSelected)
			},
			getDetailData: async (uid) => {
				const section = getStore().section === 'characters' ? 'people' : getStore().section;
				const uri = `${starWarsUrl}/${section}/${uid}`
				const options = {
					method: 'GET'
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error :', response.status, response.statusText)
					return;
				};
				const data = await response.json();
				setStore({ detailData: { ...data.result.properties, uid: data.result.uid } })
			},
			setFavourites: (item) => {
				const storeInFlux = getStore();
				const exists = storeInFlux.favourites.some(favouriteItem => favouriteItem.uid === item.uid);
				if (exists){
					setStore({ favourites: storeInFlux.favourites.filter(favouriteItem => favouriteItem.uid !== item.uid)})
				} else {
					setStore({ favourites: [...storeInFlux.favourites, item] })
				}

			}, 

		}
	};
};

export default getState;
