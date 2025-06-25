import { useState, useEffect } from "react";
import axios from "axios";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Layout from "@/components/Layout";

type Feature = {
  id: number;
  iconName: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type FeaturesSectionContent = {
  badgeText: string;
  title: string;
  description: string;
};

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/features`;
const SECTION_API_URL = "${import.meta.env.VITE_API_BASE_URL}/content/features";

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

const featureColumns: Column<Feature>[] = [
  {
    header: "Icon",
    accessor: "iconName",
    render: (row) => {
      const LucideIcon =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LucideIcons as any)[row.iconName] || LucideIcons["Circle"];
      return (
        <span className="flex items-center justify-center">
          <LucideIcon className="w-6 h-6 text-green-700" />
        </span>
      );
    },
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
      <span className="text-gray-700">
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

export default function FeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [form, setForm] = useState<
    Omit<Feature, "id" | "created_at" | "updated_at">
  >({
    iconName: "",
    title: "",
    description: "",
  });

  // Section content state
  const [sectionContent, setSectionContent] = useState<FeaturesSectionContent>({
    badgeText: "",
    title: "",
    description: "",
  });
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState<FeaturesSectionContent>({
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

  const fetchFeatures = () => {
    setLoading(true);
    axios
      .get<Feature[]>(API_URL)
      .then((res) => setFeatures(res.data))
      .catch(() => setFeatures([]))
      .finally(() => setLoading(false));
  };

  // Fetch section details
  useEffect(() => {
    setSectionLoading(true);
    axios
      .get<FeaturesSectionContent>(SECTION_API_URL)
      .then((res) => {
        setSectionContent(res.data);
        setSectionForm(res.data);
      })
      .finally(() => setSectionLoading(false));
  }, []);

  useEffect(() => {
    fetchFeatures();
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
    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, form, authConfig);
        toast.success("Feature updated successfully!");
      } else {
        await axios.post(API_URL, form, authConfig);
        toast.success("Feature created successfully!");
      }
      fetchFeatures();
      setModalOpen(false);
      setEditing(null);
      setForm({ iconName: "", title: "", description: "" });
    } catch {
      toast.error("Failed to save feature.");
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
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`, authConfig);
      fetchFeatures();
      toast.success("Feature deleted.");
    } catch {
      toast.error("Failed to delete feature.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditing(feature);
    setForm({
      iconName: feature.iconName,
      title: feature.title,
      description: feature.description,
    });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({ iconName: "", title: "", description: "" });
    setModalOpen(true);
  };

  const columnsWithActions: Column<Feature>[] = user
    ? [
        ...featureColumns,
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
    : featureColumns;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Features
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
                Add Feature
              </Button>
            )}
          </div>
        </div>

        {/* Section Edit Modal */}
        <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
          <DialogContent className="max-w-lg rounded-2xl border-none p-8">
            <DialogHeader>
              <DialogTitle className="font-bold text-green-700 mb-2">
                Edit Feature Details
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
                  placeholder="e.g. Why Choose Us"
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
                  placeholder="e.g. The VerifiedHands Difference"
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
                  placeholder="Short description for the features section"
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
              data={features}
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
                {editing ? "Edit Feature" : "Add Feature"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Icon Name
                </label>
                <Input
                  name="iconName"
                  value={form.iconName}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="e.g. BadgeCheck, DollarSign, CreditCard"
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
                  placeholder="e.g. Fast Payouts"
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
                  placeholder="Short description of the feature"
                />
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
                  {editing ? "Update Feature" : "Create Feature"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
