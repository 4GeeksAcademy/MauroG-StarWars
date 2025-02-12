const getState = ({ getStore, getActions, setStore }) => {
	const url = 'https://playground.4geeks.com/contact';
	const user = 'MauroG';
	/* const contactId = getStore().contacts.id */
	/* console.log(getStore(store.contacts)); */


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
			changeColor: (index, color) => {
				//get the store
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
				/* console.log(data); */

				setStore({ contacts: data.contacts });

			},

			addContact: async (body) => {

				const uri = `${url}/agendas/${user}/contacts`;
				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				};

				const response = await fetch(uri, options);
				// if (!response.ok) {
				// 	console.log('Error: ', response.status, response.statusText)
				// 	return;
				// };
				// getUserAgenda();
				return response;
			},

			updateContact: async (body, id) => {
				/* const { id, ...body } = bodyRequest; */
				/* const uri = `${url}/agendas/${user}/contacts/${bodyRequest.id}`; */
				/* const uri = `${url}/agendas/${user}/contacts/${contactId}`; */
				const uri = `${url}/agendas/${user}/contacts/${id}`;
				const options = {
					method: 'PUT',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText)
					return;
				};
				setStore({currentContact: {}})
				getActions().getUserAgenda();
								
				/* return response; */
				
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

		}
	};
};

export default getState;
