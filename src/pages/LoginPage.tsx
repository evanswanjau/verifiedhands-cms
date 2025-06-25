import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Use your env or fallback
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/login`;
const COMPANY_URL = `${import.meta.env.VITE_API_BASE_URL}/content/company`;

type Company = {
  name: string;
  displayName: string;
  tagline: string;
  logoUrl: string;
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(COMPANY_URL)
      .then((res) => setCompany(res.data))
      .catch(() => {
        toast.error("Failed to load");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(API_URL, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      navigate("/hero");
    } catch {
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        {company && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={company.logoUrl}
              alt={company.displayName}
              className="h-auto w-52 mb-2"
            />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4"
          autoComplete="off"
        >
          <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Sign in to your account
          </h1>
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-white"
              autoFocus
            />
            </div>
            <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="bg-white"
            />
            </div>
          <Button
            type="submit"
            className="bg-green-600 text-white hover:bg-green-700 w-full flex items-center justify-center gap-2 cursor-pointer"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Login
          </Button>
        </form>
        <div className="mt-6 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} {company?.name}
        </div>
      </div>
    </div>
  );
}
