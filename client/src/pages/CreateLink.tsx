import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createShortLink } from "../services/linkService";
import { ArrowLeft, Copy, Link2, Loader2 } from "lucide-react";

interface CreatedLink {
  code: string;
  target: string;
  shortUrl: string;
}

export default function CreateLink() {
  const [inputUrl, setInputUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [createdLinks, setCreatedLinks] = useState<CreatedLink[]>([]);
  const [loading, setLoading] = useState(false);

  const [urlError, setUrlError] = useState("");
  const [codeError, setCodeError] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    setUrlError("");
    setCodeError("");

    // URL must include protocol
    if (
      !inputUrl.startsWith("http://") &&
      !inputUrl.startsWith("https://")
    ) {
      setUrlError("URL must start with http:// or https://");
      return false;
    }

    // Validate custom code if user entered it
    if (customCode.trim() !== "") {
      const regex = /^[A-Za-z0-9]{6,8}$/;

      if (!regex.test(customCode)) {
        setCodeError(
          "Custom code must be 6–8 characters long and contain only letters or numbers."
        );
        return false;
      }
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const data = await createShortLink(inputUrl, customCode || undefined);
      const shortUrl = `${window.location.origin}/${data.code}`;

      setCreatedLinks((prev) => [
        {
          code: data.code,
          target: data.target,
          shortUrl,
        },
        ...prev,
      ]);

      setInputUrl("");
      setCustomCode("");
    } catch (err: any) {
      alert(err.message || "Failed to create link");
    }

    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
          <Link2 className="w-8 h-8 text-blue-600" />
          Create New Short Link
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Form */}
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto">

        {/* URL Field */}
        <div>
          <label className="text-gray-700 font-medium mb-1 block">Long URL</label>
          <input
            type="text"
            placeholder="https://example.com/page"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              urlError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          {urlError && (
            <p className="text-red-500 text-sm mt-1">{urlError}</p>
          )}
        </div>

        {/* Custom Code Field */}
        <div>
          <label className="text-gray-700 font-medium mb-1 block">
            Custom Code <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="abc123"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              codeError ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500"
            }`}
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          {codeError && (
            <p className="text-red-500 text-sm mt-1">{codeError}</p>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Short Link"}
        </button>
      </div>

      {/* Created Links Section */}
      <div className="w-full max-w-3xl mx-auto mt-10">
        {createdLinks.length > 0 && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Created Links</h2>
        )}

        <div className="space-y-4">
          {createdLinks.map((item) => (
            <div
              key={item.code}
              className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center"
            >
              <div className="max-w-[75%]">
                <p className="text-gray-600 text-sm">Original URL:</p>
                <a
                  href={item.target}
                  target="_blank"
                  className="text-blue-600 underline break-all"
                >
                  {item.target}
                </a>

                <p className="text-gray-600 text-sm mt-2">Short URL:</p>
                <a
                  href={item.shortUrl}
                  target="_blank"
                  className="text-green-600 font-semibold underline break-all"
                >
                  {item.shortUrl}
                </a>
              </div>

              <button
                onClick={() => copyToClipboard(item.shortUrl)}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                <Copy className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
