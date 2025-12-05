import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPostBySlug, getBlogPosts } from "../services/api";
import moment from "moment-timezone";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await getBlogPostBySlug(slug);
        setPost(res.data.post);
        setError("");

        const tag = res.data.post?.tags?.[0] || "";
        const relatedRes = await getBlogPosts({
          limit: 3,
          tag,
        });
        setRelated(
          (relatedRes.data.posts || []).filter((item) => item.slug !== slug).slice(0, 3)
        );
      } catch (err) {
        console.error("❌ Blog detail error:", err);
        setError(err.response?.data?.message || "Failed to load this post.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded-xl shadow text-pink-600 font-semibold">
          Loading story...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
        <div className="bg-white px-6 py-4 rounded-xl shadow text-red-600 font-semibold text-center">
          {error || "Post not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-pink-50 to-white min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="text-pink-500 hover:text-pink-600 text-sm font-semibold">
          ← Back to inspiration
        </Link>

        <article className="mt-6 bg-white shadow-xl rounded-3xl overflow-hidden">
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full h-72 object-cover" />
          )}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span>
                {post.publishedAt
                  ? moment(post.publishedAt).format("MMM DD, YYYY")
                  : moment(post.createdAt).format("MMM DD, YYYY")}
              </span>
              <span>•</span>
              <span>{post.readingMinutes || 3} min read</span>
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-pink-700 mb-4">{post.title}</h1>
            {post.summary && <p className="text-lg text-gray-600 mb-6">{post.summary}</p>}
            <div
              className="prose prose-pink max-w-none prose-headings:text-pink-700 prose-a:text-pink-600"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-pink-700 mb-4">You might also like</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/blog/${rel.slug}`}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  {rel.coverImage ? (
                    <img src={rel.coverImage} alt={rel.title} className="h-32 w-full object-cover" />
                  ) : (
                    <div className="h-32 bg-pink-100 flex items-center justify-center text-pink-600 text-sm font-semibold">
                      Gift Story
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {moment(rel.publishedAt || rel.createdAt).format("MMM DD, YYYY")}
                    </p>
                    <h3 className="text-sm font-semibold text-pink-700">{rel.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPost;


