import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import Initial from "layouts/Initial/Initial.jsx";
import Login from "layouts/Login/Login.jsx";
import Signup from "layouts/Signup/Signup.jsx"

var indexRoutes = [
    { path: "/dashboard", name: "Home", component: Dashboard}, 
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup}
];

export default indexRoutes;
