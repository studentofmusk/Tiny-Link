import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLinks, deleteLink, copyLink } from "../services/linkService";
import { Copy, Trash2, BarChart2, Plus } from "lucide-react";
import type { LinkStats } from "../types/linkType";

export default function Dashboard() {
  const [links, setLinks] = useState<LinkStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await getAllLinks();
      setLinks(data);
    } catch (err) {
      alert(String(err));
    }
    setLoading(false);
  };

  const handleCopy = async (code: string) => {
    const tiny = await copyLink(code);
    alert("Copied: " + tiny);
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    const result = await deleteLink(code);

    if (result === "ok") {
      await loadLinks();
    } else if (result === "notfound") {
      alert("Link Not Found!");
    } else if (result === "invalid") {
      alert("Invalid Code");
    } else {
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
          <BarChart2 className="w-8 h-8 text-purple-600" />
          Dashboard
        </h1>

        <button
          onClick={() => navigate("/dashboard/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create New Link
        </button>
      </div>

      {/* Links Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        {loading ? (
          <p className="text-gray-500">Loading links...</p>
        ) : links.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            No links found.
            <br />
            <span className="text-blue-600 underline cursor-pointer" onClick={() => navigate("/dashboard/create")}>
              Create your first link →
            </span>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="p-3">Short Link</th>
                  <th className="p-3">Target URL</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Last Clicked</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => {
                  const shortUrl = `${window.location.origin}/${link.code}`;

                  return (
                    <tr
                      key={link.code}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 text-blue-600 underline">
                        <a href={shortUrl} target="_blank">{shortUrl}</a>
                      </td>

                      <td className="p-3 break-all text-gray-700 max-w-xs">
                        <a href={link.target} target="_blank" className="underline hover:text-blue-600">
                          {link.target}
                        </a>
                      </td>

                      <td className="p-3 font-semibold text-purple-700">
                        {link.clicks}
                      </td>

                      <td className="p-3 text-gray-600">
                        {link.last_clicked || "—"}
                      </td>

                      <td className="p-3 text-gray-600">
                        {new Date(link.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-3 flex justify-center gap-3">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(link.code)}
                          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          <Copy className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
