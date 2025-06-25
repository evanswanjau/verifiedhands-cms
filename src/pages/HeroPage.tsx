import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type HeroContent = {
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  buttonText: string;
  imageUrl: string;
};

const API_URL = "http://localhost:5000/api/content/hero";

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

export default function HeroContentPage() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<HeroContent>({
    tagline: "",
    headline: "",
    subheadline: "",
    description: "",
    buttonText: "",
    imageUrl: "",
  });

  const { user, token } = useAuth();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get<HeroContent>(API_URL)
      .then((res) => setForm(res.data))
      .catch(() => toast.error("Failed to fetch hero content."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(API_URL, form, authConfig);
      toast.success("Hero content updated!");
    } catch {
      toast.error("Failed to update hero content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
          Edit Hero Content
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tagline
            </label>
            <Input
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Headline
            </label>
            <Input
              name="headline"
              value={form.headline}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Subheadline
            </label>
            <Input
              name="subheadline"
              value={form.subheadline}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Button Text
            </label>
            <Input
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Image URL
            </label>
            <Input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
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
        </form>
      </div>
    </Layout>
  );
}
