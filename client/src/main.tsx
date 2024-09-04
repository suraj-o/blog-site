import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import appRouter from "./App";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement | null;
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
root.render(<RouterProvider router={appRouter} />);
