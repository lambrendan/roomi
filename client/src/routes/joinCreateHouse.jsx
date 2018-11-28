import InitHousehold from "layouts/InitHousehold/InitHousehold.jsx";
import JoinHousehold from "layouts/JoinHousehold/JoinHousehold.jsx";


var initHouseIndexRoutes = [
    { path: "/init/createHouse", name: "Init", component: InitHousehold},
    { path: "/init/joinHouse", name: "Join", component: JoinHousehold}
];

export default initHouseIndexRoutes;
