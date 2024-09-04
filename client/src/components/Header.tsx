import { UserContext } from "@/utils/context";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserContextValue {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Header() {
  const { userToken, setUserToken } = useContext(
    UserContext
  ) as UserContextValue;
  const [user, setUser] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      setUser(localStorage.getItem("name") || "");
    }
  }, [userToken]);

  const handleSignOut = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="h-16 bg-black flex justify-between px-12">
      <div className="flex items-center">
        <h1
          onClick={() => navigate("/blog")}
          className="text-white text-3xl font-bold"
        >
          Inspiration
        </h1>
      </div>
      <div className="flex items-center gap-10">
        <h1
          onClick={() => navigate("/blog")}
          className="text-white font-bold cursor-pointer"
        >
          Home
        </h1>
        <h1
          onClick={() => navigate("/blog/create")}
          className="text-white font-bold cursor-pointer"
        >
          Write
        </h1>
      </div>
      <div className="flex items-center gap-10">
        <h1
          onClick={() => navigate("/")}
          className="text-white cursor-pointer font-bold"
        >
          Hello, {user}
        </h1>
        {userToken ? (
          <button onClick={handleSignOut} className="text-white font-bold">
            Signout
          </button>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="text-white font-bold"
          >
            Signin
          </button>
        )}
      </div>
    </div>
  );
}
