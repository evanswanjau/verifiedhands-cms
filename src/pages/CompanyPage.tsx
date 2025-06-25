import { useState, useEffect } from "react";
import axios, { type AxiosRequestConfig } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type CompanyContent = {
  name: string;
  displayName: string;
  tagline: string;
  bio: string;
  logoUrl: string;
};

const companyUrl = "http://localhost:5000/api/content/company";

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

// Helper for update logic
async function updateSection(
  url: string,
  form: CompanyContent,
  authConfig: AxiosRequestConfig
) {
  await axios.put(url, form, authConfig);
}

export default function CompanyPage() {
  // Company
  const [company, setCompany] = useState<CompanyContent | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  const { user, token } = useAuth();
  const authConfig: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch company info
  useEffect(() => {
    setCompanyLoading(true);
    axios
      .get(companyUrl)
      .then((res) => setCompany(res.data))
      .finally(() => setCompanyLoading(false));
  }, []);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompany((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    if (!company) {
      toast.error("Form data is missing.");
      return;
    }
    setCompanyLoading(true);
    try {
      await updateSection(companyUrl, company, authConfig);
      toast.success("Company Info updated!");
    } catch {
      toast.error("Failed to update Company Info.");
    } finally {
      setCompanyLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
          Edit Company Info
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
        >
          {companyLoading || !company ? (
            <Loader2 className="w-6 h-6 animate-spin text-green-700" />
          ) : (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <Input
                  name="name"
                  value={company.name}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Display Name
                </label>
                <Input
                  name="displayName"
                  value={company.displayName}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Tagline
                </label>
                <Input
                  name="tagline"
                  value={company.tagline}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={company.bio}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Logo URL
                </label>
                <Input
                  name="logoUrl"
                  value={company.logoUrl}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="submit"
                  className="bg-green-600 cursor-pointer text-white hover:bg-green-700 flex items-center gap-2"
                  disabled={companyLoading}
                >
                  {companyLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
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
