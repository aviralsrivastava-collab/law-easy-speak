import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Trash2, Search, Bookmark, ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  query: string;
  results: any;
  roadmap: any;
  language: string;
  created_at: string;
}

interface BookmarkItem {
  id: string;
  section: string;
  title: string;
  summary: string;
  penalty: string;
  remedy: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"history" | "bookmarks">("history");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoadingData(true);
      const [h, b] = await Promise.all([
        supabase.from("search_history").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("bookmarks").select("*").order("created_at", { ascending: false }),
      ]);
      if (h.data) setHistory(h.data);
      if (b.data) setBookmarks(b.data);
      setLoadingData(false);
    };
    fetchData();
  }, [user]);

  const deleteHistory = async (id: string) => {
    await supabase.from("search_history").delete().eq("id", id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    toast.success("Deleted");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    toast.success("Bookmark removed");
  };

  const clearAllData = async () => {
    if (!confirm("Delete all your saved searches and bookmarks? This cannot be undone.")) return;
    await Promise.all([
      supabase.from("search_history").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("bookmarks").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
    setHistory([]);
    setBookmarks([]);
    toast.success("All saved data deleted");
  };

  const deleteAccount = async () => {
    if (!confirm("Permanently delete your account and all personal data? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await supabase.auth.signOut();
      toast.success("Your account and all personal data have been deleted");
      navigate("/");
    } catch {
      toast.error("Could not delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };



  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">My Dashboard</h1>

        <div className="flex gap-2 mb-6">
          <Button variant={tab === "history" ? "hero" : "outline"} size="sm" onClick={() => setTab("history")} className="gap-1">
            <Clock className="w-4 h-4" /> Search History
          </Button>
          <Button variant={tab === "bookmarks" ? "hero" : "outline"} size="sm" onClick={() => setTab("bookmarks")} className="gap-1">
            <Bookmark className="w-4 h-4" /> Bookmarks
          </Button>
        </div>

        {loadingData ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : tab === "history" ? (
          history.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No search history yet. Try searching on the home page!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{h.query}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(h.created_at).toLocaleDateString()} · {(h.results as any[])?.length || 0} results
                    </p>
                  </div>
                  <button onClick={() => deleteHistory(h.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No bookmarks yet. Bookmark a legal section from search results!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((b) => (
              <div key={b.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block bg-trust-blue-lighter text-primary font-mono text-xs font-semibold px-2 py-0.5 rounded mb-1">
                      {b.section}
                    </span>
                    <h3 className="font-semibold text-foreground">{b.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{b.summary}</p>
                  </div>
                  <button onClick={() => deleteBookmark(b.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="mt-14 border border-destructive/30 rounded-xl p-5 bg-destructive/5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">Your data &amp; privacy</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                We store only your name, email, saved searches and bookmarks. You can wipe your saved
                content at any time, or permanently delete your account along with every piece of
                personal data linked to it.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-1" onClick={clearAllData}>
                  <Trash2 className="w-4 h-4" /> Clear saved searches &amp; bookmarks
                </Button>
                <Button variant="destructive" size="sm" className="gap-1" onClick={deleteAccount} disabled={deleting}>
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                  Delete my account permanently
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
