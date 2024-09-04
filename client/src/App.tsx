import { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import Blogs from "./components/Blogs";
import { UserContext } from "./utils/context";
import Header from "./components/Header";
import Profile from "./components/Profile";

function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/blog");
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      <Header />
      <Outlet />
    </UserContext.Provider>
  );
}

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/Blog",
        element: <Blogs />,
      },
      {
        path: "/",
        element: <Profile />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/blog/:id", // Change path to use dynamic parameter ':id'
        element: <Blog />,
      },
      {
        path: "/blog/create",
        element: <CreateBlog />,
      },
    ],
  },
]);

export default AppRouter;
