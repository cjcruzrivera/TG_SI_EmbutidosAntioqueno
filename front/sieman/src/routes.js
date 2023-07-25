/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in Administrador copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";

import Dashboard from "pages/dashboard";
// @mui icons
import Icon from "@mui/material/Icon";

const allRoles = [
  "Administrador",
  "Secretaria Administrativa",
  "Auxiliar Contable",
  "Operario de Produccion",
  "Operario de Alistamiento",
  "Operario de Empaque",
  "Operario de Ventas",
];

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    roles: allRoles,
    component: <Dashboard />,
  },
  {
    type: "divider",
    key: "divider-1",
    roles: ["Administrador"],
  },
  {
    type: "title",
    key: "title-config",
    title: "Configuracion",
    roles: ["Administrador"],
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "users",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/usuarios",
    roles: ["Administrador"],
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Materias Primas",
    key: "materias-primas",
    icon: <Icon fontSize="small">bento</Icon>,
    route: "/materias-primas",
    roles: ["Administrador"],
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Productos",
    key: "productos",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/productos",
    roles: ["Administrador"],
    component: <Tables />,
  },
  {
    type: "divider",
    key: "divider-2",
    roles: allRoles,
  },
  {
    type: "title",
    key: "title-ordenes",
    title: "Ordenes de Compra",
    roles: allRoles,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    roles: ["Administrador"],
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    roles: ["Administrador"],
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    roles: ["Administrador"],
    component: <Profile />,
  },
];

export default routes;
