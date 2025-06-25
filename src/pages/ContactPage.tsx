import { useState, useEffect } from "react";
import axios, { type AxiosRequestConfig } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

// Types
type ContactContent = {
  badgeText: string;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapSrc: string;
};

const contactUrl = `${import.meta.env.VITE_API_BASE_URL}/content/contact`;

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

// Helper for update logic
async function updateSection(
  url: string,
  form: Record<string, string>,
  authConfig: AxiosRequestConfig
) {
  await axios.put(url, form, authConfig);
}

export default function ContactPage() {
  // Contact
  const [contact, setContact] = useState<ContactContent | null>(null);
  const [contactLoading, setContactLoading] = useState(true);

  const { user, token } = useAuth();
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all sections
  useEffect(() => {
    setContactLoading(true);
    axios
      .get(contactUrl)
      .then((res) => setContact(res.data))
      .finally(() => setContactLoading(false));
  }, []);

  // Handlers
  const handleChange =
    (setForm: React.Dispatch<React.SetStateAction<ContactContent | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev: ContactContent | null) =>
        prev ? { ...prev, [e.target.name]: e.target.value } : prev
      );
    };

  const handleSubmit =
    (
      url: string,
      form: ContactContent | null,
      setLoading: (b: boolean) => void,
      sectionName: string
    ) =>
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        toast.error("You must be logged in to perform this action.");
        return;
      }
      if (!form) {
        toast.error("Form data is missing.");
        return;
      }
      setLoading(true);
      try {
        // Optionally, convert form to Record<string, string> if needed
        // const formData = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, String(v)]));
        await updateSection(url, form, authConfig);
        toast.success(`${sectionName} updated!`);
      } catch {
        toast.error(`Failed to update ${sectionName}.`);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10 space-y-12">
        {/* Contact Section */}
        <section>
          <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
            Edit Contact Content
          </h1>
          <form
            onSubmit={handleSubmit(
              contactUrl,
              contact,
              setContactLoading,
              "Contact"
            )}
            className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
          >
            {contactLoading || !contact ? (
              <Loader2 className="w-6 h-6 animate-spin text-green-700" />
            ) : (
              <>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Badge Text
                  </label>
                  <Input
                    name="badgeText"
                    value={contact.badgeText}
                    onChange={handleChange(setContact)}
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
                    value={contact.title}
                    onChange={handleChange(setContact)}
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
                    value={contact.description}
                    onChange={handleChange(setContact)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={contact.address}
                    onChange={handleChange(setContact)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange(setContact)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    name="email"
                    value={contact.email}
                    onChange={handleChange(setContact)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Hours
                  </label>
                  <Input
                    name="hours"
                    value={contact.hours}
                    onChange={handleChange(setContact)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Map Src
                  </label>
                  <Input
                    name="mapSrc"
                    value={contact.mapSrc}
                    onChange={handleChange(setContact)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="submit"
                    className="bg-green-600 cursor-pointer text-white hover:bg-green-700 flex items-center gap-2"
                    disabled={contactLoading}
                  >
                    {contactLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Save
                  </Button>
                </div>
              </>
            )}
          </form>
        </section>
      </div>
    </Layout>
  );
}
