import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

// Use your env or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ME_URL = `${API_BASE_URL}/me`;
const PASSWORD_URL = `${API_BASE_URL}/me/password`;

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

export default function AccountPage() {
  const [, setUserData] = useState<User | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Load user data
  useEffect(() => {
    if (!user || !token) {
      toast.error("You must be logged in to access this page.");
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(ME_URL, authConfig);
        setUserData(userRes.data);
        setProfileForm({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
        });
      } catch (error) {
        toast.error("Failed to load account data");
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await axios.put(ME_URL, profileForm, authConfig);
      setUserData(res.data);
      // Update localStorage user data
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put(
        PASSWORD_URL,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        authConfig
      );

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto py-10 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-10 space-y-12">
        {/* Profile Form */}
        <section>
          <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
            Edit Profile Information
          </h1>
          <form
            onSubmit={handleProfileSubmit}
            className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
          >
            <div>
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                className="bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
                className="bg-white"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="submit"
                className="bg-green-600 cursor-pointer text-white hover:bg-green-700 flex items-center gap-2"
                disabled={profileLoading}
              >
                {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Profile
              </Button>
            </div>
          </form>
        </section>

        {/* Password Form */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
            Change Password
          </h2>
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-2 bg-white rounded-2xl shadow-xl border-none p-8"
          >
            <div>
              <label
                htmlFor="oldPassword"
                className="block mb-1 font-medium text-gray-700"
              >
                Current Password
              </label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder="Enter your current password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                required
                className="bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block mb-1 font-medium text-gray-700"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="submit"
                className="bg-green-600 cursor-pointer text-white hover:bg-green-700 flex items-center gap-2"
                disabled={passwordLoading}
              >
                {passwordLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Change Password
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
}
