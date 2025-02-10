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
			backgroundAdd: 'success',
			contacts: [],
			currentContact: {},
			addOrEdit: null,
			formAddContactTitle: (''),
			formEditConctacTitle: (''),
			
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
				console.log(data);

				setStore({contacts: data.contacts});
							
			},

			addContact: async () => {
				const url = 'https://playground.4geeks.com/contact';
				const user = 'MauroG';
				const bodyRequest = {
					"name": "Contact Name",
					"phone": "Contact Phone",
					"email": "Contact Email",
					"address": "Contact Address"
				};
				const uri = `${url}/agendas/${user}/contacts`;
				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'appplication/json' },
					body: JSON.stringify(bodyRequest)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText)
					return;
				};
				getUserAgenda();
			},
			updateContact: async () => {
				const uri = `${url}/agendas/${user}/${getStore().currentContact.id}`;
				const bodyRequest = {
					"name": "Contact Name",
					"phone": "Contact Phone",
					"email": "Contact Email",
					"address": "Contact Address"
				};
				const options = {
					method: 'PUT',
					headers: {"Content-Type":"application/json"},
					body: JSON.stringify(bodyRequest)
				};
				const response = await fetch(uri, options);					
				if(!response.ok){
					console.log('Error: ', response.status, response.statusText)
					return;					
				};
				const data = response.json();
				getUserAgenda();
			},
			setContact: (contact) => {
				setStore({currentContact: contact})
			},
			setFormAddContactTitle: () =>{
				setStore({formAddContactTitle: ('New Contact')}),
				setStore({addOrEdit: true})
			},
			setFormEditConctacTitle: () =>{
				setStore({formEditConctacTitle: ('Edit Contact')}),
				setStore({addOrEdit: false})
			},
			
			
		}
	};
};

export default getState;
