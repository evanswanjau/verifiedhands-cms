import { useState, useEffect } from "react";
import axios from "axios";
import { Star, StarOff, Pencil, Trash2, Loader2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
  service: string;
  is_featured: number;
  created_at: string;
  updated_at: string;
};

type TestimonialsSectionContent = {
  badgeText: string;
  title: string;
  description: string;
};

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/testimonials`;
const SECTION_API_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/content/testimonials`;

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

const testimonialColumns: Column<Testimonial>[] = [
  {
    header: "Avatar",
    accessor: "avatar",
    render: (row) =>
      row.avatar ? (
        <img
          src={row.avatar}
          alt={row.name}
          className="h-10 w-10 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="text-gray-400" />
        </div>
      ),
  },
  {
    header: "Name",
    accessor: "name",
    render: (row) => (
      <span className="font-semibold text-gray-900">{row.name}</span>
    ),
  },
  {
    header: "Location",
    accessor: "location",
    render: (row) => <span className="text-gray-600">{row.location}</span>,
  },
  {
    header: "Service",
    accessor: "service",
    render: (row) => <span className="text-green-700">{row.service}</span>,
  },
  {
    header: "Quote",
    accessor: "quote",
    render: (row) => (
      <span className="italic text-gray-700">
        {row.quote.length > 30 ? row.quote.slice(0, 30) + "..." : row.quote}
      </span>
    ),
  },
  {
    header: "Rating",
    accessor: "rating",
    render: (row) => (
      <span className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) =>
          i < row.rating ? (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ) : (
            <StarOff key={i} className="w-4 h-4 text-gray-300" />
          )
        )}
      </span>
    ),
  },
  {
    header: "Featured",
    accessor: "is_featured",
    render: (row) =>
      row.is_featured ? (
        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
          Yes
        </span>
      ) : (
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs">
          No
        </span>
      ),
  },
  {
    header: "Created",
    accessor: "created_at",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
];

export default function TestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<
    Omit<Testimonial, "id" | "created_at" | "updated_at">
  >({
    name: "",
    location: "",
    avatar: "",
    quote: "",
    rating: 5,
    service: "",
    is_featured: 0,
  });
  const [sectionContent, setSectionContent] =
    useState<TestimonialsSectionContent>({
      badgeText: "",
      title: "",
      description: "",
    });
  const [sectionLoading, setSectionLoading] = useState(true);
  const [, setSectionEdit] = useState(false);
  const [sectionForm, setSectionForm] = useState<TestimonialsSectionContent>({
    badgeText: "",
    title: "",
    description: "",
  });

  // Add this state for the section modal
  const [sectionModalOpen, setSectionModalOpen] = useState(false);

  const { user, token } = useAuth();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTestimonials = () => {
    setLoading(true);
    axios
      .get<Testimonial[]>(API_URL)
      .then((res) => setTestimonials(res.data))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  };

  // Fetch section details
  useEffect(() => {
    setSectionLoading(true);
    axios
      .get<TestimonialsSectionContent>(SECTION_API_URL)
      .then((res) => {
        setSectionContent(res.data);
        setSectionForm(res.data);
      })
      .finally(() => setSectionLoading(false));
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSectionForm({ ...sectionForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, form, authConfig);
        toast.success("Testimonial updated successfully!");
      } else {
        await axios.post(API_URL, form, authConfig);
        toast.success("Testimonial created successfully!");
      }
      fetchTestimonials();
      setModalOpen(false);
      setEditing(null);
      setForm({
        name: "",
        location: "",
        avatar: "",
        quote: "",
        rating: 5,
        service: "",
        is_featured: 0,
      });
    } catch {
      toast.error("Failed to save testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSectionLoading(true);
    try {
      await axios.put(SECTION_API_URL, sectionForm, authConfig);
      setSectionContent(sectionForm);
      setSectionEdit(false);
      toast.success("Section details updated!");
    } catch {
      toast.error("Failed to update section details.");
    } finally {
      setSectionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`, authConfig);
      fetchTestimonials();
      toast.success("Testimonial deleted.");
    } catch {
      toast.error("Failed to delete testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    setForm({
      name: testimonial.name,
      location: testimonial.location,
      avatar: testimonial.avatar,
      quote: testimonial.quote,
      rating: testimonial.rating,
      service: testimonial.service,
      is_featured: testimonial.is_featured,
    });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      location: "",
      avatar: "",
      quote: "",
      rating: 5,
      service: "",
      is_featured: 0,
    });
    setModalOpen(true);
  };

  const columnsWithActions: Column<Testimonial>[] = user
    ? [
        ...testimonialColumns,
        {
          header: "",
          accessor: "id",
          render: (row) => (
            <div className="flex gap-2 justify-center">
              <Button
                size="icon"
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 cursor-pointer"
                title="Edit"
                onClick={() => handleEdit(row)}
              >
                <Pencil className="w-4 h-4 text-green-700" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 cursor-pointer"
                title="Delete"
                onClick={() => handleDelete(row.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ),
        },
      ]
    : testimonialColumns;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Testimonials
          </h1>
          <div className="flex gap-2">
            {user && (
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setSectionModalOpen(true)}
              >
                Edit Title
              </Button>
            )}
            {user && (
              <Button
                className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                onClick={handleCreate}
              >
                Add Testimonial
              </Button>
            )}
          </div>
        </div>

        {/* Section Edit Modal */}
        <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
          <DialogContent className="max-w-lg rounded-2xl border-none p-8">
            <DialogHeader>
              <DialogTitle className="font-bold text-green-700 mb-2">
                Edit Testimonial Details
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSectionSubmit} className="space-y-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Badge Text
                </label>
                <Input
                  name="badgeText"
                  value={sectionForm.badgeText}
                  onChange={handleSectionChange}
                  required
                  placeholder="e.g. What Clients Say"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Title
                </label>
                <Input
                  name="title"
                  value={sectionForm.title}
                  onChange={handleSectionChange}
                  required
                  placeholder="e.g. Our Testimonials"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={sectionForm.description}
                  onChange={handleSectionChange}
                  required
                  placeholder="Short description for the testimonials section"
                />
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setSectionModalOpen(false);
                    setSectionForm(sectionContent);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                  disabled={sectionLoading}
                >
                  {sectionLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="mb-12 shadow-xl border-none">
          <CardContent>
            <DataTable
              columns={columnsWithActions}
              data={testimonials}
              loading={loading}
              skeletonRows={6}
            />
          </CardContent>
        </Card>

        {/* Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-lg rounded-2xl border-none p-8">
            <DialogHeader>
              <DialogTitle className="font-bold text-green-700 mb-2">
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Location
                </label>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Avatar URL
                </label>
                <Input
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  className="bg-white"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Service
                </label>
                <Input
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="Service name"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Quote
                </label>
                <Textarea
                  name="quote"
                  value={form.quote}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="Enter testimonial quote"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Rating
                </label>
                <Input
                  type="number"
                  name="rating"
                  value={form.rating}
                  min={1}
                  max={5}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="1-5"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Featured
                </label>
                <select
                  name="is_featured"
                  value={form.is_featured}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
