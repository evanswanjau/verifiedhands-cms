import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Loader2 } from "lucide-react";
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
import ImageUploader from "@/components/ImageUploader";

type Service = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  created_at: string;
  updated_at: string;
};

type ServicesSectionContent = {
  badgeText: string;
  title: string;
  description: string;
};

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/services`;
const SECTION_API_URL = `${import.meta.env.VITE_API_BASE_URL}/content/services`;

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

const serviceColumns: Column<Service>[] = [
  {
    header: "Image",
    accessor: "imageUrl",
    render: (row) => (
      <div className="flex items-center">
        <img
          src={import.meta.env.VITE_BASE_URL + row.imageUrl}
          alt={row.title}
          className="h-10 w-16 object-cover rounded-md border border-gray-200"
        />
      </div>
    ),
  },
  {
    header: "Title",
    accessor: "title",
    render: (row) => (
      <span className="font-semibold text-gray-900">{row.title}</span>
    ),
  },
  {
    header: "Description",
    accessor: "description",
    render: (row) => (
      <span className="text-gray-600">
        {row.description.length > 60
          ? row.description.slice(0, 60) + "..."
          : row.description}
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
  {
    header: "Updated",
    accessor: "updated_at",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.updated_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
];

export default function ServicesPages() {
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<
    Omit<Service, "id" | "created_at" | "updated_at">
  >({
    title: "",
    description: "",
    imageUrl: "",
  });

  // Section content state
  const [sectionContent, setSectionContent] = useState<ServicesSectionContent>({
    badgeText: "",
    title: "",
    description: "",
  });
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState<ServicesSectionContent>({
    badgeText: "",
    title: "",
    description: "",
  });

  const { user, token } = useAuth();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchServices = () => {
    setLoading(true);
    axios
      .get<Service[]>(API_URL)
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  };

  // Fetch section details
  useEffect(() => {
    setSectionLoading(true);
    axios
      .get<ServicesSectionContent>(SECTION_API_URL)
      .then((res) => {
        setSectionContent(res.data);
        setSectionForm(res.data);
      })
      .finally(() => setSectionLoading(false));
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setUploading(true);
    try {
      const data = new FormData();

      /* append text fields except avatar */
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "avatar") data.append(k, v);
      });

      if (imageFile) data.append("image", imageFile);

      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, data, authConfig);
        toast.success("Service updated successfully!");
      } else {
        await axios.post(API_URL, data, authConfig);
        toast.success("Service created successfully!");
      }
      fetchServices();
      setModalOpen(false);
      setEditing(null);
      setImageFile(null);
      setForm({ title: "", description: "", imageUrl: "" });
    } catch {
      toast.error("Failed to save service.");
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
      setSectionModalOpen(false);
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
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`, authConfig);
      fetchServices();
      toast.success("Service deleted.");
    } catch {
      toast.error("Failed to delete service.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
    });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", imageUrl: "" });
    setModalOpen(true);
  };

  const columnsWithActions: Column<Service>[] = user
    ? [
        ...serviceColumns,
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
    : serviceColumns;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Services
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
                Add Service
              </Button>
            )}
          </div>
        </div>

        {/* Section Edit Modal */}
        <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
          <DialogContent className="max-w-lg rounded-2xl border-none p-8">
            <DialogHeader>
              <DialogTitle className="font-bold text-green-700 mb-2">
                Edit Service Details
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
                  placeholder="e.g. Our Services"
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
                  placeholder="e.g. Services We Offer"
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
                  placeholder="Short description for the services section"
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
              data={services}
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
                {editing ? "Edit Service" : "Add Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-2">
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
                  placeholder="Enter service title"
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
                  placeholder="Enter service description"
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
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
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
