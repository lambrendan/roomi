import Login from "layouts/Login/Login.jsx";
import Signup from "layouts/Signup/Signup.jsx";

var authIndexRoutes = [
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup},
];

export default authIndexRoutes;
