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
import { toast } from "sonner";
import Layout from "@/components/Layout";

type Stat = {
  id: number;
  iconName: string;
  value: string;
  suffix: string;
  label: string;
  created_at: string;
  updated_at: string;
};

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/stats`;

// Dummy auth for demo
const useAuth = () => ({
  user: { id: 1, name: "Test User" },
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwODI5NjI4LCJleHAiOjE3NTM0MjE2Mjh9.JaJzSWpO4I25UmZxIZ80frsENN5lUCDbXQiXVe03Jio",
});

const statColumns: Column<Stat>[] = [
  {
    header: "Icon",
    accessor: "iconName",
    render: (row) => {
      const LucideIcon =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LucideIcons as any)[row.iconName] || LucideIcons["Circle"];
      return (
        <span className="flex items-left justify-start">
          <LucideIcon className="w-6 h-6 text-green-700" />
        </span>
      );
    },
  },
  {
    header: "Label",
    accessor: "label",
    render: (row) => (
      <span className="font-semibold text-gray-900">{row.label}</span>
    ),
  },
  {
    header: "Value",
    accessor: "value",
    render: (row) => <span className="text-gray-900 ">{row.value}</span>,
  },
  {
    header: "Suffix",
    accessor: "suffix",
    render: (row) => <span className="text-gray-900">{row.suffix}</span>,
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

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState<
    Omit<Stat, "id" | "created_at" | "updated_at">
  >({
    iconName: "",
    value: "",
    suffix: "",
    label: "",
  });

  const { user, token } = useAuth();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchStats = () => {
    setLoading(true);
    axios
      .get<Stat[]>(API_URL)
      .then((res) => setStats(res.data))
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, form, authConfig);
        toast.success("Stat updated successfully!");
      } else {
        await axios.post(API_URL, form, authConfig);
        toast.success("Stat created successfully!");
      }
      fetchStats();
      setModalOpen(false);
      setEditing(null);
      setForm({ iconName: "", value: "", suffix: "", label: "" });
    } catch {
      toast.error("Failed to save stat.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this stat?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`, authConfig);
      fetchStats();
      toast.success("Stat deleted.");
    } catch {
      toast.error("Failed to delete stat.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stat: Stat) => {
    setEditing(stat);
    setForm({
      iconName: stat.iconName,
      value: stat.value,
      suffix: stat.suffix,
      label: stat.label,
    });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({ iconName: "", value: "", suffix: "", label: "" });
    setModalOpen(true);
  };

  const columnsWithActions: Column<Stat>[] = user
    ? [
        ...statColumns,
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
    : statColumns;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Stats
          </h1>
          {user && (
            <Button
              className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
              onClick={handleCreate}
            >
              Add Stat
            </Button>
          )}
        </div>

        <Card className="mb-12 shadow-xl border-none">
          <CardContent>
            <DataTable
              columns={columnsWithActions}
              data={stats}
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
                {editing ? "Edit Stat" : "Add Stat"}
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
                  placeholder="e.g. Trophy, Users, ShieldCheck"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Value
                </label>
                <Input
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="Enter value (e.g. 100, 50, 1.5M)"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Suffix
                </label>
                <Input
                  name="suffix"
                  value={form.suffix}
                  onChange={handleChange}
                  className="bg-white"
                  placeholder="e.g. %, +"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Label
                </label>
                <Input
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  required
                  className="bg-white"
                  placeholder="Enter label (e.g. Users, Growth, Revenue)"
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
