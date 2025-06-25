import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServicesPages from "@/pages/ServicesPages";
import TestimonialsPage from "@/pages/TestimonialsPage";
import StatsPage from "@/pages/StatsPage";
import FeaturesPage from "@/pages/FeaturesPage";
import HeroContentPage from "@/pages/HeroPage";
import AboutContentPage from "@/pages/AboutPage";
import CompanyContentPage from "@/pages/CompanyPage";
import ContactPages from "@/pages/ContactPage";
import CtaPages from "@/pages/CtaPage";
import SocialPage from "@/pages/SocialPage";
import LoginPage from "@/pages/LoginPage";
import RequireAuth from "@/components/RequireAuth";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/hero"
            element={
              <RequireAuth>
                <HeroContentPage />
              </RequireAuth>
            }
          />
          <Route
            path="/about"
            element={
              <RequireAuth>
                <AboutContentPage />
              </RequireAuth>
            }
          />
          <Route
            path="/stats"
            element={
              <RequireAuth>
                <StatsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/features"
            element={
              <RequireAuth>
                <FeaturesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/testimonials"
            element={
              <RequireAuth>
                <TestimonialsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/services"
            element={
              <RequireAuth>
                <ServicesPages />
              </RequireAuth>
            }
          />
          <Route
            path="/contact"
            element={
              <RequireAuth>
                <ContactPages />
              </RequireAuth>
            }
          />
          <Route
            path="/socials"
            element={
              <RequireAuth>
                <SocialPage />
              </RequireAuth>
            }
          />
          <Route
            path="/cta"
            element={
              <RequireAuth>
                <CtaPages />
              </RequireAuth>
            }
          />
          <Route
            path="/company"
            element={
              <RequireAuth>
                <CompanyContentPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
