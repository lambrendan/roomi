import Household from "layouts/Household/Household.jsx";

var initHouseIndexRoutes = [
    { path: "/init", name: "Init", component: Household},
    { redirect: true, path: "/", to: "/init", name: "Init" }
];

export default initHouseIndexRoutes;
