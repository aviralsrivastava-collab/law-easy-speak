import { useState } from "react";
import { MapPin, Phone, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const states = ["Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "West Bengal", "Uttar Pradesh"];

const mockDLSAs = [
  { name: "Delhi DLSA – Saket", state: "Delhi", district: "South Delhi", phone: "011-26565656", type: "DLSA" },
  { name: "Mumbai Legal Aid Society", state: "Maharashtra", district: "Mumbai", phone: "022-24561234", type: "NGO" },
  { name: "Chennai DLSA", state: "Tamil Nadu", district: "Chennai", phone: "044-25369999", type: "DLSA" },
  { name: "Bangalore Legal Services", state: "Karnataka", district: "Bangalore Urban", phone: "080-22345678", type: "DLSA" },
  { name: "Kolkata Legal Aid Centre", state: "West Bengal", district: "Kolkata", phone: "033-22456789", type: "NGO" },
  { name: "Lucknow DLSA", state: "Uttar Pradesh", district: "Lucknow", phone: "0522-2345678", type: "DLSA" },
];

const LegalAidLocator = () => {
  const [selectedState, setSelectedState] = useState("");
  const [searchText, setSearchText] = useState("");

  const filtered = mockDLSAs.filter((d) => {
    const matchState = !selectedState || d.state === selectedState;
    const matchSearch = !searchText || d.name.toLowerCase().includes(searchText.toLowerCase()) || d.district.toLowerCase().includes(searchText.toLowerCase());
    return matchState && matchSearch;
  });

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Find Free Legal Aid Near You
          </h2>
          <p className="text-muted-foreground text-lg">
            Locate District Legal Services Authorities and verified NGOs
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or district..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-card text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="max-w-2xl mx-auto space-y-3">
          {filtered.map((d, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{d.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.type === "DLSA" ? "bg-primary/10 text-primary" : "bg-safe-green/10 text-safe-green"}`}>
                    {d.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {d.district}, {d.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {d.phone}
                  </span>
                </div>
              </div>
              <Button variant="hero-outline" size="sm">
                Contact <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No results found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LegalAidLocator;
