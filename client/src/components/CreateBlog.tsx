import { useContext, useState } from "react";
import { BACKEND_URL } from "../config";
import { UserContext } from "@/utils/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface FormData {
  title: string;
  content: string;
}

interface UserContextValue {
  userToken: string | null;
}

export default function CreateBlog() {
  const { userToken } = useContext(UserContext) as UserContextValue;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });

  const handlePublish = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}blog/blog`,
        {
          title: formData.title,
          content: formData.content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (res.data.id) {
        navigate(`/blog/${res.data.id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center">
      <div className="flex justify-between items-center h-16 px-24 w-full">
        <div className="text-xl font-semibold">Draft in Sushil</div>
        <div className="flex gap-4">
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-2 py-1 rounded-full"
          >
            Publish
          </button>
          <div className="w-8 h-8 bg-slate-400 rounded-full"></div>
        </div>
      </div>
      <div className="mx-40 my-16 p-4 bg-white w-full max-w-3xl">
        <form>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-4 text-5xl border-l-2 focus:outline-none"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            placeholder="Tell your story..."
            className="w-full p-2 h-64 text-2xl focus:outline-none"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          ></textarea>
        </form>
      </div>
    </div>
  );
}
