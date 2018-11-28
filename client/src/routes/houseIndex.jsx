import Dashboard from "layouts/Dashboard/Dashboard.jsx"

var houseIndexRoutes = [
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
    { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default houseIndexRoutes;
