import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config.ts";
import { UserContext } from "@/utils/context";
import { useNavigate } from "react-router-dom";

interface Profile {
  email: string;
  name: string;
  bio: string;
  posts?: Post[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

interface UserContextValue {
  userToken: string | null;
}

function ProfileComponent() {
  const [profile, setProfile] = useState<Profile>({
    email: "",
    name: "",
    bio: "",
  });
  const { userToken } = useContext(UserContext) as UserContextValue;
  const [editMode, setEditMode] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    bio: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/signin");
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get<Profile>(BACKEND_URL + "user/profile", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setProfile(res.data);
      setUserForm({
        name: res.data.name,
        bio: res.data.bio,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        BACKEND_URL + "user/profile",
        {
          name: userForm.name,
          bio: userForm.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      fetchUserData(); // Refresh user data after update
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="mx-60 my-12 flex flex-col p-12 rounded-xl h-auto shadow-xl">
      {editMode ? (
        <div>
          <h1>{profile.email}</h1>
          <input
            className="text-2xl block border-2 rounded-lg p-2"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
          />
          <input
            className="text-xl block border-2 rounded-lg p-2"
            value={userForm.bio}
            onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
          />

          <button
            className="bg-red-500 text-white font-bold py-1 px-4 border-black rounded-lg text-lg"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
          <button
            className="bg-black m-4 text-white font-bold py-1 px-4 border-black rounded-lg text-lg "
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-600">
            Email: {profile.email}
          </h1>
          <h1 className="text-3xl font-bold text-gray-600">
            Name: {profile.name}
          </h1>
          <h2 className="text-2xl text-gray-400">Bio: {profile.bio}</h2>
          <button
            className="bg-red-500 text-white font-bold py-1 px-4 border-black rounded-lg text-lg my-4"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-gray-600">My blogs</h1>
        {profile.posts?.map((post) => (
          <Posts key={post.id} post={post} setProfile={setProfile} />
        ))}
      </div>
    </div>
  );
}

interface PostsProps {
  post: Post;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const Posts: React.FC<PostsProps> = ({ post, setProfile }) => {
  const navigate = useNavigate();
  const [publishForm] = useState({
    id: post.id,
    published: post.published,
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.put<Profile>(
        BACKEND_URL + `blog/publish/${publishForm.id}`,
        {
          published: !post.published,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-between items-center border-2 rounded-lg p-4 my-4">
      <div className="w-4/5">
        <h1 className="font-semibold">{post.title}</h1>
        <p>{post.content.trim().slice(0, 500)}</p>
      </div>
      <div>
        <button
          onClick={handleSubmit}
          className="bg-black text-white p-2 rounded-lg m-2 font-semibold"
        >
          {post.published ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => navigate(`/blog/${post.id}`)}
          className="border-2 text-black font-semibold p-2 rounded-lg m-2"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ProfileComponent;
