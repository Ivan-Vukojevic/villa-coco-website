import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: "about",
        lazy: () => import("../pages/About").then((mod) => ({ Component: mod.default })),
      },
      {
        path: "gallery",
        lazy: () => import("../pages/Gallery").then((mod) => ({ Component: mod.default })),
      },
      {
        path: "contact",
        lazy: () => import("../pages/Contact").then((mod) => ({ Component: mod.default })),
      },
      {
        path: "*",
        lazy: () => import("../pages/NotFound").then((mod) => ({ Component: mod.default })),
      },
    ],
  },
]);