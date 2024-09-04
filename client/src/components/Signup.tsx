import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { UserContext } from "@/utils/context";

interface UserContextValue {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  token: string;
  name: string;
}

export default function Signup() {
  const { setUserToken } = useContext(UserContext) as UserContextValue;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
      const res = await axios.post<SignupResponse>(
        BACKEND_URL + "user/signup",
        formData
      );
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("name", res.data.name);
      setUserToken(res.data.token);
      navigate("/blog");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-white display flex w-full h-screen">
        <div className="w-1/2 flex flex-col justify-center item-center text-center p-60">
          <h1 className="text-5xl font-bold">Create an account</h1>
          <span className="my-4 text-xl text-gray-500 font-semibold">
            Already have an account?{" "}
            <Link className="underline" to="/signin">
              Login
            </Link>
            <div className="text-start">
              <form onSubmit={handleSubmit}>
                <label className="block  text-black mt-2 text-xl">
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className=" text-lg p-2 my-2  border border-gray-300 rounded-md w-full"
                />
                <label className="block  text-black mt-2 text-xl">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="m@example.com"
                  className=" text-lg p-2 my-2  border border-gray-300 rounded-md w-full"
                />
                <label className="block  text-black mt-2 text-xl">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-lg p-2 my-2  border border-gray-300 rounded-md w-full"
                />
                <button
                  className="block text-lg p-2 my-2  border text-white rounded-md w-full bg-black"
                  type="submit"
                >
                  Signup
                </button>
              </form>
            </div>
          </span>
        </div>
        <div className="w-1/2 flex flex-col justify-center p-28 bg-slate-100">
          <div className="text-start">
            <h1 className="text-4xl font-bold mb-6">
              "Our mission is to drive progress through relentless innovation
              and a commitment to excellence."
            </h1>
            <h2 className="text-2xl font-semibold">Sushil Kumar</h2>
            <span className="text-xl text-gray-500">CEO, Sushil Kumar</span>
          </div>
        </div>
      </div>
    </>
  );
}
