import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

// Types
type CtaContent = {
  title: string;
  description: string;
};

const ctaUrl = `${import.meta.env.VITE_API_BASE_URL}/content/cta`;

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

export default function CtaPage() {
  const [cta, setCta] = useState<CtaContent | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    setLoading(true);
    axios
      .get(ctaUrl)
      .then((res) => setCta(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCta((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    if (!cta) {
      toast.error("Form data is missing.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(ctaUrl, cta, authConfig);
      toast.success("CTA updated!");
    } catch {
      toast.error("Failed to update CTA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
          Edit CTA Section
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
        >
          {loading || !cta ? (
            <Loader2 className="w-6 h-6 animate-spin text-green-700" />
          ) : (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Title
                </label>
                <Input
                  name="title"
                  value={cta.title}
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
                  value={cta.description}
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
            </>
          )}
        </form>
      </div>
    </Layout>
  );
}
