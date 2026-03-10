import { RouterProvider } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { router } from "./config";

export default function App() {
  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  );
}