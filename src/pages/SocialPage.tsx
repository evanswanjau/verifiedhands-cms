import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type SocialContent = {
  facebook: string;
  x: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
};

const socialUrl = `${import.meta.env.VITE_API_BASE_URL}/content/social`;

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

export default function SocialPage() {
  const [social, setSocial] = useState<SocialContent | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    setLoading(true);
    axios
      .get(socialUrl)
      .then((res) => setSocial(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocial((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(socialUrl, social, authConfig);
      toast.success("Social Media updated!");
    } catch {
      toast.error("Failed to update Social Media.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
          Edit Social Media
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
        >
          {loading || !social ? (
            <Loader2 className="w-6 h-6 animate-spin text-green-700" />
          ) : (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Facebook
                </label>
                <Input
                  name="facebook"
                  value={social.facebook}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  X (Twitter)
                </label>
                <Input
                  name="x"
                  value={social.x}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Instagram
                </label>
                <Input
                  name="instagram"
                  value={social.instagram}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  LinkedIn
                </label>
                <Input
                  name="linkedin"
                  value={social.linkedin}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  YouTube
                </label>
                <Input
                  name="youtube"
                  value={social.youtube}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  TikTok
                </label>
                <Input
                  name="tiktok"
                  value={social.tiktok}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="submit"
                  className="bg-green-600 cursor-pointer text-white hover:bg-green-700 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </Layout>
  );
}
