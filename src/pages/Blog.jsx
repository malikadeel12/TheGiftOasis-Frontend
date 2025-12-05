import React, { useEffect, useState } from "react";
import { getBlogPosts } from "../services/api";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getBlogPosts({
        page,
        limit: 6,
        search: search.trim(),
        tag: selectedTag,
      });
      setPosts(res.data.posts || []);
      setTotalPages(res.data.totalPages || 1);
      setTags(res.data.tags || []);
      setError("");
    } catch (err) {
      console.error("❌ Blog fetch error:", err);
      setError(err.response?.data?.message || "Failed to load posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-pink-700 mb-3">Inspiration & Guides</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover gift ideas, campaign highlights, and creative ways to surprise your loved ones.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-3xl p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories, tips, or occasions..."
              className="flex-1 border border-pink-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-pink-500 text-white px-6 py-2 rounded-xl shadow hover:bg-pink-600 transition"
            >
              Search
            </button>
          </form>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedTag("");
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedTag === ""
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-white text-pink-600 border-pink-300"
                }`}
              >
                All topics
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => {
                    setSelectedTag(tag.name);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedTag === tag.name
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-pink-600 border-pink-300 hover:bg-pink-50"
                  }`}
                >
                  #{tag.name} ({tag.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="h-64 bg-white rounded-3xl shadow animate-pulse" />
              ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-center">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-pink-100 text-pink-600 px-4 py-10 rounded-3xl text-center shadow">
            No posts yet. Check back soon for fresh inspiration!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post._id}
                className="bg-white rounded-3xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center text-pink-700 font-semibold text-lg">
                    Gift Guide
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>
                      {post.publishedAt
                        ? moment(post.publishedAt).format("MMM DD, YYYY")
                        : moment(post.createdAt).format("MMM DD, YYYY")}
                    </span>
                    <span>•</span>
                    <span>{post.readingMinutes || 3} min read</span>
                  </div>
                  <h2 className="text-xl font-bold text-pink-700 mb-3">{post.title}</h2>
                  <p className="text-sm text-gray-600 flex-1">{post.summary}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-pink-200 bg-white hover:bg-pink-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-pink-600 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full border border-pink-200 bg-white hover:bg-pink-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;


