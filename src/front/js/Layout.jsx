import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
// Custom Component
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
// Custom Page & Views
import { Home } from "./pages/Home.jsx";

import { ContactsList } from "./pages/Contacts.jsx";
import { AddContact } from "./component/AddContact.jsx";
import { EditContact } from "./component/EditContact.jsx";

import { Blog } from "./pages/Blog.jsx"
import { Detail } from "./pages/Detail.jsx"
import { Login } from "./pages/LogIn.jsx";
import { SignIn } from "./pages/SignIn.jsx";



//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="bg-dark">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<ContactsList />} path="/contacts" />
                        <Route element={<AddContact />} path="/addcontact" />
                        <Route element={<EditContact />} path="/editcontact" />
                        <Route element={<Blog />} path="/starships" />
                        <Route element={<Blog />} path="/planets" />
                        <Route element={<Blog />} path="/characters" />
                        <Route element={<Detail />} path="/detail" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<SignIn />} path="/signin" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
