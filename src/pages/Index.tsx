import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import TrustStrip from "@/components/TrustStrip";
import CategoriesSection from "@/components/CategoriesSection";
import TopicLibrary from "@/components/TopicLibrary";
import KnowYourRights from "@/components/KnowYourRights";
import ArticlesSection from "@/components/ArticlesSection";
import LegalAidLocator from "@/components/LegalAidLocator";
import FAQSection from "@/components/FAQSection";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 space-y-4 md:space-y-8">
        <div id="mapper">
          <HeroSearch />
        </div>
        <TrustStrip />
        <Reveal as="div" className="block"><div id="categories"><CategoriesSection /></div></Reveal>
        <Reveal as="div" className="block"><div id="topics"><TopicLibrary /></div></Reveal>
        <Reveal as="div" className="block"><div id="rights"><KnowYourRights /></div></Reveal>
        <Reveal as="div" className="block"><div id="articles"><ArticlesSection /></div></Reveal>
        <Reveal as="div" className="block"><div id="aid"><LegalAidLocator /></div></Reveal>
        <Reveal as="div" className="block"><div id="faq"><FAQSection /></div></Reveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
