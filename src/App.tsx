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
import SocialPage from "./pages/SocialPage";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/hero" element={<HeroContentPage />} />
          <Route path="/about" element={<AboutContentPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/services" element={<ServicesPages />} />
          <Route path="/contact" element={<ContactPages />} />
          <Route path="/socials" element={<SocialPage />} />
          <Route path="/cta" element={<CtaPages />} />
          <Route path="/company" element={<CompanyContentPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
