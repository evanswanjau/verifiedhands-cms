import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type AboutContent = {
  badgeText: string;
  title: string;
  description: string;
  imageUrl: string;
  teamCountText: string;
  teamSubtext: string;
  promiseTitle: string;
  promiseDescription: string;
  differenceTitle: string;
  differenceDescription: string;
  communityTitle: string;
  communityDescription: string;
};

const API_URL = "http://localhost:5000/api/content/about";

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

export default function AboutContentPage() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AboutContent>({
    badgeText: "",
    title: "",
    description: "",
    imageUrl: "",
    teamCountText: "",
    teamSubtext: "",
    promiseTitle: "",
    promiseDescription: "",
    differenceTitle: "",
    differenceDescription: "",
    communityTitle: "",
    communityDescription: "",
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
      .get<AboutContent>(API_URL)
      .then((res) => setForm(res.data))
      .catch(() => toast.error("Failed to fetch about content."))
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
      toast.success("About content updated!");
    } catch {
      toast.error("Failed to update about content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
          Edit About Content
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Badge Text
            </label>
            <Input
              name="badgeText"
              value={form.badgeText}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Title
            </label>
            <Input
              name="title"
              value={form.title}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Team Count Text
              </label>
              <Input
                name="teamCountText"
                value={form.teamCountText}
                onChange={handleChange}
                required
                className="bg-white"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Team Subtext
              </label>
              <Input
                name="teamSubtext"
                value={form.teamSubtext}
                onChange={handleChange}
                required
                className="bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Promise Title
            </label>
            <Input
              name="promiseTitle"
              value={form.promiseTitle}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Promise Description
            </label>
            <Textarea
              name="promiseDescription"
              value={form.promiseDescription}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Difference Title
            </label>
            <Input
              name="differenceTitle"
              value={form.differenceTitle}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Difference Description
            </label>
            <Textarea
              name="differenceDescription"
              value={form.differenceDescription}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Community Title
            </label>
            <Input
              name="communityTitle"
              value={form.communityTitle}
              onChange={handleChange}
              required
              className="bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Community Description
            </label>
            <Textarea
              name="communityDescription"
              value={form.communityDescription}
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
