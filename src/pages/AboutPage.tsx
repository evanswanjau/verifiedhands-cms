import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";

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

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/content/about`;

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

export default function AboutContentPage() {
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
    if (!user) return toast.error("You must be logged in.");

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

      toast.success("About content updated!");
      setImageFile(null);
    } catch {
      toast.error("Failed to update about content.");
    } finally {
      setLoading(false);
      setUploading(false); // hide Loader2
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
          <label className="block mb-1 font-medium text-gray-700">
            Image URL
          </label>
          <ImageUploader
            value={form.imageUrl}
            onSelect={(file) => setImageFile(file)}
            uploading={uploading}
          />

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
