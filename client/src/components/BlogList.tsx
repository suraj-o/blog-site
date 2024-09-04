import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Author {
  name: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  author: Author;
}

interface BlogListProps {
  blog: Blog;
}

const BlogList: React.FC<BlogListProps> = ({ blog }) => {
  const timeAgo = formatDistanceToNow(new Date(blog.publishedDate), {
    addSuffix: true,
  });
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => navigate(`/blog/${blog.id}`)}
        className="w-full flex flex-wrap justify-between p-4 my-4 border-b md:p-12"
      >
        <div className="flex flex-col w-2/3">
          <p className="text-gray-500 text-sm">
            {blog.author.name} <span>• {timeAgo}</span>
          </p>
          <div>
            <h1 className="text-xl md:text-2xl font-bold mt-2">{blog.title}</h1>
            <p className="mt-2">
              {blog.content.split(" ").slice(0, 20).join(" ")}
            </p>
          </div>
        </div>
        <div className="w-1/3 h-[200px] mt-4 md:mt-0 flex justify-center items-center">
          <div className="w-[300px] h-[200px] bg-gray-300 rounded-sm overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://media.wired.com/photos/5fb70f2ce7b75db783b7012c/master/w_1920,c_limit/Gear-Photos-597589287.jpg"
              alt="Blog"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
