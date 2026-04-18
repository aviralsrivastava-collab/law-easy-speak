import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import CategoriesSection from "@/components/CategoriesSection";
import TopicLibrary from "@/components/TopicLibrary";
import KnowYourRights from "@/components/KnowYourRights";
import ArticlesSection from "@/components/ArticlesSection";
import LegalAidLocator from "@/components/LegalAidLocator";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div id="mapper">
          <HeroSearch />
        </div>
        <div id="categories">
          <CategoriesSection />
        </div>
        <div id="topics">
          <TopicLibrary />
        </div>
        <div id="rights">
          <KnowYourRights />
        </div>
        <div id="articles">
          <ArticlesSection />
        </div>
        <div id="aid">
          <LegalAidLocator />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
