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
  Star,
  Loader2,
  MessageSquare,
  ThumbsUp,
  Calculator,
  ArrowRight
} from "lucide-react";
import { FieldStory } from "../types";
import { scrollToTargetSection } from "../utils/navigation";
import coolJClean from "../assets/images/cool-j.jpg";
import summitClean from "../assets/images/mt-kenya-summit.jpg";
import ebolaImg from "../assets/images/ebola-virus.jpg";
import mfalmeImg from "../assets/images/mfalme-ukweli.png";
import lenanaPeakImg from "../assets/images/point-lenana-peak-sign.jpg";
import shiptonsCampImg from "../assets/images/trekking-team-resting.jpg";
import ngareNdareImg from "../assets/images/ngare_ndare.jpg";
import climbersGroupImg from "../assets/images/happy-group-of-climbers.jpg";
import coolJTouristsImg from "../assets/images/cool_j_with_happy_tourists.jpg";
import boxingClubImg from "../assets/images/nanyuki_good_times_boxing.jpg";

const coolJPhoto = coolJClean || "/assets/images/cool-j.jpg";
const summitPhoto = summitClean || "/assets/images/mt-kenya-summit.jpg";

interface FieldStoriesSectionProps {
  initialStoryPrefill?: {
    author?: string;
    country?: string;
    circuit?: string;
    content?: string;
  } | null;
  onClearPrefill?: () => void;
}

export const resolveStoryPhoto = (photoUrl?: string, storyTitle?: string, index: number = 0): string => {
  const titleLower = (storyTitle || "").toLowerCase();
  const urlLower = (photoUrl || "").toLowerCase();

  // Keyword checks on URL
  if (urlLower.includes("ebola")) return ebolaImg;
  if (urlLower.includes("mfalme")) return mfalmeImg;
  if (urlLower.includes("lenana") || urlLower.includes("peak-sign") || urlLower.includes("point-lenana")) return lenanaPeakImg;
  if (urlLower.includes("shipton") || urlLower.includes("trekking-team") || urlLower.includes("resting")) return shiptonsCampImg;
  if (urlLower.includes("ngare") || urlLower.includes("ndare") || urlLower.includes("canopy")) return ngareNdareImg;
  if (urlLower.includes("group") || urlLower.includes("climbers")) return climbersGroupImg;
  if (urlLower.includes("cool_j_with_happy") || urlLower.includes("tourists")) return coolJTouristsImg;
  if (urlLower.includes("cool j") || urlLower.includes("cool-j") || urlLower.includes("mwangi")) return coolJPhoto;
  if (urlLower.includes("summit") || urlLower.includes("hero banner")) return summitPhoto;

  // Title / topic based resolution to authentic photos
  if (titleLower.includes("lenana") || titleLower.includes("4,985") || titleLower.includes("sunrise")) {
    return index === 0 ? lenanaPeakImg : summitPhoto;
  }
  if (titleLower.includes("shipton") || titleLower.includes("acclimatiz") || titleLower.includes("dispatch")) {
    return index === 0 ? shiptonsCampImg : climbersGroupImg;
  }
  if (titleLower.includes("ngare") || titleLower.includes("canopy") || titleLower.includes("waterfall")) {
    return index === 0 ? ngareNdareImg : coolJTouristsImg;
  }
  if (titleLower.includes("boxing") || titleLower.includes("youth") || titleLower.includes("community") || urlLower.includes("boxing")) {
    return index === 0 ? (boxingClubImg || "/assets/images/nanyuki_good_times_boxing.jpg") : coolJPhoto;
  }
  if (titleLower.includes("founder") || titleLower.includes("why i founded") || titleLower.includes("cool j")) {
    return index === 0 ? coolJPhoto : summitPhoto;
  }
  if (titleLower.includes("ebola")) {
    return index === 0 ? ebolaImg : mfalmeImg;
  }

  // If user uploaded data URL or blob, or remote http URL
  if (photoUrl && (photoUrl.startsWith("data:") || photoUrl.startsWith("blob:") || photoUrl.startsWith("http://") || photoUrl.startsWith("https://"))) {
    return photoUrl;
  }

  // If local /assets/ path provided, return it
  if (photoUrl && photoUrl.startsWith("/assets/")) {
    return photoUrl;
  }

  return index === 0 ? coolJPhoto : summitPhoto;
};

const getAuthorAvatar = (authorName: string): string | null => {
  const lower = (authorName || "").toLowerCase();
  if (lower.includes("mfalme") || lower.includes("ukweli")) {
    return mfalmeImg;
  }
  if (lower.includes("mwangi") || lower.includes("cool j")) {
    return coolJPhoto;
  }
  return null;
};

const DEFAULT_STORIES: FieldStory[] = [
  {
    id: "story-ebola-advisory-mfalme",
    title: "East Africa Health & Safety Advisory: The Regional Ebola Context, Kenya's Contained Case & Visitor Protection Guarantees",
    author: "Mfalme Ukweli (Team Member, Cool J Expeditions)",
    country: "Kenya (Cool J Operations & Safety Desk)",
    authorType: "guide",
    circuit: "East Africa Travel Advisory & Field Health Protocols",
    category: "guide-dispatch",
    readTimeMinutes: 4,
    summary: "Official dispatch by Cool J Expeditions team member Mfalme Ukweli addressing the regional Ebola situation in East Africa, the facts surrounding the single isolated case identified in Kenya, and our multi-layered protocols ensuring every visitor stays safe, protected, and cared for.",
    content: "Jambo travelers and dear explorers,\n\nI am Mfalme Ukweli, a proud team member of Cool J Expeditions. As part of our leadership and field operations team, my number one responsibility—alongside our founder John Mwangi (Cool J)—is ensuring that every guest steps into Kenya with complete peace of mind, scientific clarity, and uncompromising safety.\n\nWith news circulating regarding the Ebola situation in parts of East Africa, we believe in total transparency rather than silence. Here is the accurate, up-to-date situation on the ground, the facts regarding Kenya, and the concrete protective measures Cool J Expeditions enforces for every single traveler.\n\n### 1. The Regional Context in East Africa\nOver recent months, regional health authorities and the World Health Organization (WHO AFRO) have maintained active surveillance around historical cross-border corridors in neighboring Uganda and the DRC. Both regional governments and international health teams have deployed rapid-response contact tracing and surveillance infrastructure far superior to previous decades. East African borders and international airports operate with enhanced thermal screening and digital health manifests.\n\n### 2. The Single Case Identified in Kenya: Swift Containment & Zero Spread\nRecently, one isolated case was identified at a medical screening facility in Kenya. Here is what international visitors must know:\n- Immediate Isolation: The individual was identified early and immediately admitted to a specialized, secure high-containment infectious disease unit in Nairobi.\n- Extensive Contact Tracing: The Kenya Ministry of Health, in direct coordination with the WHO, executed exhaustive contact tracing.\n- Zero Community Transmission: No secondary infections or community transmissions have been detected anywhere in Kenya.\n- Open & Normal Operations: Kenya's national parks, Mount Kenya trails, wildlife conservancies in Laikipia and Samburu, and international transit hubs remain fully open, safe, and operating normally under standard global health standards.\n\n### 3. How Cool J Expeditions Protects Our Visitors\nAt Cool J Expeditions, we don't just follow government minimums—we hold ourselves to a gold standard of mountain and safari hygiene:\n\n1. Exclusive Private 4x4 Land Cruisers (No Crowded Tour Buses): We never pack 30 strangers into shared buses. Your expedition vehicle is reserved solely for your private group or family, thoroughly sanitized inside and out before your arrival and wiped down daily with hospital-grade disinfectants.\n2. Hand Sanitization & Hygiene Stations: Every Cool J safari vehicle, mountain mess tent, and camp check-in is equipped with automatic/touch-free hand sanitizer dispensers (70%+ alcohol) and clean washing stations.\n3. Health-Screened & Certified Field Crew: All our lead guides, safari drivers, mountain chefs, and porters undergo daily non-invasive wellness checks and temperature monitoring. Our crew is trained in international WHO food hygiene and biosafety standards.\n4. Pure Mountain Water & Sealed Dining: Our mountain cooks only serve thoroughly cooked, hot meals prepared in sanitized mobile camp kitchens. All drinking water is boiled and micro-filtered, and fresh produce is sourced from verified organic farms and washed with purified water.\n5. AMREF Flying Doctors Emergency Evacuation: Every high-altitude Mount Kenya summit trek and remote wilderness safari includes pre-arranged medical evacuation coverage. In the rare event an explorer feels unwell, emergency airlift response to premier tertiary medical centers in Nairobi is guaranteed.\n6. 100% Flexible Rebooking Policy: If travel regulations change or you ever feel hesitant, Cool J Expeditions offers seamless date changes without punitive cancellation penalties.\n\nYour safety is not an afterthought—it is the foundation of every summit triumph and savanna memory we create together. If you have questions before landing at JKIA, reach out to me or Cool J directly on WhatsApp at +254 720 572 251.\n\nKaribuni Kenya, walk with confidence, and let's explore this magnificent land together safely!\n\n— Mfalme Ukweli\nTeam Member & Operations Desk\nCool J Expeditions — Nanyuki, Mount Kenya",
    photos: [
      "/assets/images/ebola-virus.jpg",
      "/assets/images/mfalme-ukweli.png"
    ],
    date: "2026-10-08",
    likesCount: 86,
    isFeatured: true,
    status: "approved"
  },
  {
    id: "story-founder-1",
    title: "Why I Founded Cool J Expeditions: 20+ Years From High Mountain Porter to Lead Expedition Leader",
    author: "John Mwangi (Cool J)",
    country: "Kenya (Nanyuki Baseline)",
    authorType: "admin",
    circuit: "Founder's Journey: Why I Started Cool J Expeditions",
    category: "founder-story",
    readTimeMinutes: 5,
    summary: "The personal story behind Cool J Expeditions: growing up in the foothills of Mount Kenya, witnessing how big agencies treated mountain crew, and building a company rooted in dignity, fair wages, and genuine brotherhood.",
    content: "Growing up in the shadow of Mount Kenya in Nanyuki, Kirinyaga (the mountain of brightness) was not just scenery—it was our backyard, our teacher, and our spirit. Over 20 years ago, I began like many young men in our community: carrying heavy packs as a mountain porter in freezing rains.\n\nDuring those early years, I saw something that stayed with me forever. Big international booking agencies were charging travelers thousands of dollars, yet the local porters and mountain cooks who carried the fuel, set up the tents in sub-zero winds, and cooked hot meals at 4,200m were often underpaid, given inadequate cold-weather gear, and treated as invisible numbers.\n\nI made a solemn promise to myself and my community: **One day, I will create an expedition outfit built on dignity, brotherhood, and supreme mountain professionalism.**\n\nWhen I founded **Cool J Expeditions**, I built it on three personal pillars:\n\n1. **Dignity & Fair Living Wages for Mountain Crews:** Every porter, chef, and assistant guide on a Cool J trek receives fair, industry-leading wages, proper high-altitude alpine gear, balanced nutrition, and full medical coverage on the mountain. When the crew is happy, well-rested, and respected, the energy on the trail is joyous, and summits are safe.\n\n2. **Private, Tailored Expeditions Over Mass Tourism:** We don't herd 30 strangers into noisy buses. Every guest gets a dedicated private 4x4 safari vehicle or personalized trekking pace. We climb *'Pole Pole'* (slowly, mindfully) because the mountain deserves reverence, not haste.\n\n3. **Reinvesting in Our Hometown:** Supporting the **Nanyuki Good Times Boxing Club** and local youth training initiatives isn't marketing—it is our duty to the young boys and girls of Laikipia County.\n\nTo every explorer who has stood with me at Point Lenana or watched elephants walk beneath Kilimanjaro: thank you for being part of our family. Karibuni sana!",
    photos: [
      "/assets/images/cool-j.jpg",
      "/assets/images/mt-kenya-summit.jpg"
    ],
    date: "2026-08-10",
    likesCount: 94,
    isFeatured: true,
    status: "approved"
  },
  {
    id: "story-1",
    title: "Sunrise at 4,985m: The Point Lenana Pre-Dawn Summit Push",
    author: "Sarah & Marcus Lindqvist",
    country: "Sweden",
    authorType: "guest",
    circuit: "Mount Kenya (Chogoria - Sirimon Traverse)",
    category: "climbing",
    readTimeMinutes: 3,
    summary: "Stepping out from Austrian Hut at 3:30 AM under a canopy of southern hemisphere stars, the glacier wind felt electric. Cool J set the pace with quiet 'Pole Pole' rhythm.",
    content: "Stepping out from the mountain shelter at 3:30 AM under a canopy of southern hemisphere stars, the glacier wind felt electric. Our lead guide Cool J set the pace with that quiet, reassuring 'Pole Pole' rhythm that kept our breathing steady. \n\nBy 6:15 AM, as the golden rim of the sun broke over the sea of clouds below Point Lenana, the entire African continent seemed to wake up beneath our feet. Mount Kilimanjaro appeared like a floating ice island 200 miles south.\n\nOur advice to anyone attempting this: trust Cool J's team on hydration, pack a quality thermal headlamp, and take in every moment of the Gorges Valley on the Chogoria descent!",
    photos: [
      "/assets/images/point-lenana-peak-sign.jpg",
      "/assets/images/mt-kenya-summit.jpg"
    ],
    date: "2026-06-12",
    likesCount: 38,
    isFeatured: true,
    status: "approved"
  },
  {
    id: "story-2",
    title: "Guide Dispatch: High-Altitude Acclimatization Wisdom from Shipton's Camp",
    author: "John Mwangi (Cool J)",
    country: "Kenya",
    authorType: "guide",
    circuit: "Mount Kenya Technical & Trekking Insights",
    category: "guide-dispatch",
    readTimeMinutes: 4,
    summary: "In 20+ years of leading summits, the secret to reaching 4,985m comfortably isn't physical brute force—it's respecting the mountain's rhythm.",
    content: "Jambo climbers! Over my two decades leading teams up Batian, Nelion, and Point Lenana, the number one mistake I see is rushing the approach. Mount Kenya is deceptive; you gain altitude very quickly from the Sirimon gate.\n\nHere are three non-negotiables we practice on every Cool J Expedition:\n1. **Climb High, Sleep Low:** On Day 3 at Shipton's Camp (4,200m), we do a gentle afternoon acclimatization hike up to Kami Tarn before descending back down to sleep.\n2. **4 Liters of Mountain Water:** Altitude strips moisture rapidly. Our camp chefs prepare warm ginger-infused lemon tea at every stop.\n3. **Proper Layering:** Temperatures swing from +22°C in the forest to -8°C at the summit ridge. Never wear cotton—stick to merino wool base layers and windproof shells.\n\nKaribu Mount Kenya—the mountain will welcome you if you walk with respect.",
    photos: [
      "/assets/images/trekking-team-resting.jpg",
      "/assets/images/happy-group-of-climbers.jpg"
    ],
    date: "2026-07-04",
    likesCount: 64,
    isFeatured: true,
    status: "approved"
  },
  {
    id: "story-4",
    title: "Empowering Local Youth: Our Partnership with Nanyuki Good Times Boxing Club",
    author: "Cool J Expeditions Community Desk",
    country: "Kenya",
    authorType: "admin",
    circuit: "Laikipia Community & Youth Empowerment",
    category: "community",
    readTimeMinutes: 3,
    summary: "Sustainable tourism means investing directly into local community talent. How your bookings support training gear and mentorship for Nanyuki youth.",
    content: "Every journey booked with Cool J Expeditions creates a ripple effect in our hometown of Nanyuki. In addition to fair wages, mountain safety gear, and healthcare for our high-altitude porter and chef collectives, we are proud long-term direct supporters of the **Nanyuki Good Times Boxing Club**.\n\nThe boxing club provides free athletic training, discipline, mentorship, and safe recreational spaces for hundreds of young boys and girls in Laikipia County. When you trek with us, a portion of our logistics proceeds helps sponsor training gloves, headgear, tournament travel, and nutritious meals for these dedicated athletes.\n\nWe welcome our visiting explorers to visit the gym or learn more via their official Facebook page!",
    photos: [
      "/assets/images/nanyuki_good_times_boxing.jpg",
      "/assets/images/cool-j.jpg"
    ],
    date: "2026-08-05",
    likesCount: 52,
    isFeatured: true,
    status: "approved"
  }
];

export interface StoryReview {
  id: string;
  storyId: string;
  authorName: string;
  country: string;
  perspective: string; // e.g. "Recently Visited Kenya", "Tour Lover / Planning Trek", "Past Explorer", "Tourism Partner"
  rating: number; // 1-5
  comment: string;
  date: string;
  helpfulCount: number;
}

export const getStoryArchetype = (story: FieldStory | null | undefined): "health-advisory" | "climbing-safari" | "community" | "founder" => {
  if (!story) return "climbing-safari";
  const idLower = (story.id || "").toLowerCase();
  const titleLower = (story.title || "").toLowerCase();
  const circuitLower = (story.circuit || "").toLowerCase();
  const categoryLower = (story.category || "").toLowerCase();

  if (
    idLower.includes("ebola") || 
    titleLower.includes("ebola") || 
    titleLower.includes("health") || 
    circuitLower.includes("health") || 
    circuitLower.includes("advisory")
  ) {
    return "health-advisory";
  }
  if (categoryLower === "community" || titleLower.includes("boxing") || circuitLower.includes("community")) {
    return "community";
  }
  if (categoryLower === "founder-story" || idLower.includes("founder") || titleLower.includes("founded") || titleLower.includes("cool j")) {
    return "founder";
  }
  return "climbing-safari";
};

const INITIAL_STORY_REVIEWS: StoryReview[] = [
  {
    id: "rev-ebola-1",
    storyId: "story-ebola-advisory-mfalme",
    authorName: "David Hendriks",
    country: "Netherlands",
    perspective: "Recently Visited Kenya (Trek Completed Oct 2026)",
    rating: 5,
    comment: "We landed at JKIA Nairobi two weeks ago for an 8-day Mount Kenya trek and Samburu safari with Cool J. Airport thermal and digital health screenings were swift, courteous, and very organized. On the trail and in our private Land Cruiser, vehicle sanitization and hot meals prepared by chef Jackson were pristine. Normal life in Kenya is vibrant, the parks are peaceful, and we felt 100% safe. Don't let alarmist rumors stop you from this magnificent trip!",
    date: "2026-10-10",
    helpfulCount: 26
  },
  {
    id: "rev-ebola-2",
    storyId: "story-ebola-advisory-mfalme",
    authorName: "Brenda Koech",
    country: "Kenya (Nanyuki Baseline)",
    perspective: "Local Tourism Partner & Field Resident",
    rating: 5,
    comment: "Kudos to Mfalme and Cool J for addressing this with scientific precision and complete transparency. The single imported case in Nairobi was isolated immediately with zero community spread. Laikipia, Mount Kenya, and the savannas are open and welcoming.",
    date: "2026-10-11",
    helpfulCount: 21
  },
  {
    id: "rev-ebola-3",
    storyId: "story-ebola-advisory-mfalme",
    authorName: "Liam & Chloe Davies",
    country: "United Kingdom",
    perspective: "Tour Lovers (Planning Dec 2026 Trek)",
    rating: 5,
    comment: "We were initially nervous after reading sensational headlines on UK forums, but this detailed breakdown and the AMREF Flying Doctors airlift guarantee gave us complete clarity. We confirmed our deposit with John and are eagerly counting down to our Chogoria traverse!",
    date: "2026-10-12",
    helpfulCount: 18
  },
  {
    id: "rev-lenana-1",
    storyId: "story-1",
    authorName: "Carlos Martinez",
    country: "Spain",
    perspective: "Summited Point Lenana (June 2026)",
    rating: 5,
    comment: "Cool J's 'pole pole' pacing was the secret to our summit! Stepping onto Point Lenana at dawn while Kilimanjaro hovered 200 miles south was unforgettable. Highest recommendation for anyone taking the Chogoria route.",
    date: "2026-06-18",
    helpfulCount: 16
  },
  {
    id: "rev-shipton-1",
    storyId: "story-2",
    authorName: "Elena Rostova",
    country: "Italy",
    perspective: "Past Guest Explorer",
    rating: 5,
    comment: "The acclimatization walk from Shipton's Camp up to Kami Tarn made our summit night feel effortless. Drink the warm ginger lemon tea as recommended—it works wonders against altitude sickness!",
    date: "2026-07-12",
    helpfulCount: 13
  },
  {
    id: "rev-boxing-1",
    storyId: "story-4",
    authorName: "Coach Peter Kamau",
    country: "Kenya (Nanyuki)",
    perspective: "Nanyuki Community Coach",
    rating: 5,
    comment: "Cool J has supported our youth boxing club for years with gloves, wraps, and tournament logistics. Travelers who choose Cool J are directly uplifting the next generation of athletes in Laikipia.",
    date: "2026-08-15",
    helpfulCount: 25
  },
  {
    id: "rev-founder-1",
    storyId: "story-founder-1",
    authorName: "Dr. Thomas Weber",
    country: "Germany",
    perspective: "Mount Kenya Repeat Climber",
    rating: 5,
    comment: "Trek with Cool J once and you will never use a big aggregator again. You see the pride in the porters and chefs because they receive fair wages and proper alpine gear. Dignity changes everything on the mountain.",
    date: "2026-08-20",
    helpfulCount: 29
  }
];

export default function FieldStoriesSection({ 
  initialStoryPrefill,
  onClearPrefill 
}: FieldStoriesSectionProps) {
  const [stories, setStories] = useState<FieldStory[]>(DEFAULT_STORIES);
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
  const [isValidatingPin, setIsValidatingPin] = useState<boolean>(false);
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

  // Story Reviews, Accounts & Reader Feedback State (Stored locally with initial verified feedback)
  const [storyReviews, setStoryReviews] = useState<StoryReview[]>(() => {
    try {
      const stored = localStorage.getItem("coolj_field_reviews_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load stored story reviews:", e);
    }
    return INITIAL_STORY_REVIEWS;
  });

  // Story Reader Feedback Form State
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>("");
  const [newReviewCountry, setNewReviewCountry] = useState<string>("");
  const [newReviewPerspective, setNewReviewPerspective] = useState<string>("Recently Visited Kenya");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState<boolean>(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string>("");
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Submit reader feedback / review for the active story
  const handleAddStoryReview = (e: FormEvent, storyId: string) => {
    e.preventDefault();
    setReviewSubmitError("");

    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      setReviewSubmitError("Please fill out your name and your feedback / review comment.");
      return;
    }

    const createdReview: StoryReview = {
      id: `rev-user-${Date.now()}`,
      storyId,
      authorName: newReviewAuthor.trim(),
      country: newReviewCountry.trim() || "Global Traveler",
      perspective: newReviewPerspective,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split("T")[0],
      helpfulCount: 1
    };

    setStoryReviews((prev) => {
      const updated = [createdReview, ...prev];
      try {
        localStorage.setItem("coolj_field_reviews_v2", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not persist review to storage:", err);
      }
      return updated;
    });

    setReviewSubmitSuccess(true);
    setNewReviewComment("");
    setNewReviewAuthor("");
    setNewReviewCountry("");

    setTimeout(() => {
      setReviewSubmitSuccess(false);
      setShowReviewForm(false);
    }, 3500);
  };

  // Toggle helpful like on an account/review
  const handleToggleHelpful = (reviewId: string) => {
    if (helpfulLiked[reviewId]) return;
    setHelpfulLiked((prev) => ({ ...prev, [reviewId]: true }));
    setStoryReviews((prev) => {
      const updated = prev.map((r) => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r);
      try {
        localStorage.setItem("coolj_field_reviews_v2", JSON.stringify(updated));
      } catch (err) {
        // ignore
      }
      return updated;
    });
  };

  // Open / Close Story Reader with URL Deep-Linking state
  const openStoryReader = (story: FieldStory) => {
    setSelectedStory(story);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#field-stories?story=${story.id}`);
    }
  };

  const closeStoryReader = () => {
    setSelectedStory(null);
    if (typeof window !== "undefined" && (window.location.hash.includes("story=") || window.location.search.includes("story="))) {
      window.history.replaceState(null, "", "#field-stories");
    }
  };

  // Smooth navigation to Expedition Calculator / Builder
  const handleDraftAdventure = () => {
    closeStoryReader();
    setTimeout(() => {
      scrollToTargetSection("builder", true);
    }, 120);
  };

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

  // Check URL on mount and whenever stories load for direct story deep-linking
  useEffect(() => {
    if (typeof window === "undefined" || stories.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    let storyParam = params.get("story");

    const hash = window.location.hash;
    if (!storyParam && hash.includes("story=")) {
      const match = hash.match(/story=([^&]+)/);
      if (match) storyParam = match[1];
    } else if (!storyParam && hash.startsWith("#story-")) {
      storyParam = hash.replace("#story-", "");
    }

    if (storyParam) {
      const targetStory = stories.find(
        (s) => String(s.id) === String(storyParam) || 
               s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(storyParam!.toLowerCase())
      );
      if (targetStory) {
        setSelectedStory(targetStory);
      }
    }
  }, [stories]);

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
      setSubmitError("Please enter a valid Lead Guide / Staff authorization PIN to publish with this badge.");
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

  // Admin Portal Login (Secured via Server-Side Verification)
  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAdminLoginError("");

    const trimmedPin = adminLoginPin.trim();
    if (!trimmedPin) {
      setAdminLoginError("Please enter your staff authorization PIN.");
      return;
    }

    setIsValidatingPin(true);
    try {
      const res = await fetch("/api/articles/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: trimmedPin }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setAdminLoginError(data.error || "Invalid Authorization PIN. Access restricted to authorized Cool J staff.");
        return;
      }

      setVerifiedAdminPin(trimmedPin);
      setIsAdminMode(true);
      setIsAdminModalOpen(false);
      setAdminLoginPin("");
      await loadStories(trimmedPin);
      setModerationNotice("Staff Vetting Portal Unlocked: You can now review pending guest submissions, approve, feature, or delete posts.");
      setTimeout(() => setModerationNotice(null), 6000);
    } catch {
      setAdminLoginError("Unable to verify authorization PIN at this time. Please try again.");
    } finally {
      setIsValidatingPin(false);
    }
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
      setModerationNotice(err.message || "Could not update story status");
      setTimeout(() => setModerationNotice(null), 4000);
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
      setModerationNotice(err.message || "Failed to update featured flag");
      setTimeout(() => setModerationNotice(null), 4000);
    } finally {
      setProcessingStoryId(null);
    }
  };

  // Delete Story
  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (!verifiedAdminPin) return;

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
      setModerationNotice(err.message || "Could not delete story");
      setTimeout(() => setModerationNotice(null), 4000);
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
    <section id="field-stories" className="py-20 px-4 bg-[#F8F5EE] border-t border-[#E5DEC9] text-[#1A1A1A] relative scroll-mt-24">
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
                  onClick={() => openStoryReader(story)}
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
                        src={resolveStoryPhoto(story.photos[0], story.title, 0)}
                        alt={story.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          const fallback = resolveStoryPhoto("", story.title, 0);
                          if (target.src !== fallback && !target.src.endsWith(fallback)) {
                            target.src = fallback;
                          } else {
                            target.src = "/assets/images/cool-j.jpg";
                          }
                        }}
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
                          {(() => {
                            const avatar = getAuthorAvatar(story.author);
                            return avatar ? (
                              <img
                                src={avatar}
                                alt={story.author}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-[#C9A24A]/60 shadow-xs shrink-0"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.onerror = null;
                                  if (story.author.toLowerCase().includes("cool j") || story.author.toLowerCase().includes("mwangi")) {
                                    if (!target.src.includes("cool-j.jpg")) {
                                      target.src = "/assets/images/cool-j.jpg";
                                    } else {
                                      target.src = "/assets/images/John%20Mwangi%20M.%20(Cool%20J).jpg";
                                    }
                                  } else if (story.author.toLowerCase().includes("mfalme")) {
                                    target.src = "/assets/images/mfalme-ukweli.png";
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#0B3D2E] text-[#C9A24A] flex items-center justify-center font-black text-xs shrink-0">
                                {story.author.charAt(0)}
                              </div>
                            );
                          })()}
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
                          {/* Review / Account Count */}
                          <div 
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200"
                            title="Reader reviews and firsthand accounts"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-[#0B3D2E]" />
                            <span>
                              {storyReviews.filter(
                                (r) => r.storyId === story.id || (story.id.includes("ebola") && r.storyId.includes("ebola"))
                              ).length}
                            </span>
                          </div>

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

                      {/* Contextual Smart Card CTA */}
                      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-[#0B3D2E] group-hover:text-[#C9A24A] transition-colors">
                        <span className="flex items-center gap-1.5">
                          {(() => {
                            const arch = getStoryArchetype(story);
                            if (arch === "health-advisory") return "🛡️ Read Advisory & Share Account";
                            if (arch === "community") return "🥊 Read Story & Support Youth";
                            if (arch === "founder") return "🌟 Read Founder Vision";
                            return "🏔️ Read Dispatch & Draft Circuit";
                          })()}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
              Enter your confidential staff authorization PIN to review and vet guest stories before they go live, publish official dispatches, or manage the expedition feed.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-1.5">
                  Authorization PIN
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter staff authorization PIN"
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
                  disabled={isValidatingPin}
                  className="bg-[#0B3D2E] hover:bg-[#124D3C] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isValidatingPin ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C9A24A]" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 text-[#C9A24A]" />
                  )}
                  <span>{isValidatingPin ? "Verifying..." : "Unlock Vetting Mode"}</span>
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
          onClick={closeStoryReader}
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
                onClick={closeStoryReader}
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
                  {(() => {
                    const avatar = getAuthorAvatar(selectedStory.author);
                    return avatar ? (
                      <img
                        src={avatar}
                        alt={selectedStory.author}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#C9A24A] shadow-sm shrink-0"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          if (selectedStory.author.toLowerCase().includes("cool j") || selectedStory.author.toLowerCase().includes("mwangi")) {
                            if (!target.src.includes("cool-j.jpg")) {
                              target.src = "/assets/images/cool-j.jpg";
                            } else {
                              target.src = "/assets/images/John%20Mwangi%20M.%20(Cool%20J).jpg";
                            }
                          } else if (selectedStory.author.toLowerCase().includes("mfalme")) {
                            target.src = "/assets/images/mfalme-ukweli.png";
                          }
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0B3D2E] text-[#C9A24A] font-black flex items-center justify-center text-sm shadow-inner shrink-0">
                        {selectedStory.author.charAt(0)}
                      </div>
                    );
                  })()}
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
                        src={resolveStoryPhoto(imgUrl, selectedStory.title, idx)}
                        alt={`Photo ${idx + 1} from ${selectedStory.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          const fallback = resolveStoryPhoto("", selectedStory.title, idx);
                          if (target.src !== fallback && !target.src.endsWith(fallback)) {
                            target.src = fallback;
                          } else {
                            target.src = idx === 0 ? "/assets/images/cool-j.jpg" : "/assets/images/mt-kenya-summit.jpg";
                          }
                        }}
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

              {/* ------------------------------------------------------------- */}
              {/* SMART CONTEXT-AWARE CALLOUT & ACTIONS BASED ON STORY TYPE */}
              {/* ------------------------------------------------------------- */}
              {(() => {
                const archetype = getStoryArchetype(selectedStory);

                if (archetype === "health-advisory") {
                  return (
                    <div className="mt-8 bg-[#F3F8F5] border-2 border-emerald-700/30 rounded-2xl p-5 sm:p-6 shadow-xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-[#C9A24A] flex items-center justify-center shrink-0 shadow-xs">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-serif font-black text-[#0B3D2E] text-base">
                              East Africa Health & Visitor Community Dialogue
                            </h4>
                            <p className="text-xs text-gray-600">
                              Transparent facts • Direct access to our operations desk • Reader firsthand accounts
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 uppercase tracking-wider shrink-0">
                          Active Health Advisory
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed my-3.5">
                        Have you traveled through Kenya or East Africa recently, or are you planning an upcoming journey? 
                        We invite all travelers and tour lovers to share their firsthand experience, airport screening accounts, or safety questions. Your real-world feedback helps fellow explorers travel with confidence.
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {/* CTA 1: Ask Operations & Safety Desk */}
                        <a
                          href="https://wa.me/254720572251?text=Jambo%20Cool%20J%20%26%20Mfalme%20Ukweli!%20I%20just%20read%20your%20East%20Africa%20Health%20%26%20Safety%20Advisory%20and%20had%20a%20question%20regarding%20visitor%20protocols%20and%20safety%20guarantees."
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#124D3C] text-[#FAF8F5] text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4 text-[#C9A24A]" />
                          <span>Consult Operations & Safety Desk on WhatsApp</span>
                        </a>

                        {/* CTA 2: Share Reader Account / Feedback */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(true);
                            setTimeout(() => {
                              const el = document.getElementById("story-reviews-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }, 50);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <PenTool className="h-4 w-4" />
                          <span>Share Your Account or Feedback</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                if (archetype === "community") {
                  return (
                    <div className="mt-8 bg-[#FAF8F5] border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 shadow-xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DEC9]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#8F5C38] text-white flex items-center justify-center shrink-0">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-serif font-black text-[#0B3D2E] text-base">
                              Community Youth Empowerment • Nanyuki Good Times Boxing Club
                            </h4>
                            <p className="text-xs text-gray-600">
                              100% locally reinvested • Training gear • Youth mentorship
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed my-3.5">
                        Every trek and safari booked through Cool J directly contributes to athletic gear and nutrition for Nanyuki youth. You can visit the gym, meet our coaches, or plan a community-inclusive journey.
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {/* CTA 1: Visit Boxing Club Page */}
                        <a
                          href="https://facebook.com/nanyukigoodtimesboxingclub"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#124D3C] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <ExternalLink className="h-4 w-4 text-[#C9A24A]" />
                          <span>Visit Boxing Club on Facebook</span>
                        </a>

                        {/* CTA 2: Draft Trip Supporting Youth */}
                        <button
                          type="button"
                          onClick={handleDraftAdventure}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A24A] hover:bg-[#b58f3d] text-[#0B3D2E] text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Calculator className="h-4 w-4" />
                          <span>Draft a Journey Supporting Local Youth</span>
                        </button>

                        {/* CTA 3: Leave Words of Encouragement */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(true);
                            setTimeout(() => {
                              const el = document.getElementById("story-reviews-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }, 50);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                        >
                          <PenTool className="h-4 w-4 text-[#8F5C38]" />
                          <span>Leave Words of Encouragement</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                if (archetype === "founder") {
                  return (
                    <div className="mt-8 bg-[#0B3D2E] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#C9A24A]">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <Sparkles className="h-5 w-5 text-[#C9A24A]" />
                        <div>
                          <h4 className="font-serif font-black text-white text-base">
                            Experience the Cool J Difference: Dignity, Brotherhood & Safety
                          </h4>
                          <p className="text-xs text-white/80">
                            Fair crew wages • Slow mindful pacing • Dedicated private Land Cruisers
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-white/90 leading-relaxed my-3.5">
                        Ready to experience the mountains and savannas of East Africa with John Mwangi and our legendary team of certified mountain guides?
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {/* CTA 1: Draft Adventure */}
                        <button
                          type="button"
                          onClick={handleDraftAdventure}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A24A] hover:bg-[#e0b85a] text-[#0B3D2E] text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Calculator className="h-4 w-4" />
                          <span>Draft Your Expedition with Cool J</span>
                        </button>

                        {/* CTA 2: WhatsApp Cool J */}
                        <a
                          href="https://wa.me/254720572251?text=Jambo%20Cool%20J!%20I%20just%20read%20your%20story%20about%20why%20you%20founded%20Cool%20J%20Expeditions.%20I%20would%20love%20to%20plan%20a%20private%20trek/safari%20with%20your%20team."
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
                        >
                          <MessageCircle className="h-4 w-4 text-[#C9A24A]" />
                          <span>Message John Mwangi on WhatsApp</span>
                        </a>

                        {/* CTA 3: Leave a Note / Review */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(true);
                            setTimeout(() => {
                              const el = document.getElementById("story-reviews-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }, 50);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          <PenTool className="h-4 w-4 text-[#C9A24A]" />
                          <span>Leave a Note for Cool J</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                // Standard Circuit / Mountain / Safari Story
                return (
                  <div className="mt-8 bg-[#FAF8F5] border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DEC9]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0B3D2E] text-[#C9A24A] flex items-center justify-center shrink-0">
                          <Mountain className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-serif font-black text-[#0B3D2E] text-base">
                            Inspired by This Circuit? Plan Your Adventure
                          </h4>
                          <p className="text-xs text-gray-600">
                            Instant custom calculator • 4x4 Land Cruiser fleet • Bundled crew fees
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#8F5C38] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                        📍 {selectedStory.circuit}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed my-3.5">
                      Turn this dispatch into your own journey. Open our instant expedition calculator to customize traveler party size, assign 4x4 Land Cruisers, and see transparent pricing.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {/* CTA 1: Draft This Adventure */}
                      <button
                        type="button"
                        onClick={handleDraftAdventure}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#124D3C] text-[#FAF8F5] text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Calculator className="h-4 w-4 text-[#C9A24A]" />
                        <span>Draft This Adventure (Instant Calculator)</span>
                      </button>

                      {/* CTA 2: Inquire on WhatsApp */}
                      <a
                        href={`https://wa.me/254720572251?text=Jambo%20Cool%20J!%20I%20just%20read%20the%20dispatch%20"${encodeURIComponent(selectedStory.title)}"%20on%20the%20${encodeURIComponent(selectedStory.circuit)}%20and%20would%20love%20to%20plan%20this%20expedition.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all"
                      >
                        <MessageCircle className="h-4 w-4 text-emerald-700" />
                        <span>Inquire on WhatsApp</span>
                      </a>

                      {/* CTA 3: Leave a Review */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewForm(true);
                          setTimeout(() => {
                            const el = document.getElementById("story-reviews-section");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 50);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <PenTool className="h-4 w-4 text-[#8F5C38]" />
                        <span>Leave a Review for This Circuit</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ------------------------------------------------------------- */}
              {/* REVIEWS, ACCOUNTS & READER FEEDBACK SECTION FOR THIS STORY */}
              {/* ------------------------------------------------------------- */}
              <div id="story-reviews-section" className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-[#0B3D2E]" />
                      <h3 className="font-serif font-black text-xl text-[#0B3D2E]">
                        {getStoryArchetype(selectedStory) === "health-advisory"
                          ? "Reader Accounts & Community Feedback"
                          : getStoryArchetype(selectedStory) === "community"
                          ? "Community Notes & Visitor Reflections"
                          : "Explorer Reviews & Field Notes"}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getStoryArchetype(selectedStory) === "health-advisory"
                        ? "Firsthand visitor perspectives, airport clearance accounts, and community questions."
                        : "Real feedback from fellow adventurers and tour lovers who have explored with Cool J."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B3D2E] hover:bg-[#124D3C] text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <PenTool className="h-3.5 w-3.5 text-[#C9A24A]" />
                    <span>
                      {showReviewForm 
                        ? "Close Form" 
                        : (getStoryArchetype(selectedStory) === "health-advisory" ? "Share Your Account / Feedback" : "Leave a Review")}
                    </span>
                  </button>
                </div>

                {/* Review / Account Submission Form */}
                {showReviewForm && (
                  <form 
                    onSubmit={(e) => handleAddStoryReview(e, selectedStory.id)} 
                    className="bg-[#FAF8F5] border-2 border-[#C9A24A]/40 rounded-2xl p-5 mb-8 space-y-4 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
                        {getStoryArchetype(selectedStory) === "health-advisory"
                          ? "Submit Your Perspective / Firsthand Account"
                          : "Submit Your Explorer Review"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="text-gray-400 hover:text-gray-700 text-xs cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. David H."
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#C9A24A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Country / City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Netherlands / Nairobi"
                          value={newReviewCountry}
                          onChange={(e) => setNewReviewCountry(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#C9A24A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Traveler Status / Profile
                        </label>
                        <select
                          value={newReviewPerspective}
                          onChange={(e) => setNewReviewPerspective(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#C9A24A] focus:outline-none"
                        >
                          <option value="Recently Visited Kenya">Recently Visited Kenya</option>
                          <option value="Tour Lover & Planning Upcoming Trip">Tour Lover & Planning Trip</option>
                          <option value="Past Cool J Guest">Past Cool J Guest</option>
                          <option value="Local Tourism Partner / Resident">Local Tourism Partner / Resident</option>
                          <option value="Global Trekker">Global Trekker</option>
                        </select>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-3">
                      <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Helpfulness / Experience Rating:
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                star <= newReviewRating
                                  ? "fill-amber-400 text-amber-500"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-mono text-gray-500 font-bold">
                        {newReviewRating} / 5 Stars
                      </span>
                    </div>

                    {/* Review Content */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        {getStoryArchetype(selectedStory) === "health-advisory"
                          ? "Your Firsthand Account, Question, or Perspective *"
                          : "Your Review / Feedback Comment *"}
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder={
                          getStoryArchetype(selectedStory) === "health-advisory"
                            ? "Share your recent experience on the ground, border screening impressions, or safety thoughts..."
                            : "Share your experience with Cool J's team, route highlights, or tips for future adventurers..."
                        }
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#C9A24A] focus:outline-none"
                      />
                    </div>

                    {reviewSubmitError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {reviewSubmitError}
                      </div>
                    )}

                    {reviewSubmitSuccess && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Asante Sana! Your feedback has been published and added to this dispatch.</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#0B3D2E] hover:bg-[#124D3C] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                      >
                        Publish Account & Feedback
                      </button>
                    </div>
                  </form>
                )}

                {/* Display Existing Reviews for this Story */}
                {(() => {
                  const activeStoryReviews = storyReviews.filter(
                    (r) => r.storyId === selectedStory.id || (selectedStory.id.includes("ebola") && r.storyId.includes("ebola"))
                  );

                  if (activeStoryReviews.length === 0) {
                    return (
                      <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 font-medium">
                          Be the first explorer or tour lover to share feedback or an account on this dispatch!
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(true)}
                          className="mt-3 px-4 py-1.5 rounded-lg bg-[#0B3D2E] text-white text-xs font-bold cursor-pointer hover:bg-[#124D3C]"
                        >
                          Post First Feedback
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3.5">
                      {activeStoryReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-[#FAF8F5] border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors hover:border-[#C9A24A]/40"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#0B3D2E] text-[#C9A24A] font-black text-xs flex items-center justify-center shrink-0">
                                {rev.authorName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-gray-900">{rev.authorName}</span>
                                  <span className="text-[10px] font-mono text-gray-500">({rev.country})</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                                    {rev.perspective}
                                  </span>
                                  <span className="text-gray-400 font-mono">• {rev.date}</span>
                                </div>
                              </div>
                            </div>

                            {/* Star Rating & Helpful Button */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < rev.rating
                                        ? "fill-amber-400 text-amber-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleHelpful(rev.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                  helpfulLiked[rev.id]
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 hover:text-emerald-700"
                                }`}
                                title="Mark as helpful firsthand account"
                              >
                                <ThumbsUp className={`h-3 w-3 ${helpfulLiked[rev.id] ? "fill-emerald-600 text-emerald-600" : ""}`} />
                                <span>{rev.helpfulCount}</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-gray-700 leading-relaxed font-normal whitespace-pre-line pl-1 sm:pl-10">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Story Modal Footer Controls */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 flex-wrap">
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

                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/#field-stories?story=${selectedStory.id}`;
                      if (navigator.share) {
                        navigator.share({
                          title: selectedStory.title,
                          text: `Read "${selectedStory.title}" from Cool J Expeditions Field Notes:`,
                          url: shareUrl
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(shareUrl);
                        setModerationNotice("Direct story link copied to clipboard!");
                        setTimeout(() => setModerationNotice(null), 3000);
                      }
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#0B3D2E]/10 hover:bg-[#0B3D2E]/20 text-[#0B3D2E] border border-[#0B3D2E]/20 transition-all cursor-pointer"
                    title="Share direct link to this story"
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#C9A24A]" />
                    <span>Copy Direct Link</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={closeStoryReader}
                  className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
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
                      setTitle("Health & Safety Advisory: Regional Ebola Monitoring & Visitor Protections");
                      setAuthor("Mfalme Ukweli");
                      setCountry("Kenya (Cool J Operations & Safety)");
                      setCategory("guide-dispatch");
                      setCircuit("East Africa Travel Advisory & Field Health Protocols");
                    }}
                    className="px-2.5 py-1 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 shrink-0 font-medium cursor-pointer"
                  >
                    🛡️ Ebola & Health Advisory Notes
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
                    <span className="text-[10px] text-amber-700/80 font-medium">Restricted to Authorized Staff</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter private authorization PIN"
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
                    <optgroup label="🛡️ Field Safety, Health & Travel Advisories">
                      <option value="East Africa Travel Advisory & Field Health Protocols">East Africa Travel Advisory & Field Health Protocols</option>
                      <option value="High-Altitude Acclimatization & Alpine Medical Safety">High-Altitude Acclimatization & Alpine Medical Safety</option>
                    </optgroup>

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
