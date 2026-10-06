import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  BookOpen, 
  PenTool, 
  Heart, 
  Share2, 
  Camera, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Mountain, 
  Compass, 
  Clock, 
  Calendar, 
  User, 
  Plus, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  MessageCircle,
  Filter,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Eye,
  Star
} from "lucide-react";
import { FieldStory } from "../types";

interface FieldStoriesSectionProps {
  initialStoryPrefill?: {
    author?: string;
    country?: string;
    circuit?: string;
    content?: string;
  } | null;
  onClearPrefill?: () => void;
}

export default function FieldStoriesSection({ 
  initialStoryPrefill,
  onClearPrefill 
}: FieldStoriesSectionProps) {
  const [stories, setStories] = useState<FieldStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedStory, setSelectedStory] = useState<FieldStory | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  // Admin & Moderation Portal State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminLoginPin, setAdminLoginPin] = useState<string>("");
  const [adminLoginError, setAdminLoginError] = useState<string>("");
  const [verifiedAdminPin, setVerifiedAdminPin] = useState<string>("");
  const [moderationNotice, setModerationNotice] = useState<string | null>(null);
  const [processingStoryId, setProcessingStoryId] = useState<string | null>(null);

  // Story Form State
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [circuit, setCircuit] = useState<string>("Mount Kenya (Chogoria - Sirimon Traverse)");
  const [category, setCategory] = useState<"founder-story" | "guide-dispatch" | "behind-the-scenes" | "climbing" | "safari" | "community">("climbing");
  const [authorType, setAuthorType] = useState<"guest" | "guide" | "admin">("guest");
  const [adminPin, setAdminPin] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitFeedbackMessage, setSubmitFeedbackMessage] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  // Load Stories from Server
  const loadStories = async (adminPinCode?: string) => {
    setLoading(true);
    try {
      const url = adminPinCode 
        ? `/api/articles?includeAll=true&pin=${encodeURIComponent(adminPinCode)}`
        : "/api/articles";
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load field stories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setStories(data);
      }
    } catch (err) {
      console.warn("Could not fetch articles from server, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  // Handle prefill from Review Nudge
  useEffect(() => {
    if (initialStoryPrefill) {
      if (initialStoryPrefill.author) setAuthor(initialStoryPrefill.author);
      if (initialStoryPrefill.country) setCountry(initialStoryPrefill.country);
      if (initialStoryPrefill.circuit) setCircuit(initialStoryPrefill.circuit);
      if (initialStoryPrefill.content) {
        setContent(initialStoryPrefill.content);
        setTitle(`${initialStoryPrefill.circuit || "My Kenya Expedition"} Experience`);
      }
      setIsComposerOpen(true);
    }
  }, [initialStoryPrefill]);

  // Handle Photo Upload (Max 2 photos)
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 2) {
      setSubmitError("You can upload a maximum of 2 photos per story.");
      return;
    }

    const remainingSlots = 2 - photos.length;
    const filesToProcess: File[] = Array.from(files).slice(0, remainingSlots) as File[];

    filesToProcess.forEach((file: File) => {
      if (!file.type.startsWith("image/")) {
        setSubmitError("Please upload valid image files only (JPG, PNG, WebP).");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => {
            if (prev.length >= 2) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit new field story
  const handleSubmitStory = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!title.trim() || !author.trim() || !content.trim()) {
      setSubmitError("Please fill out the title, your name, and story content.");
      return;
    }

    if ((authorType === "admin" || authorType === "guide") && !adminPin) {
      setSubmitError("Please enter the Guide / Admin verification PIN (e.g. 2026) to publish with this badge.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          country: country || "Explorer",
          authorType,
          circuit,
          category,
          content,
          summary: summary || content.slice(0, 160) + "...",
          photos: photos.slice(0, 2),
          adminPin
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish story");
      }

      const created = await response.json();
      
      // If admin mode is active or user published with PIN, add to visible list
      if (isAdminMode || created.status === "approved") {
        setStories((prev) => [created, ...prev.filter(s => s.id !== created.id)]);
      }

      setSubmitFeedbackMessage(
        created.message || (
          created.status === "approved"
            ? "Published live! Your official dispatch is live on the expedition board."
            : "Asante Sana! Your expedition story has been received and queued for review. It will appear publicly once vetted by Cool J."
        )
      );
      setSubmitSuccess(true);

      setTimeout(() => {
        setIsComposerOpen(false);
        setSubmitSuccess(false);
        setSubmitFeedbackMessage("");
        // Reset fields
        setTitle("");
        setContent("");
        setSummary("");
        setPhotos([]);
        setAdminPin("");
        if (onClearPrefill) onClearPrefill();
      }, 2500);

    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong while publishing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Portal Login
  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAdminLoginError("");

    if (adminLoginPin !== "2026" && adminLoginPin !== "coolj2026") {
      setAdminLoginError("Invalid PIN. Please enter the authorized Cool J staff PIN (e.g. 2026).");
      return;
    }

    setVerifiedAdminPin(adminLoginPin);
    setIsAdminMode(true);
    setIsAdminModalOpen(false);
    setAdminLoginPin("");
    await loadStories(adminLoginPin);
    setModerationNotice("Admin Vetting Portal Unlocked: You can now review pending guest submissions, approve, feature, or delete posts.");
    setTimeout(() => setModerationNotice(null), 6000);
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setVerifiedAdminPin("");
    setActiveFilter("all");
    loadStories(); // reload public stories
  };

  // Moderate Story Status (Approve / Reject)
  const handleModerateStatus = async (storyId: string, newStatus: "approved" | "rejected" | "pending") => {
    if (!verifiedAdminPin) return;
    setProcessingStoryId(storyId);

    try {
      const res = await fetch(`/api/articles/${storyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: verifiedAdminPin,
          status: newStatus
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update story status");
      }

      setStories((prev) => prev.map((s) => s.id === storyId ? { ...s, status: newStatus } : s));
      
      setModerationNotice(`Story marked as '${newStatus.toUpperCase()}' successfully.`);
      setTimeout(() => setModerationNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || "Could not update story status");
    } finally {
      setProcessingStoryId(null);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (story: FieldStory) => {
    if (!verifiedAdminPin) return;
    const newFeatured = !story.isFeatured;
    setProcessingStoryId(story.id);

    try {
      const res = await fetch(`/api/articles/${story.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: verifiedAdminPin,
          isFeatured: newFeatured
        })
      });

      if (!res.ok) throw new Error("Failed to toggle featured status");
      
      setStories((prev) => prev.map((s) => s.id === story.id ? { ...s, isFeatured: newFeatured } : s));
    } catch (err: any) {
      alert(err.message || "Failed to update featured flag");
    } finally {
      setProcessingStoryId(null);
    }
  };

  // Delete Story
  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (!verifiedAdminPin) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${storyTitle}"?`)) return;

    setProcessingStoryId(storyId);
    try {
      const res = await fetch(`/api/articles/${storyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: verifiedAdminPin })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete story");
      }

      setStories((prev) => prev.filter((s) => s.id !== storyId));
      if (selectedStory?.id === storyId) setSelectedStory(null);

      setModerationNotice(`Story "${storyTitle}" was permanently deleted.`);
      setTimeout(() => setModerationNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || "Could not delete story");
    } finally {
      setProcessingStoryId(null);
    }
  };

  // Like Article
  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedStories[id]) return;

    setLikedStories((prev) => ({ ...prev, [id]: true }));
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, likesCount: s.likesCount + 1 } : s))
    );

    try {
      await fetch(`/api/articles/${id}/like`, { method: "POST" });
    } catch (err) {
      console.warn("Could not sync like to server:", err);
    }
  };

  // Count pending stories for admin badge
  const pendingCount = stories.filter((s) => s.status === "pending").length;

  // Filtered stories
  const filteredStories = stories.filter((story) => {
    if (activeFilter === "pending") return story.status === "pending";
    if (activeFilter === "all") return true;
    if (activeFilter === "founder") return story.category === "founder-story";
    if (activeFilter === "dispatches") return story.category === "guide-dispatch" || story.authorType === "guide" || story.authorType === "admin";
    if (activeFilter === "climbing") return story.category === "climbing";
    if (activeFilter === "safari") return story.category === "safari";
    if (activeFilter === "community") return story.category === "community";
    return true;
  });

  return (
    <section id="field-stories" className="py-20 px-4 bg-[#F8F5EE] border-t border-[#E5DEC9] text-[#1A1A1A] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Moderation Toast Notice */}
        {moderationNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0B3D2E] text-white border border-[#C9A24A] shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#C9A24A] shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{moderationNotice}</span>
            </div>
            <button 
              onClick={() => setModerationNotice(null)}
              className="text-white/70 hover:text-white text-xs font-mono font-bold uppercase cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D2E]/10 border border-[#0B3D2E]/20 text-[#0B3D2E] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <BookOpen className="h-3.5 w-3.5 text-[#C9A24A]" />
              Authentic Trail Dispatches & Founder Stories
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B3D2E] tracking-tight font-serif">
              Expedition Field Notes & Stories
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mt-2 leading-relaxed">
              Founder reflections on why we started, real summit journals, high-altitude wisdom, wildlife encounters, and community dispatches vetted by Cool J's mountain crew.
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Guide / Admin Portal Lock Toggle */}
            {isAdminMode ? (
              <button
                onClick={handleAdminLogout}
                className="bg-emerald-900/90 hover:bg-emerald-950 text-[#C9A24A] border border-[#C9A24A]/60 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                title="Exit Admin Vetting Mode"
              >
                <ShieldCheck className="h-4 w-4 text-[#C9A24A]" />
                <span>Admin Vetting Active (Lock)</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setAdminLoginError("");
                  setIsAdminModalOpen(true);
                }}
                className="bg-white hover:bg-[#EDE6D8] text-[#0B3D2E] border border-[#DDD5C7] font-bold px-4 py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                title="Review and vet pending guest posts"
                id="staff-vetting-portal-btn"
              >
                <Lock className="h-3.5 w-3.5 text-[#C9A24A]" />
                <span>Staff Vetting Portal</span>
              </button>
            )}

            <button
              onClick={() => {
                setSubmitError("");
                setIsComposerOpen(true);
              }}
              className="bg-[#0B3D2E] hover:bg-[#124D3C] text-[#FAF8F5] border-2 border-[#C9A24A] font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              id="write-field-story-btn"
            >
              <PenTool className="h-4 w-4 text-[#C9A24A]" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          
          {/* Admin Pending Filter Tab (Visible when Admin Mode is active or pending exists) */}
          {isAdminMode && (
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "pending"
                  ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-400"
                  : "bg-amber-100/80 text-amber-950 hover:bg-amber-200 border border-amber-300"
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-amber-900" />
              <span>Pending Review Queue ({pendingCount})</span>
            </button>
          )}

          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#0B3D2E] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-[#EDE6D8] border border-[#DDD5C7]"
            }`}
          >
            All Published ({stories.filter(s => s.status !== "pending").length})
          </button>

          <button
            onClick={() => setActiveFilter("founder")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "founder"
                ? "bg-[#0B3D2E] text-[#C9A24A] border-2 border-[#C9A24A] shadow-sm"
                : "bg-white text-amber-950 hover:bg-[#EDE6D8] border border-[#DDD5C7]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
            Founder's Vision & Heritage
          </button>
          <button
            onClick={() => setActiveFilter("dispatches")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "dispatches"
                ? "bg-[#0B3D2E] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-[#EDE6D8] border border-[#DDD5C7]"
            }`}
          >
            <Award className="h-3.5 w-3.5 text-[#C9A24A]" />
            Guide Dispatches
          </button>
          <button
            onClick={() => setActiveFilter("climbing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "climbing"
                ? "bg-[#0B3D2E] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-[#EDE6D8] border border-[#DDD5C7]"
            }`}
          >
            <Mountain className="h-3.5 w-3.5 text-[#C9A24A]" />
            Summit Diaries
          </button>
          <button
            onClick={() => setActiveFilter("safari")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "safari"
                ? "bg-[#0B3D2E] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-[#EDE6D8] border border-[#DDD5C7]"
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-[#C9A24A]" />
            Safari & Forest Trails
          </button>
          <button
            onClick={() => setActiveFilter("community")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "community"
                ? "bg-[#0B3D2E] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-[#EDE6D8] border border-[#DDD5C7]"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#C9A24A]" />
            Community & Boxing
          </button>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 border border-[#E5DEC9] p-6 flex flex-col justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-20 bg-gray-100 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E5DEC9] max-w-lg mx-auto">
            <BookOpen className="h-12 w-12 text-[#C9A24A] mx-auto mb-3 opacity-60" />
            <h4 className="text-lg font-bold text-[#0B3D2E]">
              {activeFilter === "pending" ? "No pending stories to review" : "No stories found in this category"}
            </h4>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              {activeFilter === "pending" 
                ? "All guest submissions have been reviewed and published live!" 
                : "Be the very first explorer to publish a story or trail dispatch here!"}
            </p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="bg-[#0B3D2E] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#124D3C] transition-colors cursor-pointer"
            >
              Write First Story
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => {
              const isGuide = story.authorType === "guide" || story.authorType === "admin";
              const isLiked = likedStories[story.id];
              const isPending = story.status === "pending";

              return (
                <article
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden group cursor-pointer relative ${
                    isPending 
                      ? "border-amber-400 bg-amber-50/30 ring-1 ring-amber-300" 
                      : "border-[#E5DEC9] hover:border-[#C9A24A]"
                  }`}
                  id={`article-card-${story.id}`}
                >
                  {/* Photo Preview Top (if exists) */}
                  {story.photos && story.photos.length > 0 && (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 border-b border-gray-100">
                      <img
                        src={story.photos[0]}
                        alt={story.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        {isPending ? (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm bg-amber-500 text-black border border-amber-600 animate-pulse flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Pending Review
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                            story.category === "founder-story"
                              ? "bg-[#0B3D2E] text-[#C9A24A] border border-[#C9A24A] ring-1 ring-[#C9A24A]/50"
                              : isGuide 
                              ? "bg-[#0B3D2E] text-[#C9A24A] border border-[#C9A24A]/40" 
                              : "bg-black/75 text-white backdrop-blur-sm"
                          }`}>
                            {story.category === "founder-story" 
                              ? "🌟 Founder's Story & Vision" 
                              : isGuide 
                              ? "★ Lead Guide Dispatch" 
                              : "Guest Explorer"}
                          </span>
                        )}
                        {story.photos.length === 2 && (
                          <span className="text-[10px] font-mono bg-white/90 text-gray-800 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm flex items-center gap-1 font-bold">
                            <Camera className="h-3 w-3" /> 2 Photos
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {story.readTimeMinutes} min read
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Badge if no photo */}
                      {(!story.photos || story.photos.length === 0) && (
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {isPending ? (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-black animate-pulse flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Pending Review
                            </span>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              story.category === "founder-story"
                                ? "bg-[#0B3D2E] text-[#C9A24A] border border-[#C9A24A]/50"
                                : isGuide ? "bg-[#0B3D2E] text-[#C9A24A]" : "bg-[#F3EFE8] text-gray-700"
                            }`}>
                              {story.category === "founder-story" ? "🌟 Founder's Story" : isGuide ? "★ Official Dispatch" : "Guest Story"}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {story.readTimeMinutes} min read
                          </span>
                        </div>
                      )}

                      {/* Route Tag */}
                      <span className="text-[11px] font-mono font-bold text-[#8F5C38] uppercase tracking-wider block mb-1.5 line-clamp-1">
                        📍 {story.circuit}
                      </span>

                      {/* Title */}
                      <h3 className="font-serif font-black text-lg text-[#0B3D2E] leading-snug group-hover:text-[#C9A24A] transition-colors mb-2 line-clamp-2">
                        {story.title}
                      </h3>

                      {/* Summary / Excerpt */}
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4 font-normal">
                        {story.summary || story.content}
                      </p>
                    </div>

                    {/* Footer Metadata & Actions */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0B3D2E] text-[#C9A24A] flex items-center justify-center font-black text-xs shrink-0">
                            {story.author.charAt(0)}
                          </div>
                          <div className="leading-tight">
                            <span className="block text-xs font-bold text-gray-900 truncate max-w-[120px]">
                              {story.author}
                            </span>
                            <span className="block text-[10px] text-gray-500 font-mono">
                              {story.country || "Explorer"} • {story.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleLike(story.id, e)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              isLiked
                                ? "bg-rose-50 text-rose-600 border border-rose-200 scale-105"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200 hover:text-rose-500"
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                            <span>{story.likesCount}</span>
                          </button>
                        </div>
                      </div>

                      {/* ADMIN MODERATION CONTROLS (Visible when Admin Mode is active) */}
                      {isAdminMode && (
                        <div 
                          className="pt-2 border-t border-amber-200 flex flex-wrap items-center justify-between gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1.5">
                            {isPending ? (
                              <button
                                type="button"
                                disabled={processingStoryId === story.id}
                                onClick={() => handleModerateStatus(story.id, "approved")}
                                className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                                title="Approve this post to make it visible on the public feed"
                              >
                                <Check className="h-3 w-3" /> Approve Live
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={processingStoryId === story.id}
                                onClick={() => handleModerateStatus(story.id, "pending")}
                                className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-medium transition-colors cursor-pointer"
                                title="Unpublish and move back to review queue"
                              >
                                Move to Queue
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={processingStoryId === story.id}
                              onClick={() => handleToggleFeatured(story)}
                              className={`p-1 rounded-md text-[10px] transition-colors cursor-pointer ${
                                story.isFeatured 
                                  ? "bg-amber-100 text-amber-900 border border-amber-300" 
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                              title={story.isFeatured ? "Featured Story (Click to unfeature)" : "Click to Feature on top"}
                            >
                              <Star className={`h-3.5 w-3.5 ${story.isFeatured ? "fill-amber-500 text-amber-600" : ""}`} />
                            </button>
                          </div>

                          <button
                            type="button"
                            disabled={processingStoryId === story.id}
                            onClick={() => handleDeleteStory(story.id, story.title)}
                            className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Delete this story permanently"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. ADMIN PIN LOGIN MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAdminModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAdminModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#C9A24A] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-[#C9A24A]" />
                <h3 className="text-lg font-bold font-serif text-[#0B3D2E]">Staff & Guide Portal</h3>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-5">
              Enter the Cool J Expeditions staff PIN to review and vet guest stories before they go live, publish official dispatches, or manage the expedition feed.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Authorization PIN (e.g. 2026)
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter 4-digit PIN (2026)"
                  value={adminLoginPin}
                  onChange={(e) => setAdminLoginPin(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl p-3 text-sm font-mono text-center tracking-widest text-[#0B3D2E] focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                />
              </div>

              {adminLoginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{adminLoginError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0B3D2E] hover:bg-[#124D3C] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Unlock className="h-3.5 w-3.5 text-[#C9A24A]" />
                  <span>Unlock Vetting Mode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. STORY READER MODAL (FULL ARTICLE VIEW) */}
      {/* ------------------------------------------------------------- */}
      {selectedStory && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedStory(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C9A24A]/40 my-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                {selectedStory.status === "pending" ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-black">
                    ⏳ Pending Review (Hidden from Public)
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    selectedStory.authorType === "guide" || selectedStory.authorType === "admin"
                      ? "bg-[#0B3D2E] text-[#C9A24A]"
                      : "bg-[#F3EFE8] text-gray-800"
                  }`}>
                    {selectedStory.authorType === "guide" ? "★ Lead Guide Dispatch" : selectedStory.authorType === "admin" ? "★ Official Desk" : "Guest Explorer Article"}
                  </span>
                )}
                <span className="text-xs text-gray-400 font-mono">
                  {selectedStory.readTimeMinutes} min read
                </span>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Circuit Category */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  selectedStory.category === "founder-story"
                    ? "bg-[#0B3D2E] text-[#C9A24A] border border-[#C9A24A]"
                    : selectedStory.authorType !== "guest"
                    ? "bg-[#0B3D2E] text-[#C9A24A]"
                    : "bg-[#EFE9DC] text-[#0B3D2E]"
                }`}>
                  {selectedStory.category === "founder-story"
                    ? "🌟 Founder's Story & Vision"
                    : selectedStory.authorType !== "guest"
                    ? "★ Lead Guide Dispatch"
                    : "🎒 Guest Story"}
                </span>
                <span className="text-xs font-mono font-bold text-[#8F5C38] uppercase tracking-wider">
                  📍 {selectedStory.circuit}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-[#0B3D2E] leading-tight mb-4">
                {selectedStory.title}
              </h2>

              {/* Author Strip */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B3D2E] text-[#C9A24A] font-black flex items-center justify-center text-sm shadow-inner">
                    {selectedStory.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      {selectedStory.author}
                      {selectedStory.authorType !== "guest" && (
                        <ShieldCheck className="h-4 w-4 text-[#C9A24A]" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {selectedStory.country || "Explorer"} • Published on {selectedStory.date}
                    </div>
                  </div>
                </div>

                {/* Admin Quick Actions inside reader */}
                {isAdminMode && (
                  <div className="flex items-center gap-2">
                    {selectedStory.status === "pending" && (
                      <button
                        onClick={() => handleModerateStatus(selectedStory.id, "approved")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve & Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteStory(selectedStory.id, selectedStory.title)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Story
                    </button>
                  </div>
                )}
              </div>

              {/* Dual Photo Gallery (Max 2 Photos) */}
              {selectedStory.photos && selectedStory.photos.length > 0 && (
                <div className={`grid gap-4 mb-8 ${selectedStory.photos.length === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                  {selectedStory.photos.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden shadow-md bg-gray-100 aspect-video group">
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1} from ${selectedStory.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                        Photo {idx + 1} of {selectedStory.photos.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Body Text */}
              <div className="text-gray-800 text-sm sm:text-base leading-relaxed space-y-4 font-normal whitespace-pre-line">
                {selectedStory.content}
              </div>

              {/* Story Footer Controls */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleLike(selectedStory.id, e)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      likedStories[selectedStory.id]
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:text-rose-600"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedStories[selectedStory.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{selectedStory.likesCount} Explorer Likes</span>
                  </button>

                  <a
                    href={`https://wa.me/254720572251?text=Jambo%20Cool%20J!%20I%20just%20read%20the%20story%20"%20${encodeURIComponent(selectedStory.title)}%20"%20and%20would%20love%20to%20plan%20a%20similar%20trip.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span>Inquire About This Circuit</span>
                  </a>
                </div>

                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. STORY COMPOSER MODAL (GUEST & ADMIN 2-PHOTO SUBMISSION) */}
      {/* ------------------------------------------------------------- */}
      {isComposerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsComposerOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C9A24A] my-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0B3D2E] text-white px-6 py-4 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-[#C9A24A]" />
                <h3 className="text-base font-bold font-serif text-[#FAF8F5]">Publish a Field Story or Dispatch</h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitStory} className="p-6 sm:p-8 space-y-5">
              
              {/* Submission Mode Selector (Guest vs Lead Guide / Admin) */}
              <div className="bg-[#F8F5EE] p-3.5 rounded-xl border border-[#E5DEC9] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider block">
                    Author Mode:
                  </label>
                  <span className="text-[10px] text-gray-500">
                    {authorType === "guide" || authorType === "admin" 
                      ? "Admin / Lead Guide: write founder reflections & dispatches (published immediately with PIN)" 
                      : "Guest Explorer: share your trek review (vetted by Cool J before going live)"}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthorType("guest");
                      setAdminPin("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authorType === "guest"
                        ? "bg-[#0B3D2E] text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    🎒 Guest Explorer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthorType("guide");
                      if (!author) setAuthor("John Mwangi (Cool J)");
                      if (!country) setCountry("Kenya (Nanyuki)");
                      setCategory("founder-story");
                      setCircuit("Founder's Journey: Why I Started Cool J Expeditions");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authorType === "guide" || authorType === "admin"
                        ? "bg-[#C9A24A] text-[#0B3D2E] shadow-sm font-black ring-2 ring-[#0B3D2E]/20"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    ★ Lead Guide / Admin
                  </button>
                </div>
              </div>

              {/* Quick Template Prompts for Admin / Founder */}
              {(authorType === "guide" || authorType === "admin") && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-gray-500 font-bold text-[10px] uppercase shrink-0">Quick Topics:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("Why I Started Cool J Expeditions: Our Mission & Porter Brotherhood");
                      setCategory("founder-story");
                      setCircuit("Founder's Journey: Why I Started Cool J Expeditions");
                    }}
                    className="px-2.5 py-1 rounded-full bg-amber-100/70 hover:bg-amber-100 text-amber-900 border border-amber-300 shrink-0 font-medium cursor-pointer"
                  >
                    🌟 Why I Started the Business
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("Behind the Scenes: A Day in the Life of Our Mountain Crew");
                      setCategory("behind-the-scenes");
                      setCircuit("Behind the Scenes: Life on the Trail with Mountain Crew");
                    }}
                    className="px-2.5 py-1 rounded-full bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0 font-medium cursor-pointer"
                  >
                    🧭 Life on the Trail & Crew
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("Guide Dispatch: High Altitude Safety & Acclimatization Rules");
                      setCategory("guide-dispatch");
                      setCircuit("Mount Kenya (Chogoria - Sirimon Traverse)");
                    }}
                    className="px-2.5 py-1 rounded-full bg-blue-100/70 hover:bg-blue-100 text-blue-900 border border-blue-300 shrink-0 font-medium cursor-pointer"
                  >
                    📜 High-Altitude Safety Notes
                  </button>
                </div>
              )}

              {/* Admin Verification Pin if selected */}
              {(authorType === "guide" || authorType === "admin") && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-amber-900">
                      🔐 Lead Guide & Admin Passcode
                    </label>
                    <span className="text-[10px] text-amber-700/80 font-mono">Restricted to Cool J Staff (e.g. 2026)</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter private authorization PIN (e.g. 2026)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                  />
                  <p className="text-[10px] text-gray-500">
                    Required to publish with the verified "★ Founder's Story & Vision" or "★ Lead Guide Dispatch" badge without going into pending review.
                  </p>
                </div>
              )}

              {/* Story Title */}
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Story Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    category === "founder-story"
                      ? "e.g. Why I Started Cool J Expeditions: From Mountain Porter to Lead Guide"
                      : "e.g. Sunrise at Point Lenana: A Frosty Morning Triumph"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#DDD5C7] rounded-xl p-3 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                />
              </div>

              {/* Author & Country */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                    Your Name / Explorer Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Mwangi (Cool J) or Elena Rostova"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl p-2.5 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                    Country / City of Origin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kenya (Nanyuki), Germany, UK, USA"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl p-2.5 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                  />
                </div>
              </div>

              {/* Circuit & Category */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                    Expedition / Route / Topic *
                  </label>
                  <select
                    value={circuit}
                    onChange={(e) => setCircuit(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl p-2.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                  >
                    <optgroup label="🌟 Founder's Story & Business Vision">
                      <option value="Founder's Journey: Why I Started Cool J Expeditions">Founder's Journey: Why I Started Cool J Expeditions</option>
                      <option value="20+ Years On High Mountain Peaks (Founding Heritage)">20+ Years On High Mountain Peaks (Founding Heritage)</option>
                      <option value="Guiding Philosophy: Living Wages & Porter Brotherhood">Guiding Philosophy: Living Wages & Porter Brotherhood</option>
                      <option value="Behind the Scenes: Life on the Trail with Mountain Crew">Behind the Scenes: Life on the Trail with Mountain Crew</option>
                    </optgroup>

                    <optgroup label="⛰️ Mount Kenya High Altitude Summits">
                      <option value="Mount Kenya (Chogoria - Sirimon Traverse)">Mount Kenya (Chogoria - Sirimon Traverse)</option>
                      <option value="Mount Kenya Sirimon Ascent (Point Lenana)">Mount Kenya Sirimon Ascent (Point Lenana)</option>
                      <option value="Mount Kenya Burguret Wilderness Route">Mount Kenya Burguret Wilderness Route</option>
                      <option value="Mount Kenya Technical Climbs (Batian & Nelion)">Mount Kenya Technical Climbs (Batian & Nelion)</option>
                    </optgroup>

                    <optgroup label="🦁 Wildlife Safaris & Great Rift Valley">
                      <option value="Masai Mara Migration Circuit">Masai Mara Migration Circuit</option>
                      <option value="Ol Pejeta & Sweetwaters Rhino Sanctuary">Ol Pejeta & Sweetwaters Rhino Sanctuary</option>
                      <option value="Samburu & Buffalo Springs Reserve">Samburu & Buffalo Springs Reserve</option>
                      <option value="Amboseli National Park & Kilimanjaro Views">Amboseli National Park & Kilimanjaro Views</option>
                      <option value="Lake Nakuru & Naivasha / Hell's Gate Gorge">Lake Nakuru & Naivasha / Hell's Gate Gorge</option>
                    </optgroup>

                    <optgroup label="🌲 Forests, Day Treks & Regional Expeditions">
                      <option value="Ngare Ndare Forest Canopy & Waterfalls">Ngare Ndare Forest Canopy & Waterfalls</option>
                      <option value="Laikipia Community & Boxing Outreach">Laikipia Community & Boxing Outreach</option>
                      <option value="Tanzania Kilimanjaro & Serengeti">Tanzania Kilimanjaro & Serengeti</option>
                      <option value="Uganda Bwindi Mountain Gorilla Trekking">Uganda Bwindi Mountain Gorilla Trekking</option>
                      <option value="Custom Trail / Personal Reflection">Custom Trail / Personal Reflection</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                    Category / Type *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl p-2.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A24A]"
                  >
                    <option value="founder-story">🌟 Founder's Story & Vision (Why I Started)</option>
                    <option value="behind-the-scenes">🧭 Behind the Scenes & Life on Trail</option>
                    <option value="guide-dispatch">📜 Official Guide Field Notes & Safety</option>
                    <option value="climbing">⛰️ Mountain Climbing & Summits</option>
                    <option value="safari">🦁 Wildlife Safaris & Nature</option>
                    <option value="community">🤝 Community & Youth Empowerment</option>
                  </select>
                </div>
              </div>

              {/* Story Content Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
                    Your Field Story & Advice *
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {content.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Describe your moments on the trail, what gear helped, the summit push, wildlife encounters, or guide hospitality..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white border border-[#DDD5C7] rounded-xl p-3 text-xs sm:text-sm font-normal text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A24A] leading-relaxed"
                />
              </div>

              {/* 2-PHOTO UPLOAD SECTION */}
              <div className="bg-[#FAF8F5] border border-[#E5DEC9] rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-[#C9A24A]" />
                    Upload Expedition Photos (Maximum 2 Photos)
                  </label>
                  <span className="text-[10px] font-mono font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {photos.length} / 2 uploaded
                  </span>
                </div>

                {/* Upload Button & Dropzone */}
                {photos.length < 2 && (
                  <label className="border-2 border-dashed border-[#DDD5C7] hover:border-[#C9A24A] bg-white rounded-xl p-4 text-center block cursor-pointer transition-colors group">
                    <div className="flex flex-col items-center justify-center gap-1 text-gray-500 group-hover:text-[#0B3D2E]">
                      <Plus className="h-5 w-5 text-[#C9A24A]" />
                      <span className="text-xs font-bold">Click to select photo {photos.length + 1}</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP from your phone or camera</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Photo Previews */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {photos.map((p, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video group">
                        <img src={p} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          Photo {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vetting info banner */}
              {authorType === "guest" && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    To maintain trail safety and quality, all guest stories are vetted by Cool J's team before going live on the public expedition board.
                  </span>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                  {submitError}
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-emerald-950 mb-0.5">Story Received Successfully!</div>
                    <div className="font-normal text-emerald-800">{submitFeedbackMessage}</div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="bg-[#0B3D2E] hover:bg-[#124D3C] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  id="publish-article-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin text-sm">⏳</span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
                      <span>{authorType === "guest" ? "Submit Story for Review" : "Publish Dispatch Live"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}
