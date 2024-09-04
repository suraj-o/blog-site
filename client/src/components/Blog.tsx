import { useContext, useEffect, useState } from "react";
import { UserContext } from "../utils/context.js";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config.ts";
import axios from "axios";

export default function Blog(): JSX.Element {
  interface Author {
    name: string;
    bio: string;
  }

  interface BlogData {
    id: string;
    title: string;
    content: string;
    publishedDate: string;
    published: boolean;
    authorId: string;
    author: Author;
  }

  const { userToken } = useContext(UserContext) as { userToken: string | null };
  const [blog, setBlog] = useState<BlogData | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/signin");
    } else {
      fetchBlog();
    }
  }, []);

  const fetchBlog = async (): Promise<void> => {
    try {
      const res = await axios.get(`${BACKEND_URL}blog/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setBlog(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return blog ? (
    <div className="flex w-full h-screen p-16">
      <div className="w-4/6 h-screen p-4 ">
        <h1 className="text-5xl font-extrabold pr-8">{blog.title}</h1>
        <p className="my-4 font-semibold text-gray-500">
          Posted on {blog.publishedDate.split("T")[0]}
        </p>
        {blog.content.split("\n").map((paragraph, index) => (
          <p className="my-2 text-lg" key={index}>
            {paragraph}
          </p>
        ))}
      </div>
      <div className="w-2/6 h-screen p-4">
        <p>Author</p>
        <div className="flex">
          <div className="w-1/6 flex items-center">
            <div className="w-8 h-8 bg-slate-400 rounded-full"></div>
          </div>
          <div className="w-5/6">
            <h3 className="text-2xl font-bold">{blog.author.name}</h3>
            <p className="text-gray-500 font-semibold">{blog.author.bio}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
