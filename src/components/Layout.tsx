import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  BarChart2,
  Sparkle,
  Star,
  Menu,
  Phone,
  Megaphone,
  Building2,
  Users,
  Twitter,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const COMPANY_API_URL = `${import.meta.env.VITE_API_BASE_URL}/content/company`;

type Company = {
  name: string;
  displayName: string;
  logoUrl: string;
  tagline: string;
};

// You can fetch this from API, but for now, hardcode or import as needed
const menu = [
  { label: "Hero", icon: <Home />, to: "/hero" },
  { label: "About", icon: <Info />, to: "/about" },
  { label: "Stats", icon: <BarChart2 />, to: "/stats" },
  { label: "Features", icon: <Sparkle />, to: "/features" },
  { label: "Testimonials", icon: <Star />, to: "/testimonials" },
  { label: "Services", icon: <Menu />, to: "/services" },
  { label: "Contact", icon: <Phone />, to: "/contact" },
  { label: "Socials", icon: <Twitter />, to: "/socials" },
  { label: "CTA", icon: <Megaphone />, to: "/cta" },
  { label: "Company", icon: <Building2 />, to: "/company" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company>({
    name: "",
    displayName: "",
    logoUrl: "",
    tagline: "",
  });

  useEffect(() => {
    axios
      .get(COMPANY_API_URL)
      .then((res) => {
        setCompany({
          name: res.data.name,
          displayName: res.data.displayName,
          logoUrl: res.data.logoUrl,
          tagline: res.data.tagline,
        });
      })
      .catch(() => {
        console.error("Failed to fetch company info");
      });
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shadow-lg">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={company.logoUrl}
              alt={company.displayName}
              className="h-10 w-10 rounded-full bg-white border border-gray-300 shadow"
            />
            <div>
              <span className="text-xl font-bold text-white tracking-tight block">
                {company.displayName}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {company.tagline}
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-8">
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-6 py-3 transition font-medium ${
                    location.pathname === item.to
                      ? "bg-green-600 text-white shadow"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-6 pb-6 mt-auto">
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {company.name}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-8 justify-between shadow">
          <div className="text-lg font-semibold text-white tracking-wide">
            CMS PANEL
          </div>
          <div className="flex gap-2 items-center">
            <a href="/account">
              <Button
                variant="outline"
                className="rounded-full cursor-pointer border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                <Users className="w-5 h-5 mr-2" />
                Account
              </Button>
            </a>
            <Button
              variant="outline"
              className="cursor-pointer rounded-full border-gray-700 bg-gray-800 text-gray-200 hover:bg-red-700 hover:text-white"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-8 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
