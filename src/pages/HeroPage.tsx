import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";

type HeroContent = {
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  buttonText: string;
  imageUrl: string;
};

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/content/hero`;

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

export default function HeroContentPage() {
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
    setUploading(true);

    try {
      const data = new FormData();

      /* append text fields except imageUrl */
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "imageUrl") data.append(k, v);
      });

      if (imageFile) data.append("image", imageFile);

      await axios.put(API_URL, data, authConfig);

      toast.success("Hero content updated!");
      setImageFile(null);
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
            <ImageUploader
              value={form.imageUrl}
              onSelect={(file) => setImageFile(file)}
              uploading={uploading}
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
