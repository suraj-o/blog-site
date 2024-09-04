import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.ts";
import axios from "axios";
import { UserContext } from "@/utils/context.ts";

interface UserContextValue {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
}
export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUserToken } = useContext(UserContext) as UserContextValue;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const res = await axios.post(BACKEND_URL + "user/signin", formData);
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("name", res.data.name);
      setUserToken(res.data.token);
      navigate("/blog");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white flex w-full h-screen">
      <div className="w-1/2 flex flex-col justify-center p-28 bg-slate-100">
        <div className="text-start">
          <h1 className="text-4xl font-bold mb-6">
            "Our mission is to drive progress through relentless innovation and
            a commitment to excellence."
          </h1>
          <h2 className="text-2xl font-semibold">Sushil Kumar</h2>
          <span className="text-xl text-gray-500">CEO, Sushil Kumar</span>
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center text-center p-56">
        <h1 className="text-5xl font-bold">Login to your account</h1>
        <span className="my-4 text-xl text-gray-500 font-semibold">
          Don't have an account?{" "}
          <Link className="underline" to="/signup">
            Signup
          </Link>
        </span>
        <div className="text-start w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <label className="block text-black mt-2 text-xl">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="m@example.com"
              className="text-lg p-2 my-2 border border-gray-300 rounded-md w-full"
            />
            <label className="block text-black mt-2 text-xl">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="text-lg p-2 my-2 border border-gray-300 rounded-md w-full"
            />
            <button
              className="block text-lg p-2 my-2 border text-white rounded-md w-full bg-black"
              type="submit"
            >
              Signin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
