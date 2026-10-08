import { useState, useEffect, useMemo, FormEvent, useRef, ChangeEvent } from "react";
import { 
  Compass, 
  Mountain, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  Plus, 
  Minus, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  Loader2,
  DollarSign,
  Award,
  Menu,
  X,
  Play,
  Pause,
  RotateCw,
  Video,
  Info,
  Car,
  Sliders,
  Volume2,
  VolumeX,
  Camera,
  Upload,
  Zap,
  Route,
  Calculator,
  ArrowUp
} from "lucide-react";
import { EXPERIENCES } from "./data/experiences";
import { FAQS } from "./data/faqs";
import ResourceCenter from "./components/ResourceCenter";
import FieldStoriesSection from "./components/FieldStoriesSection";
import MpesaSimModal from "./components/MpesaSimModal";
import Logo from "./components/Logo";
import { Review, BookingResponse } from "./types";
import WeatherForecast from "./components/WeatherForecast";
import ShareWidget from "./components/ShareWidget";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import QuickSupport from "./components/QuickSupport";
import CookieConsentBanner from "./components/CookieConsentBanner";

// Import authentic team and climber photo assets
import teamShiptons from "./assets/images/Trekking Team Resting.jpg";
import coolJGuide from "./assets/images/John Mwangi M. (Cool J).jpg";
import climberSunset from "./assets/images/Mt Kenya Summit (Hero banner).jpg";
import groupCustomers from "./assets/images/Happy Group of Climbers.jpg";
import lenanaPeak from "./assets/images/Point Lenana Peak Sign.jpg";
import coolJLogoBlackImg from "./assets/images/logo black.jpg";
import kilimanjaroTanzania from "./assets/images/mount-kilimanjaro-.jpg";
import mfalmeUkweliPortrait from "./assets/images/mfalme ukweli.png";
import rodaPortrait from "./assets/images/rodah_reviewer_1783348521900.jpg";
import ugandaBwindiImg from "./assets/images/uganda_bwindi_1783435198714.jpg";
import fleetSavanna from "./assets/images/fleet-savanna.jpg";
import fleetInterior from "./assets/images/fleet-interior.jpg";
import fleetPaved from "./assets/images/fleet-paved.jpg";
import fleetLineup from "./assets/images/fleet-tourists-enjoying.jpg";
import coolJWithHappyTourists from "./assets/images/cool_j_with_happy_tourists.jpg";
import takingRestInSamburu from "./assets/images/taking_a_rest_in_samburu.jpg";
import walkWithRanger from "./assets/images/walk_with_ranger.jpg";
import elephantTakingAWalk from "./assets/images/elephant_taking_a_walk.jpg";
import happyGuests from "./assets/images/happy_guests.jpg";

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 5,
    name: "Mfalme Ukweli",
    country: "Kenya",
    trip: "Mount Kenya Technical Peak Ascent",
    rating: 5,
    text: "They know their stuff and are good at expeditions. From detailed acclimatization routines to premium safety procedures, ascending Sirimon with Cool J was a masterpiece of professional guiding.",
    date: "2026-07-02",
    photo: mfalmeUkweliPortrait
  },
  {
    id: 1,
    name: "Roda wa Shiku",
    country: "Kenya",
    trip: "Ol Pejeta Family Conservancy Tour",
    rating: 5,
    text: "My touring experience at Ol pajeta conservancy with you guys was the best.My family had so much fun, will do it again soon.!",
    date: "2026-06-28",
    photo: rodaPortrait
  },
  {
    id: 2,
    name: "Sarah & Mike",
    country: "Germany",
    trip: "Mount Kenya Summit & Ol Pejeta Safari",
    rating: 5,
    text: "Climbing Mount Kenya with Cool J was the highlight of our year! He set an amazing pace, and we felt extremely safe. His knowledge of the local Nanyuki flora and bird species is mind-blowing. The Ol Pejeta rhino crossing was surreal too!",
    date: "2023-08-14"
  },
  {
    id: 3,
    name: "Emma Watson",
    country: "United Kingdom",
    trip: "7-Day Serengeti & Masai Mara migration",
    rating: 5,
    text: "This wasn't a standard cookie-cutter tour. Cool J introduced us to Maasai elders he has personal friendships with, and we had coffee in a small village far away from tourist buses. Truly authentic and beautiful experience.",
    date: "2023-09-05"
  },
  {
    id: 4,
    name: "James Cook",
    country: "Australia",
    trip: "Uganda Gorilla Trekking & Queen Elizabeth Park",
    rating: 5,
    text: "Cool J organised our multi-country border crossings between Kenya and Uganda flawlessly. Seeing the mountain gorillas in Bwindi is an emotional experience words can't capture, made perfect by J's meticulous arrangements.",
    date: "2026-04-19"
  }
];

export default function App() {
  // Booking Form state
  const [region, setRegion] = useState("Mount Kenya");
  const [activity, setActivity] = useState("Mountain climbing");
  const [duration, setDuration] = useState("5 days");
  const [budget, setBudget] = useState("$1,500 - $2,500");
  const [startDate, setStartDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Currency Converter state
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'KES' | 'EUR' | 'GBP' | 'CAD'>('USD');

  const EXCHANGE_RATES = {
    USD: 1,
    KES: 130,
    EUR: 0.92,
    GBP: 0.78,
    CAD: 1.36,
  };

  const CURRENCY_SYMBOLS = {
    USD: "$",
    KES: "Ksh ",
    EUR: "€",
    GBP: "£",
    CAD: "CA$",
  };

  const formatConvertedPrice = (amountUsd: number) => {
    const rate = EXCHANGE_RATES[selectedCurrency];
    const symbol = CURRENCY_SYMBOLS[selectedCurrency];
    const converted = Math.ceil(amountUsd * rate);
    return `${symbol}${converted.toLocaleString()} ${selectedCurrency}`;
  };

  // UI state
  const [isLiningUpQuote, setIsLiningUpQuote] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<BookingResponse | null>(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<string>("");
  const [itineraryError, setItineraryError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [galleryActiveIdx, setGalleryActiveIdx] = useState(0);

  const AUTHENTIC_GALLERY = [
    {
      title: "Point Lenana Peak Summit (4,985m)",
      category: "Summit Triumphs",
      location: "Mount Kenya National Park",
      badge: "🏆 4,985M SUMMIT",
      image: lenanaPeak,
      description: "Cool J and climber celebrating triumphantly at the summit of Point Lenana as the morning sun breaks over the jagged peaks."
    },
    {
      title: "Cool J & Ranger at Ngare Ndare Azure Pools",
      category: "Waterfalls & Canopies",
      location: "Ngare Ndare Forest Reserve",
      badge: "💧 AZURE GLACIAL POOL",
      image: coolJWithHappyTourists,
      description: "Cool J and our armed Kenya Forest Service ranger accompanying international guests exploring the crystal clear blue plunge pools beneath the canopy."
    },
    {
      title: "Expedition Crew Resting in Samburu Shade",
      category: "Northern Desert Savanna",
      location: "Samburu & Buffalo Springs Reserve",
      badge: "🐆 SAMBURU ACACIA TRAIL",
      image: takingRestInSamburu,
      description: "Our safari party taking a well-deserved rest in the natural shade of wild acacia trees along the Ewaso Nyiro riverbanks."
    },
    {
      title: "Guided Wilderness Walk with Armed Ranger",
      category: "Wilderness Trekking",
      location: "Lolldaiga Hills & Mt Kenya Foothills",
      badge: "🌲 GUIDED BUSH PATROL",
      image: walkWithRanger,
      description: "Authentic on-foot exploration through ancient cedar and olive tree woodlands with certified armed wildlife conservation rangers."
    },
    {
      title: "Solitary Tusker Elephant by Doum Palms",
      category: "Wildlife Encounters",
      location: "Amboseli & River Savannas",
      badge: "🐘 MAJESTIC TUSKER",
      image: elephantTakingAWalk,
      description: "A magnificent free-ranging elephant roaming serenely through golden grassland beneath indigenous doum palm trees."
    },
    {
      title: "Family & Toddler Mountain Stream Adventure",
      category: "Family Expeditions",
      location: "Aberdare & Foothills Cascades",
      badge: "🏞️ SAFE FAMILY ADVENTURE",
      image: happyGuests,
      description: "Cool J ensuring safe, joyful exploration for families and young children wading through clear mountain spring waters."
    },
    {
      title: "High Camp Acclimatization at Shipton's",
      category: "Alpine Acclimatization",
      location: "Shipton's Camp (4,200m)",
      badge: "⛺ HIGH ALTITUDE BASE",
      image: teamShiptons,
      description: "Our dedicated guide and porter team resting and monitoring oxygen levels at high camp before the pre-dawn summit push."
    },
    {
      title: "Happy Climbers Expedition Squad",
      category: "Summit Triumphs",
      location: "Mount Kenya Circuit",
      badge: "👥 TEAM TRIUMPH",
      image: groupCustomers,
      description: "A joyful international group celebrating a safe, life-changing alpine climb with the Cool J Expeditions mountain crew."
    }
  ];

  // Review state
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem("cool_j_local_reviews");
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch (e) {
      return DEFAULT_REVIEWS;
    }
  });
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewCountry, setNewReviewCountry] = useState("");
  const [newReviewTrip, setNewReviewTrip] = useState("Mount Kenya Ascent");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  // Field Story Prefill & Nudge state
  const [storyPrefill, setStoryPrefill] = useState<{
    author?: string;
    country?: string;
    circuit?: string;
    content?: string;
  } | null>(null);
  const [showReviewToStoryNudge, setShowReviewToStoryNudge] = useState<boolean>(false);
  const [lastSubmittedReview, setLastSubmittedReview] = useState<{
    author: string;
    country: string;
    circuit: string;
    content: string;
  } | null>(null);

  // Mpesa Modal state
  const [isMpesaOpen, setIsMpesaOpen] = useState(false);

  // Privacy & Cookie Policy modal state
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<"privacy" | "cookies">("privacy");

  // FAQ state
  const [faqOpenStates, setFaqOpenStates] = useState<{ [key: number]: boolean }>({});

  // Experience County/Region Filter State
  const [expCountyFilter, setExpCountyFilter] = useState<"all" | "laikipia" | "neighboring" | "kenya" | "grand">("all");

  // Fleet & Media Showcase state
  const [fleetActiveTab, setFleetActiveTab] = useState<"lineup" | "savanna" | "interior" | "paved">("lineup");
  const [videoActiveTab, setVideoActiveTab] = useState<"tuskers" | "hiking">("tuskers");

  // Scroll to top / Home button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Fetch reviews on mount
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend reviews unavailable.");
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response type from backend.");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
          try {
            localStorage.setItem("cool_j_local_reviews", JSON.stringify(data));
          } catch (e) {
            console.error("Failed to save reviews to localStorage:", e);
          }
        }
      })
      .catch((err) => {
        console.warn("Using local/localStorage reviews fallback:", err.message);
      });
  }, []);

  // Helper to dynamically link duration options based on destination region (including East Africa & combos)
  const getDurationOptions = (selectedRegion: string) => {
    const reg = (selectedRegion || "").toLowerCase();
    
    if (reg.includes("uganda") || reg.includes("gorilla")) {
      return [
        { value: "3 days", label: "3 Days — Uganda Bwindi Express Fly-in Gorilla Trek" },
        { value: "4 days", label: "4 Days — Uganda Gorilla Tracking & Lake Bunyonyi Canoe" },
        { value: "6 days", label: "6 Days — Uganda Gorillas, Chimps & Queen Elizabeth Safari" },
        { value: "8 days", label: "8 Days — Uganda Primate & Savanna Circuit (Bwindi & Murchison)" },
        { value: "10 days", label: "10 Days — Uganda & Tanzania Combo (Bwindi Gorillas + Serengeti Safari)" },
        { value: "14 days", label: "14 Days — East Africa Multi-Country Grand Tour (Uganda + Kenya + Tanzania)" }
      ];
    }
    
    if (reg.includes("tanzania") || reg.includes("kilimanjaro") || reg.includes("serengeti")) {
      return [
        { value: "5 days", label: "5 Days — Tanzania Serengeti & Ngorongoro Crater Big 5 Safari" },
        { value: "6 days", label: "6 Days — Mt. Kilimanjaro Machame/Marangu Summit Route" },
        { value: "7 days", label: "7 Days — Mt. Kilimanjaro Lemosho Acclimatization Route" },
        { value: "8 days", label: "8 Days — Classic Northern Tanzania Circuit (Kilimanjaro + Serengeti)" },
        { value: "10 days", label: "10 Days — Tanzania & Uganda Combo (Serengeti Safari + Bwindi Gorillas)" },
        { value: "14 days", label: "14 Days — East Africa Grand Tour (Tanzania + Kenya + Uganda Combo)" }
      ];
    }

    if (reg.includes("multi-country") || reg.includes("grand tour") || reg.includes("combo") || reg.includes("cross-border")) {
      return [
        { value: "10 days", label: "10 Days — Uganda & Tanzania Cross-Border Safari & Gorilla Combo" },
        { value: "12 days", label: "12 Days — Kenya & Tanzania Great Migration Circuit" },
        { value: "14 days", label: "14 Days — Kenya + Tanzania + Uganda Tri-Country Grand Tour" },
        { value: "18 days", label: "18 Days — Ultimate East Africa Odyssey (Mt Kenya/Kili + Gorillas + Serengeti)" }
      ];
    }

    // Default Kenya Destinations (Laikipia, Mount Kenya, Samburu, Aberdares, Masai Mara, Tsavo, etc.)
    return [
      { value: "1 day", label: "1 Day — Day Trip (Ngare Ndare Canopy / Ol Pejeta / Solio)" },
      { value: "3 days", label: "3 Days — Short Safari Getaway / Express Foothills Hike" },
      { value: "4 days", label: "4 Days — Sirimon Route Mount Kenya Ascent" },
      { value: "5 days", label: "5 Days — Classic Chogoria-Sirimon Traverse (Point Lenana)" },
      { value: "7 days", label: "7 Days — Deep Wilderness Safari & Mount Kenya Summit Combo" },
      { value: "10 days", label: "10 Days — Kenya + Tanzania or Uganda Cross-Border Combo" },
      { value: "14 days", label: "14 Days — East Africa Multi-Country Grand Expedition" }
    ];
  };

  // Real-time live estimate calculation engine (Dynamic instant calculation)
  // Accommodations and meals are self-arranged by default (available on request), and crew fees are bundled all-inclusive
  const liveQuote = useMemo(() => {
    const parsingDays = parseInt(duration) || 5;
    const numGuests = Math.min(30, Math.max(1, guestsCount || 1));
    const budgetStr = budget || "$1,500 - $2,500";

    let tier: "budget" | "standard" | "premium" | "luxury" = "standard";
    if (budgetStr.includes("$1,000 - $1,500") || budgetStr.includes("Budget")) tier = "budget";
    else if (budgetStr.includes("$1,500 - $2,500") || budgetStr.includes("Standard")) tier = "standard";
    else if (budgetStr.includes("$2,500 - $3,500") || budgetStr.includes("Premium")) tier = "premium";
    else if (budgetStr.includes("$3,500+") || budgetStr.includes("Luxury")) tier = "luxury";

    let totalAmount = 0;
    const vehiclesNeeded = Math.ceil(numGuests / 6);
    const regLower = (region || "").toLowerCase();
    const durLower = (duration || "").toLowerCase();

    let parkFeeEstimate = 0;
    let transportEstimate = 0;

    if (regLower.includes("ngare ndare") || regLower.includes("canopy") || regLower.includes("waterfall")) {
      const entryFeePerDay = 40;
      const cruiserRatePerDay = 170;
      const inclusiveCrewPerDay = 45;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * Math.ceil(numGuests / 4);
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("solio")) {
      const entryFeePerDay = 80;
      const cruiserRatePerDay = 180;
      const inclusiveCrewPerDay = 45;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("aberdare")) {
      const entryFeePerDay = 52;
      const cruiserRatePerDay = 180;
      const inclusiveCrewPerDay = 45;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("lolldaiga")) {
      const entryFeePerDay = 50;
      const cruiserRatePerDay = 170;
      const inclusiveCrewPerDay = 45;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("meru national park") || regLower.includes("elsa")) {
      const entryFeePerDay = 60;
      const cruiserRatePerDay = 190;
      const inclusiveCrewPerDay = 50;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("samburu") || regLower.includes("buffalo springs") || regLower.includes("shaba")) {
      const entryFeePerDay = 80;
      const cruiserRatePerDay = 190;
      const inclusiveCrewPerDay = 50;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("lewa") || regLower.includes("borana")) {
      const entryFeePerDay = 130;
      const cruiserRatePerDay = 200;
      const inclusiveCrewPerDay = 60;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("nakuru") || regLower.includes("naivasha") || regLower.includes("hell's gate")) {
      const entryFeePerDay = 70;
      const cruiserRatePerDay = 180;
      const inclusiveCrewPerDay = 45;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("amboseli")) {
      const entryFeePerDay = 100;
      const cruiserRatePerDay = 200;
      const inclusiveCrewPerDay = 50;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("tsavo")) {
      const entryFeePerDay = 52;
      const cruiserRatePerDay = 200;
      const inclusiveCrewPerDay = 50;

      parkFeeEstimate = entryFeePerDay * parsingDays * numGuests;
      transportEstimate = cruiserRatePerDay * parsingDays * vehiclesNeeded;
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = Math.ceil(parkFeeEstimate + transportEstimate + bundledCrew);

    } else if (regLower.includes("diani") || regLower.includes("coast")) {
      const transferPerGuest = 60;
      const inclusiveCrewPerDay = 35;

      transportEstimate = transferPerGuest * numGuests;
      const bundledCrew = inclusiveCrewPerDay * parsingDays;
      totalAmount = Math.ceil(transportEstimate + bundledCrew);

    } else if (regLower.includes("mount kenya") || regLower.includes("lenana") || regLower.includes("sirimon") || regLower.includes("chogoria")) {
      const parkFeesPerDay = 52;
      let baseRatePerDay = 110;
      if (numGuests === 2) baseRatePerDay = 95;
      else if (numGuests >= 3 && numGuests <= 6) baseRatePerDay = 80;
      else if (numGuests >= 7 && numGuests <= 15) baseRatePerDay = 70;
      else if (numGuests >= 16) baseRatePerDay = 62;

      let budgetMultiplier = 1.0;
      if (tier === "budget") budgetMultiplier = 0.9;
      else if (tier === "premium") budgetMultiplier = 1.2;
      else if (tier === "luxury") budgetMultiplier = 1.45;

      const bundledCrewAndLogistics = Math.ceil(baseRatePerDay * parsingDays * numGuests * budgetMultiplier);
      parkFeeEstimate = Math.ceil(parkFeesPerDay * parsingDays * numGuests);
      transportEstimate = Math.ceil(90 * vehiclesNeeded);
      totalAmount = bundledCrewAndLogistics + parkFeeEstimate + transportEstimate;

    } else if (regLower.includes("nanyuki") || regLower.includes("laikipia") || regLower.includes("ol pejeta")) {
      const entryFeePerDay = 110;
      const cruiserVehicleRatePerDay = 180;
      const inclusiveCrewPerDay = 50;

      parkFeeEstimate = Math.ceil(entryFeePerDay * parsingDays * numGuests);
      transportEstimate = Math.ceil(cruiserVehicleRatePerDay * parsingDays * vehiclesNeeded);
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = parkFeeEstimate + transportEstimate + bundledCrew;

    } else if (regLower.includes("masai mara") || regLower.includes("safaris")) {
      const maraEntryFeePerDay = 150;
      const cruiserVehicleRatePerDay = 220;
      const inclusiveCrewPerDay = 55;

      parkFeeEstimate = Math.ceil(maraEntryFeePerDay * parsingDays * numGuests);
      transportEstimate = Math.ceil(cruiserVehicleRatePerDay * parsingDays * vehiclesNeeded);
      const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
      totalAmount = parkFeeEstimate + transportEstimate + bundledCrew;

    } else if (regLower.includes("tanzania") || regLower.includes("kilimanjaro")) {
      const parkFeesPerDay = 140;
      let baseCrewRatePerDay = 110;
      if (numGuests === 2) baseCrewRatePerDay = 95;
      else if (numGuests >= 3 && numGuests <= 6) baseCrewRatePerDay = 80;
      else if (numGuests >= 7) baseCrewRatePerDay = 70;

      let budgetMultiplier = 1.0;
      if (tier === "budget") budgetMultiplier = 0.9;
      else if (tier === "premium") budgetMultiplier = 1.2;
      else if (tier === "luxury") budgetMultiplier = 1.45;

      const bundledCrewAndLogistics = Math.ceil(baseCrewRatePerDay * parsingDays * numGuests * budgetMultiplier);
      parkFeeEstimate = Math.ceil(parkFeesPerDay * parsingDays * numGuests);
      transportEstimate = Math.ceil(150 * vehiclesNeeded);
      totalAmount = bundledCrewAndLogistics + parkFeeEstimate + transportEstimate;

    } else if (regLower.includes("uganda") || regLower.includes("gorilla")) {
      const gorillaPermitCost = 800;
      const cruiserVehicleRatePerDay = 200;
      const localRangerGuidePerDay = 50;

      parkFeeEstimate = gorillaPermitCost * numGuests;
      transportEstimate = Math.ceil((cruiserVehicleRatePerDay + localRangerGuidePerDay) * parsingDays * vehiclesNeeded);
      totalAmount = parkFeeEstimate + transportEstimate;

    } else if (regLower.includes("combo") || regLower.includes("multi-country") || durLower.includes("combo")) {
      // Uganda & Tanzania or Multi-Country Cross-Border Combo
      const permitAndParkDaily = 220;
      const cruiserVehicleRatePerDay = 220;
      const inclusiveCrewPerDay = 60;

      parkFeeEstimate = Math.ceil(permitAndParkDaily * Math.min(parsingDays, 4) * numGuests);
      transportEstimate = Math.ceil((cruiserVehicleRatePerDay + inclusiveCrewPerDay) * parsingDays * vehiclesNeeded);
      totalAmount = parkFeeEstimate + transportEstimate;

    } else {
      let baseDailyRatePerPerson = 260;
      if (tier === "budget") baseDailyRatePerPerson = 210;
      else if (tier === "premium") baseDailyRatePerPerson = 380;
      else if (tier === "luxury") baseDailyRatePerPerson = 540;

      let groupFactor = 1.0;
      if (numGuests === 2) groupFactor = 0.90;
      else if (numGuests >= 3 && numGuests <= 6) groupFactor = 0.82;
      else if (numGuests >= 7 && numGuests <= 15) groupFactor = 0.74;
      else if (numGuests >= 16) groupFactor = 0.68;

      parkFeeEstimate = Math.ceil(120 * parsingDays * numGuests);
      transportEstimate = Math.ceil(180 * parsingDays * vehiclesNeeded);
      totalAmount = Math.ceil(baseDailyRatePerPerson * parsingDays * numGuests * groupFactor);
    }

    if (numGuests >= 10) {
      totalAmount = Math.round(totalAmount * 0.93);
    }

    const perPerson = Math.round(totalAmount / numGuests);
    const deposit = Math.round(totalAmount * 0.35);

    return {
      totalAmount,
      perPerson,
      deposit,
      vehiclesNeeded,
      parkFeeEstimate,
      transportEstimate
    };
  }, [region, activity, duration, budget, guestsCount]);

  // Update Itinerary Real-time Dynamic Summary Text
  const renderDynamicTextSummary = () => {
    return `Expedition mapped to ${region} for ${guestsCount} explorer(s). Experience is focused on "${activity}" with a duration of ${duration} (${budget} budget tier).`;
  };

  // Generate a custom pre-filled WhatsApp message template based on client's inputs and quotes
  const getWhatsAppMessage = (isConfirmingQuote = false) => {
    const greeting = "Jambo Cool J!";
    let msg = `${greeting}\n\n`;

    const activeAmount = quoteResponse ? quoteResponse.amount : liveQuote.totalAmount;
    const activeQuoteId = quoteResponse ? quoteResponse.quoteId : `CJE-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isConfirmingQuote || quoteResponse) {
      msg += `🏔️ *CUSTOM EXPEDITION ESTIMATE INQUIRY*\n`;
      msg += `----------------------------------------\n`;
      msg += `🎫 *Estimate Reference:* ${activeQuoteId}\n`;
      msg += `👤 *Client Name:* ${clientName || "Adventurer"}\n`;
      msg += `📍 *Region/Destination:* ${region}\n`;
      msg += `🧗 *Specialty Activity:* ${activity}\n`;
      msg += `⏳ *Duration:* ${duration}\n`;
      msg += `👥 *Party Size:* ${guestsCount} traveler(s) (${liveQuote.vehiclesNeeded} 4x4 Cruiser${liveQuote.vehiclesNeeded > 1 ? "s" : ""})\n`;
      if (startDate) {
        msg += `📅 *Target Start Date:* ${startDate}\n`;
      }
      msg += `💰 *Budget Guide:* ${budget}\n`;
      const rate = EXCHANGE_RATES[selectedCurrency];
      const symbol = CURRENCY_SYMBOLS[selectedCurrency];
      const converted = Math.ceil(activeAmount * rate);
      msg += `💵 *Estimated Cost:* ${symbol}${converted.toLocaleString()} ${selectedCurrency} ${selectedCurrency !== "USD" ? `($${activeAmount.toLocaleString()} USD)` : ""}\n`;
      msg += `----------------------------------------\n`;
      msg += `I am contacting you from the Cool J Expeditions portal to schedule our itinerary details!`;
    } else {
      msg += `I am visiting your Cool J Expeditions portal and would like to inquire about customized Mount Kenya climbs, Ngare Ndare canopy walks, Samburu/Laikipia safaris, or gorilla trekking adventures!`;
    }
    return encodeURIComponent(msg);
  };

  // Helper to format review dates
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  // Submit Quote & Request custom-priced details
  const handleQuoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert("Name and email are mandatory for Cool J to formulate custom travel arrangements.");
      return;
    }
    setIsLiningUpQuote(true);

    try {
      const response = await fetch("/api/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          activity,
          duration,
          budget,
          startDate,
          guestsCount,
          clientName,
          clientEmail,
          clientPhone,
        }),
      });
      const data = await response.json();
      setQuoteResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiningUpQuote(false);
    }
  };

  // Generate real AI-generated customized daily itinerary
  const handleGenerateItinerary = async () => {
    setIsGeneratingItinerary(true);
    setItineraryError("");
    setGeneratedItinerary("");

    try {
      const response = await fetch("/api/plan-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          activity,
          duration,
          vibe: budget,
          specializedRequests: `Party size: ${guestsCount} climbers. Target date: ${startDate || "soon"}. Custom name: ${clientName || "Adventurer"}.`,
        }),
      });
      const data = await response.json();
      if (data.error && !data.itinerary) {
        setItineraryError(data.error);
      } else {
        setGeneratedItinerary(data.itinerary);
      }
    } catch (err: any) {
      setItineraryError("Could not retrieve AI itinerary right now. Connecting to fallback...");
      setGeneratedItinerary(`### Fallback Custom ${duration} Itinerary
      
**Day 1:** Arrival in Nanyuki, welcoming briefing by Cool J with scenic views of Mt Kenya peak pathways.
**Day 2:** Custom safari loop or beginning of acclimatization routes.
**Day 3:** Ascent to Point Lenana (4985m) or deep cultural exploration within Laikipia plains.`);
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  // Submit live guest review
  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) {
      alert("Please provide both name and review details.");
      return;
    }
    setIsSubmittingReview(true);
    setReviewMessage("");

    const submittedInfo = {
      author: newReviewName,
      country: newReviewCountry || "Globe Explorer",
      circuit: newReviewTrip,
      content: newReviewText
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReviewName,
          country: newReviewCountry || "Globe Explorer",
          trip: newReviewTrip,
          rating: newReviewRating,
          text: newReviewText,
        }),
      });
      if (res.ok) {
        const addedReview = await res.json();
        const updatedReviews = [addedReview, ...reviews];
        setReviews(updatedReviews);
        try {
          localStorage.setItem("cool_j_local_reviews", JSON.stringify(updatedReviews));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
        setLastSubmittedReview(submittedInfo);
        setShowReviewToStoryNudge(true);
        setNewReviewName("");
        setNewReviewCountry("");
        setNewReviewText("");
        setReviewMessage("Your review has been saved instantly in our local expert logs! Asante sana!");
      } else {
        throw new Error("Server submission failed.");
      }
    } catch (err) {
      console.warn("Failed to submit review to server, saving locally instead:", err);
      // Fallback: Save review locally so it instantly appears and persists on static sites
      const addedReview: Review = {
        id: Date.now(),
        name: newReviewName,
        country: newReviewCountry || "Globe Explorer",
        trip: newReviewTrip,
        rating: newReviewRating,
        text: newReviewText,
        date: new Date().toISOString().split('T')[0]
      };
      const updatedReviews = [addedReview, ...reviews];
      setReviews(updatedReviews);
      try {
        localStorage.setItem("cool_j_local_reviews", JSON.stringify(updatedReviews));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
      setLastSubmittedReview(submittedInfo);
      setShowReviewToStoryNudge(true);
      setNewReviewName("");
      setNewReviewCountry("");
      setNewReviewText("");
      setReviewMessage("Your review has been successfully logged on your browser! Asante sana!");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const toggleFaq = (id: number) => {
    setFaqOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Structured Data Schema markup for local business & adventure agency validation
  const injectSchemaJSON = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cooljexpeditions.com";
    const schema = {
      "@context": "https://schema.org",
      "@type": "TouristInformationCenter",
      "name": "Cool J Expeditions",
      "image": `${origin}/assets/images/logo-black.jpg`,
      "@id": `${origin}/#local-seo`,
      "url": `${origin}/`,
      "telephone": "+254720572251",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Main Street Nanyuki Complex",
        "addressLocality": "Nanyuki",
        "addressRegion": "Laikipia County",
        "postalCode": "10400",
        "addressCountry": "KE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-0.0121",
        "longitude": "37.0721"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "07:00",
        "closes": "21:00"
      },
      "sameAs": [
        "https://wa.me/254720572251"
      ]
    };
    return JSON.stringify(schema);
  };

  return (
    <div id="home" className="bg-[#FAF8F5] text-[#1a1a1a] min-h-screen flex flex-col font-sans selection:bg-[#C9A24A]/35 selection:text-[#0b3d2e] w-full overflow-x-clip relative">
      
      {/* Dynamic JSON-LD Schema Script Tag for Premium Local SEO & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: injectSchemaJSON() }}
      />

      {/* HEADER SECTION WITH NAVIGATION & METRICS - STICKY ON MOBILE & DESKTOP */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EADFCF] shadow-sm px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20 gap-4 xl:gap-8">
          
          {/* Pillar 1 (Left): Logo */}
          <div className="flex items-center shrink-0">
            <Logo className="h-13 sm:h-14 w-auto" />
          </div>

          {/* Pillar 2 (Center): Perfectly Centered, Balanced Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-3 xl:gap-5 2xl:gap-6 px-3">
            <a href="#experiences" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Experiences
            </a>
            <a href="#landmarks" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Destinations & Fleet
            </a>
            <a href="#weather" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Live Weather
            </a>
            <a href="#builder" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              AI Planner
            </a>
            <a href="#resources" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Field Guides
            </a>
            <a href="#about" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              About Cool J
            </a>
            <a href="#field-stories" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap flex items-center gap-1">
              <span>Field Notes</span>
              <span className="bg-[#C9A24A]/25 text-[#0b3d2e] text-[9px] px-1 py-0.2 rounded font-black">NEW</span>
            </a>
            <a href="#testimonials" className="text-xs xl:text-[13.5px] 2xl:text-[14.5px] font-bold text-[#0b3d2e] hover:text-[#C9A24A] hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Reviews
            </a>
          </nav>

          {/* Pillar 3 (Right): Balanced CTA Button */}
          <div className="hidden lg:flex items-center shrink-0">
            <a
              href="#builder"
              className="bg-[#0b3d2e] hover:bg-[#06241c] text-[#FAF8F5] px-4 xl:px-5 py-2.5 rounded-xl text-[11px] xl:text-xs font-extrabold tracking-wider uppercase transition-all shadow-sm hover:shadow-md border border-[#C9A24A] whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              id="nav-quick-builder-btn"
            >
              Draft My Adventure
            </a>
          </div>

          {/* Smartphone hamburger menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-lg text-[#0b3d2e] hover:bg-[#F4EDE2] transition-colors focus:outline-none border border-[#EADFCF] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

        </div>

        {/* Smartphone dropdown mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#EADFCF] py-4 px-2 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-lg">
            <a 
              href="#experiences" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              Signature Experiences
            </a>
            <a 
              href="#landmarks" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              Destinations & Fleet
            </a>
            <a 
              href="#weather" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              Live Weather
            </a>
            <a 
              href="#builder" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              AI Journey Architect
            </a>
            <a 
              href="#resources" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              Explorer Base Resource
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              About Cool J
            </a>
            <a 
              href="#field-stories" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              Field Notes & Stories (New)
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-extrabold text-[#0b3d2e] hover:text-[#C9A24A] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-lg transition-colors"
            >
              Social Proof
            </a>
            <div className="pt-2 px-4">
              <a
                href="#builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-[#0b3d2e] hover:bg-[#06241c] text-white py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all block border border-[#C9A24A]"
              >
                Draft My Adventure
              </a>
            </div>
          </div>
        )}
      </header>

      {/* VISUALLY JAW-DROPPING CONTEMPORARY HERO UNIT */}
      <section className="relative overflow-hidden bg-[#0A3326] text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Background photo at 50% transparency on green background */}
        <img
          src={climberSunset}
          alt="Expedition Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none z-0"
          referrerPolicy="no-referrer"
        />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight font-extrabold tracking-tight">
              We don't show you <span className="text-[#D4A373] font-black tracking-tight">East Africa</span>. We introduce you.
            </h1>

            <p className="text-base sm:text-lg text-[#F2F8F4] max-w-2xl font-light leading-relaxed">
              Ascend to alpine glaciers with GUIDES who know every rock of Mount Kenya, track endangered black rhinos off the grid, and enter Maasai homesteads as friends-not tourists. Based out of beautiful Nanyuki, Kenya.
            </p>

            <div className="pt-4">
              <a
                href="#experiences"
                className="inline-flex items-center gap-2.5 bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0b3d2e] font-black px-8 py-4 rounded-xl text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-cta-explore-routes"
              >
                Explore Custom Routes <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Quick Stats Grid to establish immediate authority */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-white/10 text-center max-w-lg">
              <div>
                <span className="block text-xl sm:text-2xl font-serif font-black text-[#C9A24A]">20+</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Years Experience</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-serif font-black text-[#C9A24A]">100%</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Summit Safety</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-serif font-black text-[#C9A24A]">3+</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Countries Led</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-serif font-black text-[#C9A24A]">24/7</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Expert Backup</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(201,162,74,0.3)] border-4 border-[#C9A24A]/40 aspect-[4/3] bg-emerald-950 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(201,162,74,0.45)] ease-out cursor-pointer z-10">
              <img 
                src={climberSunset} 
                alt="Cool J and climber celebrating on Mt Kenya summit at golden sunset"
                className="w-full h-full object-cover aspect-[4/3] opacity-95 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-white">
                  "Mount Kenya is our home playground"
                </h3>
                <p className="text-xs text-gray-300 font-light mt-1">
                  Guiding Sirimon, Chogoria & Burguret routes safely with elite gear.
                </p>
              </div>
            </div>

            {/* Float badge for authentic certification proof - Compact on desktop to avoid blocking image/text */}
            <div className="absolute -bottom-4 right-0 sm:-bottom-6 sm:-right-2 md:-right-4 lg:-bottom-2 lg:-right-2 xl:-bottom-3 xl:-right-3 bg-[#C9A24A] text-[#0b3d2e] p-4 lg:p-2 xl:p-2.5 rounded-xl shadow-xl border border-white max-w-[200px] lg:max-w-[155px] xl:max-w-[168px] hidden sm:block z-20 backdrop-blur-sm">
              <div className="flex gap-2.5 lg:gap-1.5 items-start">
                <div className="h-8 w-8 lg:h-5.5 lg:w-5.5 xl:h-6 xl:w-6 rounded-full bg-[#0b3d2e] text-white flex items-center justify-center flex-shrink-0 mt-0.5 lg:mt-0">
                  <ShieldCheck className="h-4.5 w-4.5 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5 text-[#C9A24A]" />
                </div>
                <div>
                  <h4 className="text-[11px] lg:text-[8.5px] xl:text-[9.5px] font-black uppercase tracking-wider leading-tight">Certified Mountain Rescue Only</h4>
                  <p className="text-[9px] lg:text-[7.5px] xl:text-[8px] text-[#0b3d2e]/90 leading-tight sm:leading-normal mt-0.5">Equipped with Oxygen, Satellite SAT connection, altitude tracking.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SEO KEYWORD-OPTIMIZED EXPERIENCE CATALOG SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24" id="experiences">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24A]">
            BEST PRICE DIRECT OUT OF NANYUKI • 100% INDIVIDUAL DESTINATIONS
          </span>
          <h2 className="text-3xl sm:text-4.5xl font-serif font-black text-[#0b3d2e] mt-2 tracking-tight">
            Separated Expeditions & Regional Safaris
          </h2>
          <div className="h-1 w-20 bg-[#C9A24A] mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-normal">
            Every destination is carefully separated with dedicated custom itineraries, local park fees, and expert guides. Explore our primary home in Laikipia County, neighboring mountain circuits, classic Kenya safaris, and preserved grand expeditions.
          </p>
        </div>

        {/* Destination Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          <button
            type="button"
            onClick={() => setExpCountyFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              expCountyFilter === "all"
                ? "bg-[#0b3d2e] text-[#C9A24A] border-[#C9A24A] shadow-md"
                : "bg-white text-gray-700 border-[#EADFCF] hover:border-[#C9A24A] hover:bg-[#FAF8F5]"
            }`}
          >
            All Destinations ({EXPERIENCES.length})
          </button>
          <button
            type="button"
            onClick={() => setExpCountyFilter("laikipia")}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              expCountyFilter === "laikipia"
                ? "bg-[#0b3d2e] text-[#C9A24A] border-[#C9A24A] shadow-md"
                : "bg-white text-gray-700 border-[#EADFCF] hover:border-[#C9A24A] hover:bg-[#FAF8F5]"
            }`}
          >
            📍 Laikipia County (Home Base)
          </button>
          <button
            type="button"
            onClick={() => setExpCountyFilter("neighboring")}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              expCountyFilter === "neighboring"
                ? "bg-[#0b3d2e] text-[#C9A24A] border-[#C9A24A] shadow-md"
                : "bg-white text-gray-700 border-[#EADFCF] hover:border-[#C9A24A] hover:bg-[#FAF8F5]"
            }`}
          >
            🏔️ Neighboring Central & Northern Counties
          </button>
          <button
            type="button"
            onClick={() => setExpCountyFilter("kenya")}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              expCountyFilter === "kenya"
                ? "bg-[#0b3d2e] text-[#C9A24A] border-[#C9A24A] shadow-md"
                : "bg-white text-gray-700 border-[#EADFCF] hover:border-[#C9A24A] hover:bg-[#FAF8F5]"
            }`}
          >
            🦁 Other Kenya Safaris & Parks
          </button>
          <button
            type="button"
            onClick={() => setExpCountyFilter("grand")}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              expCountyFilter === "grand"
                ? "bg-[#0b3d2e] text-[#C9A24A] border-[#C9A24A] shadow-md"
                : "bg-white text-gray-700 border-[#EADFCF] hover:border-[#C9A24A] hover:bg-[#FAF8F5]"
            }`}
          >
            🌍 Regional Grand Expeditions
          </button>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERIENCES.filter((exp) => expCountyFilter === "all" || exp.countyGroup === expCountyFilter).map((exp) => (
            <div 
              key={exp.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D2] hover:border-[#C9A24A] shadow hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="relative h-60 bg-emerald-950 overflow-hidden">
                <img 
                  src={exp.imagePlaceholder} 
                  alt={exp.keyword} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating category tag */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
                  <span className="bg-white/95 backdrop-blur text-[#0b3d2e] text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider border border-[#EADFCF] shadow-sm">
                    {exp.emoji} {exp.category}
                  </span>
                  {exp.locationLabel && (
                    <span className="bg-[#0b3d2e]/90 text-[#C9A24A] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow">
                      📍 {exp.locationLabel}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between text-xs text-white">
                  <span>🎯 {exp.duration}</span>
                  <span className="text-[#C9A24A] font-bold">🔥 {exp.intensity} Difficulty</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0b3d2e] group-hover:text-[#C9A24A] transition-colors">
                    {exp.title}
                  </h3>
                  <span className="text-[10px] uppercase font-mono text-gray-500 tracking-wider block mt-1">
                    Circuit Focus: {exp.keyword}
                  </span>
                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#0b3d2e] tracking-wider block">
                      EXPERT HIGHLIGHTS:
                    </span>
                    {exp.highlights.map((hlt, hIdx) => (
                      <div key={hIdx} className="flex gap-2 items-start text-xs text-gray-700 leading-normal">
                        <CheckCircle className="h-4 w-4 text-[#C9A24A] flex-shrink-0 mt-0.5" />
                        <span>{hlt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2ECE2] flex justify-between items-center">
                  <div className="text-xs text-gray-500 font-medium">
                    Best Period: <span className="text-[#0b3d2e] font-bold">{exp.bestTime}</span>
                  </div>
                  <a 
                    href="#builder" 
                    onClick={() => {
                      if (exp.id === "mount-kenya") setRegion("Mount Kenya (Sirimon & Chogoria Summit Routes)");
                      else if (exp.id === "ngare-ndare") setRegion("Ngare Ndare Forest Reserve & Canopy Walkway");
                      else if (exp.id === "ol-pejeta") setRegion("Ol Pejeta Conservancy & Sweetwaters");
                      else if (exp.id === "solio-ranch") setRegion("Solio Ranch Rhino Sanctuary");
                      else if (exp.id === "aberdare-waterfalls") setRegion("Aberdare National Park & Mountain Waterfalls");
                      else if (exp.id === "samburu-special5") setRegion("Samburu National Reserve & Buffalo Springs");
                      else if (exp.id === "lewa-borana") setRegion("Lewa Wildlife & Borana Conservancies");
                      else if (exp.id === "lolldaiga-hills") setRegion("Lolldaiga Hills Wilderness");
                      else if (exp.id === "meru-national-park") setRegion("Meru National Park & Elsa Kopje");
                      else if (exp.id === "masai-mara") setRegion("Masai Mara National Reserve");
                      else if (exp.id === "amboseli-kilimanjaro") setRegion("Amboseli National Park");
                      else if (exp.id === "lake-nakuru") setRegion("Lake Nakuru & Great Rift Valley");
                      else if (exp.id === "tsavo-diani") setRegion("Tsavo National Parks & Diani Beach");
                      else if (exp.id === "uganda-gorilla") setRegion("Uganda Gorilla Trekking (Bwindi Impenetrable)");
                      else if (exp.id === "tanzania-kili") setRegion("Tanzania Expeditions (Mt. Kilimanjaro & Serengeti)");
                      else setRegion("Multi-Country East African Safari & Summit");
                    }}
                    className="text-[#0b3d2e] hover:text-[#C9A24A] font-bold text-xs tracking-wide flex items-center gap-1 uppercase transition-colors"
                  >
                    Draft Adventure <ArrowRight className="h-4 w-4 text-[#C9A24A]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Draft My Adventure CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0b3d2e] to-[#124b3b] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C9A24A]/40 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#C9A24A]">
              100% TAILOR-MADE ITINERARIES
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Ready to assemble your custom expedition across Laikipia & Kenya?
            </h3>
            <p className="text-xs text-gray-300 font-light">
              Get an instant transparent price quote based on your exact party size and travel dates.
            </p>
          </div>
          <a
            href="#builder"
            className="shrink-0 bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0b3d2e] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center gap-2"
          >
            Draft My Adventure <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </section>

      {/* LANDMARK DESTINATIONS GALLERY FOR TANZANIA & UGANDA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FCFAF7] border-t border-[#EAE1D2] scroll-mt-24" id="landmarks">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5C38]">EXPLORE EAST AFRICA</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0b3d2e] mt-1.5 tracking-tight">
              Landmark Destinations & Expeditions
            </h2>
            <div className="h-1 w-16 bg-[#8F5C38] rounded-full mx-auto mt-4" />
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              From the snow-capped volcanic slopes of Mount Kilimanjaro to the alpine valleys of Mount Kenya. Experience the ultimate peaks of East Africa guided by Cool J's elite team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Landmark 1 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-lg transition-all flex flex-col group h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={lenanaPeak} 
                  alt="Point Lenana 4985m summit peak Mount Kenya" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#0b3d2e] text-[#C9A24A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  Kenya
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8F5C38] block">Peak Elevation (4,985m)</span>
                  <h3 className="font-serif font-black text-lg text-[#0b3d2e] tracking-tight">Point Lenana</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Stand triumphantly at Point Lenana as the equatorial sun rises above the clouds. Fully guided trekking via scenic alpine valleys, steep slopes, and high lakes.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setRegion("Mount Kenya");
                    setActivity("Mountain climbing");
                    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-white hover:bg-[#8F5C38] hover:border-[#8F5C38] hover:text-white text-[#8F5C38] border border-[#8F5C38] text-xs font-bold py-2.5 rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Plan Expedition <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Landmark 2 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-lg transition-all flex flex-col group h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={teamShiptons} 
                  alt="Shipton's Camp and Sirimon mountain route Mount Kenya" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#0b3d2e] text-[#C9A24A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  Kenya
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8F5C38] block">Sirimon Route</span>
                  <h3 className="font-serif font-black text-lg text-[#0b3d2e] tracking-tight">Shipton's Camp</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Ascend past giant lobelias, giant senecio plants, valleys, and pristine glaciers. Rest at fully supported camps with our legendary team of professional porters.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setRegion("Mount Kenya");
                    setActivity("Mountain climbing");
                    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-white hover:bg-[#8F5C38] hover:border-[#8F5C38] hover:text-white text-[#8F5C38] border border-[#8F5C38] text-xs font-bold py-2.5 rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Plan Expedition <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Landmark 3 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-lg transition-all flex flex-col group h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={kilimanjaroTanzania} 
                  alt="Mount Kilimanjaro peak in Tanzania" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#0b3d2e] text-[#C9A24A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  Tanzania
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8F5C38] block">Roof of Africa</span>
                  <h3 className="font-serif font-black text-lg text-[#0b3d2e] tracking-tight">Mount Kilimanjaro</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Climb the highest freestanding volcanic mountain in the world. Fully coordinated ascents with specialized high-altitude safety monitoring and experienced guides.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setRegion("Tanzania (Kilimanjaro, Arusha)");
                    setActivity("Mountain climbing");
                    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-white hover:bg-[#8F5C38] hover:border-[#8F5C38] hover:text-white text-[#8F5C38] border border-[#8F5C38] text-xs font-bold py-2.5 rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Plan Expedition <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Landmark 4 (Uganda Gorilla Trekking) */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-lg transition-all flex flex-col group h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={ugandaBwindiImg} 
                  alt="Mountain Gorilla tracking in Bwindi Impenetrable Forest Uganda" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#0b3d2e] text-[#C9A24A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  Uganda
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8F5C38] block">Misty Highlands</span>
                  <h3 className="font-serif font-black text-lg text-[#0b3d2e] tracking-tight">Bwindi Forest</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Trek deep into the primeval rainforest to stand face-to-face with the majestic Mountain Gorillas. Expert local rangers and customized primate trekking permits.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setRegion("Uganda (Gorilla Trek)");
                    setActivity("Wildlife safaris");
                    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-white hover:bg-[#8F5C38] hover:border-[#8F5C38] hover:text-white text-[#8F5C38] border border-[#8F5C38] text-xs font-bold py-2.5 rounded-lg tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Plan Gorilla Trek <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Elite Safari Fleet & Live Wildlife Moments Sub-Showcase */}
          <div className="mt-20 pt-16 border-t border-[#E9E1D2]" id="fleet">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5C38]">FLEET & LIVE ACTION</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0b3d2e] mt-1.5 tracking-tight">
                Our Elite Safari Fleet & Live Wildlife Clips
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                Watch raw wildlife moments recorded live on tour or inspect our custom 4x4 Land Cruisers designed for ultimate overland comfort.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Fleet Column (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E9E1D2] p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8F5C38] uppercase font-bold tracking-wider block">THE EXPEDITION RIG</span>
                    <h4 className="font-serif font-black text-xl text-[#0b3d2e]">Toyota Land Cruiser 4x4</h4>
                  </div>
                </div>

                 {/* Tabs */}
                <div className="grid grid-cols-4 gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E9E1D2]">
                  <button
                    type="button"
                    onClick={() => setFleetActiveTab("lineup")}
                    className={`py-2 px-1 text-center text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer truncate ${
                      fleetActiveTab === "lineup"
                        ? "bg-[#0b3d2e] text-[#C9A24A] shadow"
                        : "text-gray-500 hover:text-[#0b3d2e]"
                    }`}
                  >
                    Fleet Lineup
                  </button>
                  <button
                    type="button"
                    onClick={() => setFleetActiveTab("savanna")}
                    className={`py-2 px-1 text-center text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer truncate ${
                      fleetActiveTab === "savanna"
                        ? "bg-[#0b3d2e] text-[#C9A24A] shadow"
                        : "text-gray-500 hover:text-[#0b3d2e]"
                    }`}
                  >
                    Savanna Habitats
                  </button>
                  <button
                    type="button"
                    onClick={() => setFleetActiveTab("interior")}
                    className={`py-2 px-1 text-center text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer truncate ${
                      fleetActiveTab === "interior"
                        ? "bg-[#0b3d2e] text-[#C9A24A] shadow"
                        : "text-gray-500 hover:text-[#0b3d2e]"
                    }`}
                  >
                    Luxury Cabin
                  </button>
                  <button
                    type="button"
                    onClick={() => setFleetActiveTab("paved")}
                    className={`py-2 px-1 text-center text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer truncate ${
                      fleetActiveTab === "paved"
                        ? "bg-[#0b3d2e] text-[#C9A24A] shadow"
                        : "text-gray-500 hover:text-[#0b3d2e]"
                    }`}
                  >
                    Base Rig
                  </button>
                </div>

                {/* Image Display */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E9E1D2] bg-[#FAF8F5] shadow-inner group">
                  <img
                    src={
                      fleetActiveTab === "lineup"
                        ? fleetLineup
                        : fleetActiveTab === "savanna"
                        ? fleetSavanna
                        : fleetActiveTab === "interior"
                        ? fleetInterior
                        : fleetPaved
                    }
                    alt="Cool J custom safari vehicle fleet"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-[#0b3d2e]/95 backdrop-blur-sm text-white p-3 rounded-lg flex flex-col gap-1 text-xs shadow-lg">
                    <p className="font-bold text-[#C9A24A]">
                      {fleetActiveTab === "lineup"
                        ? "Our Professional Fleet Lineup"
                        : fleetActiveTab === "savanna"
                        ? "Safari Fleet & Tour Briefing"
                        : fleetActiveTab === "interior"
                        ? "Luxurious Customized Interior"
                        : "Solo Wilderness Explorer"}
                    </p>
                    <p className="text-[10px] text-gray-300 leading-tight">
                      {fleetActiveTab === "lineup"
                        ? "A lineup of our customized green offroad safari Land Cruisers preparing with tour guests."
                        : fleetActiveTab === "savanna"
                        ? "Our signature green open-roof Land Cruisers with tourists and guides preparing for the drive"
                        : fleetActiveTab === "interior"
                        ? "Premium orthopaedic grey leather seats with a spacious, panoramic cabin"
                        : "Custom 4x4 rugged safari rig with heavy-duty recovery gear and open pop-up roof"}
                    </p>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F2ECE2] flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#8F5C38]/10 text-[#8F5C38] rounded-lg mt-0.5">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#0b3d2e] uppercase tracking-wider">Pop-Up Roof</h5>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">Mechanical pop-top frame for 360° unobstructed wildlife photo shoots.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F2ECE2] flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#8F5C38]/10 text-[#8F5C38] rounded-lg mt-0.5">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#0b3d2e] uppercase tracking-wider">Max Comfort</h5>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">Custom ergonomic grey leather seats with maximum back support.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F2ECE2] flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#8F5C38]/10 text-[#8F5C38] rounded-lg mt-0.5">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#0b3d2e] uppercase tracking-wider">Device Power</h5>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">Dedicated USB and custom power points at every seat row.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F2ECE2] flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#8F5C38]/10 text-[#8F5C38] rounded-lg mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#0b3d2e] uppercase tracking-wider">Full Offroad Rig</h5>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">High snorkel, double spare tires, offroad suspension, and cabin cooling box.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube Video Shorts Column (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E9E1D2] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#F2ECE2] pb-3">
                  <span className="p-1.5 bg-[#0b3d2e]/10 text-[#0b3d2e] rounded-lg">
                    <Video className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-serif font-black text-base text-[#0b3d2e]">Live Action Youtube Shorts</h4>
                    <p className="text-[10px] text-gray-400">Watch our live-action guest moments</p>
                  </div>
                </div>

                {/* Video Tabs Switcher */}
                <div className="flex gap-2 bg-[#FAF8F5] p-1 rounded-xl border border-[#E9E1D2]">
                  <button
                    type="button"
                    onClick={() => setVideoActiveTab("tuskers")}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      videoActiveTab === "tuskers"
                        ? "bg-[#0b3d2e] text-[#C9A24A] shadow"
                        : "text-gray-500 hover:text-[#0b3d2e]"
                    }`}
                  >
                    🐘 Elephant Crossing
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoActiveTab("hiking")}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      videoActiveTab === "hiking"
                        ? "bg-[#0b3d2e] text-[#C9A24A] shadow"
                        : "text-gray-500 hover:text-[#0b3d2e]"
                    }`}
                  >
                    ⛰️ Trail Spirits
                  </button>
                </div>

                {/* Embedded Shorts Player */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black border border-[#E9E1D2] shadow-md">
                  <iframe
                    src={
                      videoActiveTab === "tuskers"
                        ? "https://www.youtube.com/embed/lqoKvBXFVxU"
                        : "https://www.youtube.com/embed/N6QsJHx1u9c"
                    }
                    className="absolute inset-0 w-full h-full border-0"
                    title="Cool J Expeditions Live YouTube Shorts"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="bg-[#FCFAF7] border border-[#F2ECE2] rounded-xl p-3 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-[#8F5C38] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-gray-500 leading-normal">
                    <p>
                      {videoActiveTab === "tuskers" ? (
                        <span><strong>Tuskers Savanna Crossing:</strong> Watch beautiful wild elephant families crossing right in front of our customized Land Cruisers. Our safety-first drivers ensure safe proximity for epic shots.</span>
                      ) : (
                        <span><strong>Twende Twende - Trail Spirits:</strong> Twende Twende (Swahili for <em>&quot;Let&apos;s Go!&quot;</em>) is the high-morale chant of our mountain crew preparing climbers to conquer peaks.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Draft My Adventure CTA Banner */}
          <div className="mt-12 bg-gradient-to-r from-[#1b3028] to-[#0b3d2e] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C9A24A]/40 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#C9A24A]">
                READY TO EXPERIENCE REAL WILDERNESS?
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold">
                Lock in your 4x4 Cruiser, guides, and park circuits now
              </h3>
              <p className="text-xs text-gray-300 font-light">
                Tailored for families, solo climbers, photographers, and private exploration groups.
              </p>
            </div>
            <a
              href="#builder"
              className="shrink-0 bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0b3d2e] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center gap-2"
            >
              Draft My Adventure <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>



      {/* TRAVEL-SPECIFIC BOOKING INTEGRATION + DYNAMIC AI ACCEPTER */}
      <section className="bg-white py-12 sm:py-20 px-3 sm:px-6 lg:px-8 border-t border-[#EAE1D2] scroll-mt-24 overflow-x-clip w-full max-w-full" id="builder">
        <div className="max-w-6xl mx-auto w-full min-w-0">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 px-2">
            <span className="inline-block px-3 py-1 bg-[#F4EDE2] text-[#0b3d2e] border border-[#C9A24A]/30 rounded text-xs font-bold uppercase tracking-wider">
              REAL-TIME ITINERARY & EXPEDITION ARCHITECT
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0b3d2e] tracking-tight mt-2">
              Build Your Custom Expedition Plan
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Choose your parameters below for parties from 1 to 30 explorers. Our system dynamically computes real-time park tariffs, 4x4 Land Cruiser fleet logistics, and guide ratios across Mt. Kenya, Ngare Ndare, Samburu, Laikipia, and East Africa.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start w-full min-w-0">
            
            {/* Steps Container Form */}
            <form onSubmit={handleQuoteSubmit} className="lg:col-span-7 w-full min-w-0 bg-[#FAF8F5] p-3.5 sm:p-8 rounded-2xl border border-[#E9E1D2] shadow-sm space-y-6 overflow-hidden">
              
              <div className="text-sm font-bold text-[#0b3d2e] pb-2.5 border-b border-[#F2ECE2] flex flex-wrap items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 max-w-full">
                  <Compass className="h-5 w-5 text-[#C9A24A] shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-[#0b3d2e] truncate">Step 1: Choose Expedition Details</span>
                </div>
                <span className="text-[11px] font-bold text-[#C9A24A] bg-[#0b3d2e] px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                  1 - 30 Guests Supported
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 w-full min-w-0">
                
                <div className="sm:col-span-2 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 min-w-0">
                    <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider">
                      🌍 Target Destination / Circuit
                    </label>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 font-medium self-start sm:self-auto max-w-full break-words">
                      Kenya, Uganda, Tanzania & Cross-Border Combos
                    </span>
                  </div>
                  <select
                    className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs truncate"
                    value={region}
                    onChange={(e) => {
                      const newRegion = e.target.value;
                      setRegion(newRegion);
                      const options = getDurationOptions(newRegion);
                      const exists = options.some((opt) => opt.value === duration);
                      if (!exists) {
                        const reg = newRegion.toLowerCase();
                        if (reg.includes("uganda")) setDuration("4 days");
                        else if (reg.includes("tanzania")) setDuration("6 days");
                        else if (reg.includes("combo") || reg.includes("multi-country") || reg.includes("cross-border")) setDuration("10 days");
                        else setDuration("5 days");
                      }
                    }}
                  >
                    <optgroup label="📍 Laikipia County (Home Base & Direct Access)">
                      <option value="Ngare Ndare Forest Reserve & Canopy Walkway">Ngare Ndare Forest Reserve (Canopy Walk, Azure Natural Pools & Waterfalls)</option>
                      <option value="Ol Pejeta Conservancy & Sweetwaters">Ol Pejeta Conservancy & Sweetwaters (Last Northern White Rhinos & Chimps)</option>
                      <option value="Lewa Wildlife & Borana Conservancies">Lewa Wildlife & Borana Conservancies (Rhino Sanctuary & Wild Conservancies)</option>
                      <option value="Lolldaiga Hills Wilderness">Lolldaiga Hills Wilderness (Ancient Valleys & High Plateau Safaris)</option>
                    </optgroup>
                    
                    <optgroup label="🏔️ Neighboring Central & Northern Counties">
                      <option value="Mount Kenya (Sirimon & Chogoria Summit Routes)">Mount Kenya Summit Ascent (Sirimon, Chogoria, Naromoru)</option>
                      <option value="Solio Ranch Rhino Sanctuary">Solio Ranch Rhino Sanctuary (Nyeri County - Massive Rhino Breeding Haven)</option>
                      <option value="Aberdare National Park & Mountain Waterfalls">Aberdare National Park & Mountain Waterfalls (Karuru Falls & Cloud Forests)</option>
                      <option value="Samburu National Reserve & Buffalo Springs">Samburu National Reserve & Buffalo Springs (Special 5 Wildlife Circuit)</option>
                      <option value="Meru National Park & Elsa Kopje">Meru National Park & Elsa Kopje (Meru County - Pristine Wilderness)</option>
                    </optgroup>

                    <optgroup label="🦁 Other Kenya Safaris & Parks">
                      <option value="Masai Mara National Reserve">Masai Mara National Reserve (Great Migration & Big 5 Plains)</option>
                      <option value="Amboseli National Park">Amboseli National Park (Iconic Mt. Kilimanjaro Views & Big Tuskers)</option>
                      <option value="Lake Nakuru & Great Rift Valley">Lake Nakuru & Great Rift Valley (Flamingos & Rhino Sanctuary)</option>
                      <option value="Tsavo National Parks & Diani Beach">Tsavo East & West + Diani Beach (Red Elephants to Indian Ocean)</option>
                    </optgroup>

                    <optgroup label="🌍 Regional East Africa Expeditions (Uganda, Tanzania & Combos)">
                      <option value="Uganda Gorilla Trekking (Bwindi Impenetrable)">Uganda Gorilla Trekking (Bwindi Impenetrable & Lake Bunyonyi)</option>
                      <option value="Tanzania Expeditions (Mt. Kilimanjaro & Serengeti)">Tanzania Expeditions (Mt. Kilimanjaro Summit & Serengeti Plains)</option>
                      <option value="Uganda & Tanzania Cross-Border Safari & Gorilla Combo">Uganda & Tanzania Cross-Border Combo (Bwindi Gorillas + Serengeti Safari)</option>
                      <option value="Multi-Country East African Safari & Summit">Multi-Country Grand Tour (Kenya + Tanzania + Uganda Combo)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="min-w-0 w-full">
                  <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider mb-1.5">
                    🎯 Vibe & Specialty Activity
                  </label>
                  <select
                    className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs truncate"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                  >
                    <option value="Mountain climbing">Mountain Peak Climbing & Summiting</option>
                    <option value="Canopy walk & Waterfall Swimming">Canopy Walk & Waterfall Swimming (Ngare Ndare)</option>
                    <option value="Wildlife tracking & Big 5 Safaris">Wildlife Tracking & Big 5 Game Drives</option>
                    <option value="Cultural immersion">Cultural Immersion (Samburu & Maasai Communities)</option>
                    <option value="Photography & Birding">Extreme Photography & Birding Expeditions</option>
                    <option value="Luxury tented safari">Luxury Tented Eco-Lodge Safari</option>
                    <option value="Mixed adventure">Combined Multi-Day Trekking & Safari</option>
                  </select>
                </div>

                <div className="min-w-0 w-full">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider">
                      📅 Trip Duration (Linked to Destination)
                    </label>
                  </div>
                  <select
                    className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs truncate"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    {getDurationOptions(region).map((opt) => (
                      <option key={opt.value + opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0 w-full">
                  <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider mb-1.5">
                    💰 Expedition Tier Guide
                  </label>
                  <select
                    className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs truncate"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="$1,000 - $1,500">$1,000 - $1,500 Budget Explorer Tier</option>
                    <option value="$1,500 - $2,500">$1,500 - $2,500 Standard Full-Service Safari</option>
                    <option value="$2,500 - $3,500">$2,500 - $3,500 Premium Wilderness Tier</option>
                    <option value="$3,500+">$3,500+ Luxury Private Conservancies Tier</option>
                  </select>
                </div>

                <div className="min-w-0 w-full">
                  <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider mb-1.5">
                    🚀 Preferred Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* Accommodation & Meals Information Note */}
                <div className="sm:col-span-2 min-w-0 w-full bg-[#FAF8F5] border border-[#E8E0D4] rounded-xl p-3 sm:p-3.5 text-xs text-gray-700 flex items-start gap-2.5 shadow-xs">
                  <span className="text-[#C9A24A] text-base leading-none mt-0.5 shrink-0">ℹ️</span>
                  <div className="leading-relaxed text-[11px] sm:text-xs min-w-0 break-words">
                    <span className="font-bold text-[#0b3d2e]">Accommodation & Dining: </span>
                    Most of our international travelers have their own accommodations and meal plans sorted according to personal preferences. 
                    <span className="font-bold text-[#8F5C38]"> Need us to take care of it?</span> Cool J and the team can gladly book curated luxury safari lodges, wilderness eco-camps, or mountain huts upon request at direct local partner rates!
                  </div>
                </div>

                <div className="sm:col-span-2 min-w-0 w-full bg-[#F3EFE8] p-3 sm:p-4 rounded-xl border border-[#E3DBD0] overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5 min-w-0">
                    <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider truncate">
                      👥 Explorer Group Count ({guestsCount} {guestsCount === 1 ? "Traveler" : "Travelers"})
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C9A24A] bg-[#0b3d2e] px-2.5 py-0.5 rounded self-start sm:self-auto shrink-0 shadow-xs">
                      {liveQuote.vehiclesNeeded} x 4x4 Cruiser{liveQuote.vehiclesNeeded > 1 ? "s" : ""} Assigned
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-3 w-full min-w-0">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-lg bg-white border border-[#DDD5C7] text-[#0b3d2e] font-black hover:bg-[#C9A24A]/20 transition-all shadow-sm active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <input 
                      type="range"
                      min="1"
                      max="30"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                      className="flex-1 min-w-0 accent-[#0b3d2e] h-2 bg-gray-200 rounded-lg cursor-pointer"
                    />

                    <div className="w-12 sm:w-16 text-center shrink-0">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-full bg-white border border-[#DDD5C7] rounded-lg p-1.5 text-center text-xs sm:text-sm font-bold text-[#0b3d2e] font-mono shadow-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(30, guestsCount + 1))}
                      className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-lg bg-white border border-[#DDD5C7] text-[#0b3d2e] font-black hover:bg-[#C9A24A]/20 transition-all shadow-sm active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Select Preset Buttons */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-3 pt-2.5 border-t border-[#E8E0D4] items-center min-w-0">
                    <span className="text-[10px] font-bold text-gray-500 mr-1 shrink-0">Quick Select:</span>
                    {[
                      { count: 1, label: "1 Solo" },
                      { count: 2, label: "2 Couple" },
                      { count: 4, label: "4 Family" },
                      { count: 6, label: "6 Full Cruiser" },
                      { count: 12, label: "12 (2 Cruisers)" },
                      { count: 18, label: "18 (3 Cruisers)" },
                      { count: 30, label: "30 Caravan" }
                    ].map((preset) => (
                      <button
                        key={preset.count}
                        type="button"
                        onClick={() => setGuestsCount(preset.count)}
                        className={`text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                          guestsCount === preset.count
                            ? "bg-[#0b3d2e] text-[#C9A24A] shadow-sm"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-2 min-w-0 w-full">
                <div className="text-sm font-bold text-[#0b3d2e] pb-2 border-b border-[#F2ECE2] mb-3 flex items-center gap-2 min-w-0">
                  <Users className="h-5 w-5 text-[#C9A24A] shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-[#0b3d2e] truncate">Step 2: Traveler Contact Info</span>
                </div>

                <div className="space-y-3.5 min-w-0 w-full">
                  <div className="min-w-0 w-full">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      id="quote-fullname-input"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5 min-w-0 w-full">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      id="quote-email-input"
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp (e.g. +254 720 572 251 or +44...)"
                      className="w-full max-w-full min-w-0 bg-white border border-[#DDD5C7] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A24A] focus:outline-none text-[#1a1a1a] shadow-xs"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      id="quote-whatsapp-input"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-4 w-full min-w-0">
                <button
                  type="submit"
                  disabled={isLiningUpQuote}
                  className="w-full bg-[#0b3d2e] hover:bg-[#06241c] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md border border-[#C9A24A] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  id="quote-submit-btn"
                >
                  {isLiningUpQuote ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      <span className="truncate">Locking in custom rates...</span>
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 text-[#C9A24A] shrink-0" />
                      <span className="truncate">Lock in Official Quote ID & Confirmation</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Live Price estimate & Instant checkout panel */}
            <div className="lg:col-span-5 w-full min-w-0 space-y-6">
              
              <div className="bg-[#FAF8F5] border-2 border-[#C9A24A]/50 rounded-2xl p-3.5 sm:p-6 shadow-md relative overflow-hidden flex flex-col min-w-0 w-full">
                <div className="absolute top-0 right-0 h-14 w-14 sm:h-16 sm:w-16 bg-[#C9A24A]/10 rounded-bl-3xl flex items-center justify-center text-[#C9A24A]">
                  <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                  <h4 className="text-xs uppercase tracking-widest font-black text-[#C9A24A]">
                    Live Dynamic Price Engine
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono shadow-xs shrink-0">
                    Instant Calculation Active
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mt-2 italic border-l-2 border-[#C9A24A] pl-3 leading-relaxed break-words">
                  "{renderDynamicTextSummary()}"
                </p>

                <div className="mt-4 space-y-4 min-w-0 w-full">
                  {/* Currency Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Currency:</span>
                    <div className="bg-[#F3EFE9] p-1 rounded-xl flex gap-1 border border-[#E4DDD3] overflow-x-auto max-w-full">
                      {(['USD', 'KES', 'EUR', 'GBP', 'CAD'] as const).map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setSelectedCurrency(curr)}
                          className={`text-[10px] font-black py-1 px-2.5 rounded-lg transition-all tracking-wider text-center cursor-pointer shrink-0 ${
                            selectedCurrency === curr
                              ? "bg-[#0b3d2e] text-[#C9A24A] shadow-xs"
                              : "text-gray-600 hover:text-[#0b3d2e] hover:bg-white/50"
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Price Card */}
                  <div className="bg-[#FCFAF5] p-3 sm:p-4 rounded-xl border border-[#EEE8DF] min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 min-w-0">
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase tracking-wider block font-bold leading-tight">
                          Estimated Total ({guestsCount} {guestsCount === 1 ? "Explorer" : "Explorers"} • {duration})
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-[#0b3d2e] mt-1 break-words">
                          {formatConvertedPrice(quoteResponse ? quoteResponse.amount : liveQuote.totalAmount)}
                        </div>
                      </div>
                      <div className="sm:text-right shrink-0 bg-[#0b3d2e]/5 sm:bg-transparent px-2.5 py-1.5 sm:p-0 rounded-lg self-start sm:self-auto">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Per Person</span>
                        <div className="text-sm sm:text-base font-bold text-[#8F5C38]">
                          {formatConvertedPrice(quoteResponse ? Math.round(quoteResponse.amount / guestsCount) : liveQuote.perPerson)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#EEE8DF] flex flex-wrap justify-between items-center gap-1.5 text-xs min-w-0">
                      <span className="text-gray-600 font-medium">Recommended 35% Deposit:</span>
                      <span className="font-bold text-[#0b3d2e] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                        {formatConvertedPrice(quoteResponse ? Math.round(quoteResponse.amount * 0.35) : liveQuote.deposit)}
                      </span>
                    </div>

                    {/* Breakdown details */}
                    <div className="mt-3 pt-2 border-t border-dashed border-gray-200 text-[10px] text-gray-500 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className="truncate">• 4x4 Land Cruiser Fleet ({liveQuote.vehiclesNeeded} veh):</span>
                        <span className="font-medium text-gray-700 font-mono shrink-0">${liveQuote.transportEstimate}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className="truncate">• Park / Conservation Permits ({guestsCount} pax):</span>
                        <span className="font-medium text-gray-700 font-mono shrink-0">${liveQuote.parkFeeEstimate}</span>
                      </div>
                      <div className="flex justify-between items-center bg-emerald-50/60 p-1.5 rounded border border-emerald-100 text-emerald-900 gap-2 min-w-0">
                        <span className="font-medium truncate">• Expedition Crew & Guiding:</span>
                        <span className="font-bold text-emerald-800 text-[9px] uppercase tracking-wide shrink-0">✓ All-Inclusive</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-amber-50/60 p-1.5 rounded border border-amber-100 text-amber-900 gap-1 sm:gap-2 min-w-0">
                        <span className="font-medium truncate">• Accommodation & Dining:</span>
                        <span className="font-semibold text-[#8F5C38] text-[9px] shrink-0">Self-Arranged (Assisted on Request)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 min-w-0 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
                      <button
                        type="button"
                        onClick={() => setIsMpesaOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-2 sm:px-3 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 truncate"
                        id="trigger-mpesa-checkout-modal"
                      >
                        💸 M-Pesa Pay (10 KES Test)
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateItinerary}
                        className="w-full bg-white border hover:bg-gray-50 text-gray-700 font-bold py-3 px-2 sm:px-3 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1 border-gray-300 cursor-pointer shadow-xs active:scale-95 truncate"
                        id="trigger-itinerary-ai-btn"
                      >
                        <Route className="h-3.5 w-3.5 text-[#C9A24A] shrink-0" /> <span className="truncate">AI Itinerary</span>
                      </button>

                      <a
                        href={`https://wa.me/254720572251?text=${getWhatsAppMessage(true)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:col-span-2 bg-[#25D366] hover:bg-[#20ba5c] text-white font-extrabold py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-1 text-center"
                        id="trigger-whatsapp-confirm-btn"
                      >
                        💬 Confirm & Inquire on WhatsApp ({guestsCount} Pax)
                      </a>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-[#E8DEC8] space-y-2.5 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] min-w-0">
                        <span className="font-bold text-[#0b3d2e] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                          <ShieldCheck className="h-4 w-4 text-[#C9A24A] shrink-0" />
                          Accepted Payment Modes:
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto flex items-center gap-1 shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Verified Direct Settlement
                        </span>
                      </div>

                      {/* Premium Payment Logos Grid */}
                      <div className="grid grid-cols-5 gap-1 sm:gap-2 pt-0.5 w-full min-w-0">
                        {/* M-PESA */}
                        <div 
                          className="bg-gradient-to-b from-white to-[#F6FDF8] border border-emerald-400/60 hover:border-emerald-500 rounded-lg py-1.5 px-0.5 sm:py-2 sm:px-1 flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer text-center min-w-0 overflow-hidden" 
                          title="Lipa Na M-Pesa (Kenya Instant Mobile Money)"
                        >
                          <div className="flex items-center justify-center gap-0.5 sm:gap-1 max-w-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00A859] shrink-0" />
                            <span className="text-[8px] sm:text-xs font-black tracking-tight text-[#00A859] font-sans leading-none truncate">M-PESA</span>
                          </div>
                          <span className="text-[7px] text-gray-400 font-mono mt-0.5 font-bold uppercase truncate max-w-full">Safaricom</span>
                        </div>

                        {/* VISA */}
                        <div 
                          className="bg-gradient-to-b from-white to-blue-50/40 border border-blue-200 hover:border-blue-400 rounded-lg py-1.5 px-0.5 sm:py-2 sm:px-1 flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer text-center min-w-0 overflow-hidden" 
                          title="Visa International Debit & Credit"
                        >
                          <span className="text-[9px] sm:text-xs font-black italic tracking-wider text-[#1A1F71] font-sans leading-none truncate">
                            VISA
                          </span>
                          <span className="text-[7px] text-gray-400 font-mono mt-0.5 font-bold uppercase truncate max-w-full">Global</span>
                        </div>

                        {/* MASTERCARD */}
                        <div 
                          className="bg-gradient-to-b from-white to-amber-50/40 border border-amber-200 hover:border-amber-400 rounded-lg py-1.5 px-0.5 sm:py-2 sm:px-1 flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer text-center min-w-0 overflow-hidden" 
                          title="Mastercard Global Secured Checkout"
                        >
                          <div className="flex items-center justify-center -space-x-1 shrink-0">
                            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#EB001B] opacity-90" />
                            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
                          </div>
                          <span className="text-[7px] text-gray-500 font-mono mt-0.5 font-bold uppercase truncate max-w-full">Master</span>
                        </div>

                        {/* AMERICAN EXPRESS */}
                        <div 
                          className="bg-gradient-to-b from-white to-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg py-1.5 px-0.5 sm:py-2 sm:px-1 flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer text-center min-w-0 overflow-hidden" 
                          title="American Express Card"
                        >
                          <span className="text-[8px] sm:text-[10px] font-black tracking-tight text-[#006FCF] font-sans bg-[#006FCF]/10 px-0.5 sm:px-1 py-0.5 rounded leading-none truncate">
                            AMEX
                          </span>
                          <span className="text-[7px] text-gray-400 font-mono mt-0.5 font-bold uppercase truncate max-w-full">Secure</span>
                        </div>

                        {/* BANK WIRE / SWIFT */}
                        <div 
                          className="bg-gradient-to-b from-white to-emerald-50/40 border border-[#C9A24A]/40 hover:border-[#C9A24A] rounded-lg py-1.5 px-0.5 sm:py-2 sm:px-1 flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer text-center min-w-0 overflow-hidden" 
                          title="Direct International Bank Wire / SWIFT / RTGS Transfer"
                        >
                          <span className="text-[8px] sm:text-[10px] font-black tracking-tight text-[#0b3d2e] font-mono leading-none truncate">
                            SWIFT
                          </span>
                          <span className="text-[7px] text-[#C9A24A] font-mono mt-0.5 font-bold uppercase truncate max-w-full">Wire TRF</span>
                        </div>
                      </div>

                      {/* Security note */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] text-gray-500 font-mono pt-1 min-w-0">
                        <span className="flex items-center gap-1 shrink-0">🔒 256-Bit SSL Encrypted</span>
                        <span className="flex items-center gap-1 shrink-0">⚡ Zero Surcharge Guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic AI travel guide panel display */}
              {(isGeneratingItinerary || generatedItinerary || itineraryError) && (
                <div className="bg-white border border-[#E9E1D2] rounded-2xl p-6 shadow-inner space-y-4 animate-fadeIn max-h-[500px] overflow-y-auto font-sans leading-relaxed">
                  
                  <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE2]">
                    <div className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-[#C9A24A]" />
                      <span className="font-serif font-black text-sm text-[#0b3d2e] uppercase tracking-wide">
                        Custom AI Daily Guide Formulated
                      </span>
                    </div>
                    {isGeneratingItinerary && <Loader2 className="h-4 w-4 animate-spin text-[#C9A24A]" />}
                  </div>

                  {isGeneratingItinerary ? (
                    <div className="text-center py-8 space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin text-[#0b3d2e] mx-auto" />
                      <p className="text-xs text-gray-500 italic">Cool J's regional database processing itinerary for {guestsCount} travelers...</p>
                    </div>
                  ) : itineraryError ? (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100">
                      {itineraryError}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-700 space-y-4">
                      
                      {/* Formatted markdown simulator output rendering */}
                      <div className="prose prose-sm text-gray-800">
                        {generatedItinerary.split('\n').map((line, idx) => {
                          if (line.startsWith('###')) {
                            return <h4 key={idx} className="font-serif font-black text-sm text-[#0b3d2e] mt-4 mb-2">{line.replace('###', '').trim()}</h4>;
                          }
                          if (line.startsWith('**')) {
                            return <p key={idx} className="font-bold text-[#0b3d2e] mt-3">{line.replace(/\*\*/g, '').trim()}</p>;
                          }
                          if (line.startsWith('-')) {
                            return <li key={idx} className="list-disc list-inside ml-2 my-1">{line.replace('-', '').trim()}</li>;
                          }
                          return <p key={idx} className="my-1.5 text-gray-600">{line}</p>;
                        })}
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* AUTHENTIC EXPEDITION FIELD GALLERY & SUMMIT TRIUMPHS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] border-t border-b border-[#EADEC9] scroll-mt-24" id="gallery">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8F5C38] bg-[#8F5C38]/10 px-4 py-1.5 rounded-full inline-block">
              GENUINE EXPEDITION ARCHIVES • NO STOCK PHOTOS
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-serif font-black text-[#0b3d2e] tracking-tight leading-tight">
              Authentic Moments With Cool J & Travelers
            </h2>
            <div className="h-1 w-20 bg-[#8F5C38] rounded-full mx-auto" />
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              Every photo across our site represents real expeditions led by Cool J and our registered mountain rangers. From high altitude summits on Point Lenana to azure glacial waterfalls and private conservancy game tracks.
            </p>
          </div>

          {/* Main Featured Showcase & Thumbnails Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Featured Column */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#8F5C38]/40 aspect-[16/10] bg-emerald-950 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(143,92,56,0.35)]">
                <img 
                  src={AUTHENTIC_GALLERY[galleryActiveIdx].image} 
                  alt={AUTHENTIC_GALLERY[galleryActiveIdx].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category & Badge overlay */}
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="bg-[#8F5C38] text-white text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow">
                    {AUTHENTIC_GALLERY[galleryActiveIdx].badge}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-[#FAF8F5] text-[10px] font-mono font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                    📍 {AUTHENTIC_GALLERY[galleryActiveIdx].location}
                  </span>
                </div>

                {/* Bottom title gradient strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#FAF8F5]">
                    {AUTHENTIC_GALLERY[galleryActiveIdx].title}
                  </h3>
                  <p className="text-xs text-gray-200 mt-1 font-light leading-relaxed">
                    {AUTHENTIC_GALLERY[galleryActiveIdx].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Selectors Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <span className="text-[11px] font-mono font-bold text-[#8F5C38] uppercase tracking-wider">
                Select Expedition Story:
              </span>

              <div className="grid grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {AUTHENTIC_GALLERY.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGalleryActiveIdx(idx)}
                    className={`text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex gap-2.5 items-center ${
                      galleryActiveIdx === idx
                        ? "bg-[#0b3d2e] text-white border-[#C9A24A] shadow-md scale-[1.02]"
                        : "bg-white text-gray-800 border-[#EADEC9] hover:bg-[#F4ECE0]"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-black/10">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className={`text-[9px] uppercase font-mono font-bold block truncate ${
                        galleryActiveIdx === idx ? "text-[#C9A24A]" : "text-[#8F5C38]"
                      }`}>
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold truncate leading-tight mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>

              {/* Safety commitment banner */}
              <div className="pt-2">
                <div className="p-4 bg-white rounded-xl border-2 border-[#EADEC9] flex items-center justify-between gap-3 shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-[#8F5C38] font-mono block">100% Certified Direct Guiding</span>
                    <p className="text-[11px] text-gray-500">Every client travels with Cool J's verified professional crew.</p>
                  </div>
                  <a
                    href="#builder"
                    className="shrink-0 bg-[#0b3d2e] text-[#C9A24A] font-bold text-[11px] px-3.5 py-2 rounded-lg hover:bg-[#06241c] transition-all flex items-center gap-1"
                  >
                    Plan Trip <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* WEATHER FORECAST HUB */}
      <WeatherForecast />

      {/* WHY CHOOSE COOL J ACCREDITATION */}
      <section className="bg-[#0b3d2e] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-24" id="about">
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#C9A24A]">
              THE MAN, THE LEGEND
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-serif font-extrabold tracking-tight">
              A Message from Cool J
            </h2>
            <div className="h-1 w-16 bg-[#C9A24A] rounded-full" />

            <div className="text-sm font-light text-gray-200 space-y-4 leading-relaxed">
              <p>
                "East Africa has a pulse. It isn't found through a bus window, nor is it written inside standard guidebooks. You only experience it when you step onto the trails with absolute respect, local alignment, and custom cadence."
              </p>
              <p>
                "For over 20 years, my team and I have taken people from around the world safely up some of the most beautiful vertical rock routes of Mount Kenya, through private conservancies, and across border crossings. We treat you as family, supporting local porters and chef associations directly."
              </p>
              <p>
                "Bring your dreams. Leave the logistics to us. Karibu sana (Welcome warmly)!"
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10 items-center">
              <div className="h-12 w-12 rounded-full border-2 border-[#C9A24A] overflow-hidden bg-emerald-950 flex-shrink-0">
                <img 
                  src={coolJGuide} 
                  alt="John Mwangi M. (Cool J) guiding on the trail"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="block font-bold text-sm text-[#C9A24A]">John Mwangi M. (Cool J)</span>
                <span className="text-[10px] text-gray-300 font-mono">Founder & Mountain Technical Lead</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] text-[#1a1a1a] p-8 rounded-2xl border border-white/10 shadow-xl space-y-6">
            <h4 className="font-serif font-black text-[#0b3d2e] text-lg">
              The Cool J Guarantee
            </h4>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#EADFCF] text-[#0b3d2e] flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#0b3d2e]">Full-Staff Porting Protection</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">
                    We strictly enforce porters protection limits, ensuring fair payloads, warm technical gear handouts, and top-tier mountain wages.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#EADFCF] text-[#0b3d2e] flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#0b3d2e]">Flexible Booking Protections</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">
                    Rainy weather forecasts? Adjust your Mt Kenya trek up to 48 hours beforehand with absolutely zero rescheduling fees.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#EADFCF] text-[#0b3d2e] flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#0b3d2e]">Secure Local Escutcheon</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">
                    Instant transparency tracking for national park gate fees. We support instant cash-free local money routing securely.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Section Draft My Adventure CTA Banner for About */}
        <div className="max-w-5xl mx-auto mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C9A24A]/40 shadow-lg relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#C9A24A]">
              CLIMB WITH EXPERT LOCALS
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Ready to climb or trek with Cool J and our certified team?
            </h3>
            <p className="text-xs text-gray-200 font-light">
              Craft your custom expedition parameters with direct mountain support.
            </p>
          </div>
          <a
            href="#builder"
            className="shrink-0 bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0b3d2e] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center gap-2"
          >
            Draft My Adventure <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* DEDICATED RESOURCE CENTER */}
      <ResourceCenter />

      {/* SOCIAL PROOF & LIVE REVIEWS FEED */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24" id="testimonials">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24A]">
              GLOBAL OUTREACH SOUNDS
            </span>
            <h2 className="text-3xl font-serif font-black text-[#0b3d2e] tracking-tight leading-none">
              Social Proof & Guest Logs
            </h2>
            <div className="h-1 w-12 bg-[#C9A24A] rounded-full" />
            <p className="text-xs sm:text-xs text-gray-500 leading-relaxed">
              Read real logs left by our alpine climbers, culture searchers, and family traveler squads. Every memory documented here is authenticated.
            </p>

            <form onSubmit={handleReviewSubmit} className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E9E1D2] space-y-4">
              <span className="text-xs font-bold text-[#0b3d2e] uppercase block tracking-wider">
                Leave a Guest Review
              </span>

              {reviewMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 rounded font-medium">
                  {reviewMessage}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Sarah K.)"
                    className="w-full bg-white border border-[#DDD5C7] rounded p-2 text-xs focus:ring-1 focus:ring-[#C9A24A] text-[#1a1a1a]"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    required
                    id="review-submit-name-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Country (e.g. Germany)"
                    className="w-full bg-white border border-[#DDD5C7] rounded p-2 text-xs focus:ring-1 focus:ring-[#C9A24A] text-[#1a1a1a]"
                    value={newReviewCountry}
                    onChange={(e) => setNewReviewCountry(e.target.value)}
                    id="review-submit-country-input"
                  />
                  <select
                    className="w-full bg-white border border-[#DDD5C7] rounded p-1.5 text-xs focus:ring-1 focus:ring-[#C9A24A] text-[#1a1a1a] font-medium"
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  >
                    <option value={5}>🏆 5.0 / 5.0 - Exceptional Experience</option>
                    <option value={4}>🎖️ 4.0 / 5.0 - Highly Recommended</option>
                    <option value={3}>👍 3.0 / 5.0 - Good Expedition</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Trip Done (e.g. Mt Kenya 5-Day Sirimon)"
                    className="w-full bg-white border border-[#DDD5C7] rounded p-2 text-xs focus:ring-1 focus:ring-[#C9A24A] text-[#1a1a1a]"
                    value={newReviewTrip}
                    onChange={(e) => setNewReviewTrip(e.target.value)}
                    id="review-submit-trip-input"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your authentic experience with Cool J..."
                    className="w-full bg-white border border-[#DDD5C7] rounded p-2 text-xs focus:ring-1 focus:ring-[#C9A24A] text-[#1a1a1a]"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    id="review-submit-text-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-[#0b3d2e] hover:bg-[#06241c] text-white py-2 rounded text-[11px] uppercase tracking-wider font-extrabold transition-all border border-[#C9A24A] cursor-pointer"
                  id="review-submit-btn"
                >
                  {isSubmittingReview ? "Saving review..." : "Publish Guest Log"}
                </button>
              </div>

              {/* REVIEW TO EXPEDITION STORY NUDGE */}
              {showReviewToStoryNudge && lastSubmittedReview && (
                <div className="mt-4 p-3.5 bg-[#0B3D2E] text-white rounded-xl border-2 border-[#C9A24A] shadow-md animate-in fade-in zoom-in-95">
                  <div className="flex items-start gap-2.5">
                    <Zap className="h-4 w-4 text-[#C9A24A] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-[#C9A24A]">Turn Review into an Expedition Article?</h5>
                      <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed font-light">
                        Expand your experience with up to 2 authentic photos in our Field Stories feed to inspire future climbers!
                      </p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setStoryPrefill(lastSubmittedReview);
                            setShowReviewToStoryNudge(false);
                            const target = document.getElementById("field-stories");
                            if (target) target.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0B3D2E] font-black text-[10px] uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="h-3 w-3" /> Write 2-Photo Story ↗
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewToStoryNudge(false)}
                          className="text-[10px] text-gray-300 hover:text-white transition-colors underline cursor-pointer"
                        >
                          Maybe Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6 max-h-[640px] overflow-y-auto pr-2">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white p-6 rounded-xl border border-[#E9E1D2] hover:border-[#C9A24A]/70 shadow-sm space-y-3 hover:translate-y-[-2px] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      {rev.name.toLowerCase().includes("mfalme") ? (
                        <img 
                          src={mfalmeUkweliPortrait} 
                          alt={rev.name} 
                          className="h-10 w-10 rounded-full object-cover border border-[#C9A24A]/40 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : rev.name.toLowerCase().includes("roda") ? (
                        <img 
                          src={rodaPortrait} 
                          alt={rev.name} 
                          className="h-10 w-10 rounded-full object-cover border border-[#C9A24A]/40 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : rev.photo ? (
                        <img 
                          src={rev.photo} 
                          alt={rev.name} 
                          className="h-10 w-10 rounded-full object-cover border border-[#C9A24A]/40 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#F4EDE2] text-[#0b3d2e] flex items-center justify-center font-black text-sm border border-[#EADFCF]">
                          {rev.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-[#0b3d2e] text-sm">{rev.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono block">{rev.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FAF8F5] text-[#0b3d2e] px-2 py-0.5 rounded-full border border-[#E8DFC8]">
                      <Award className="h-3.5 w-3.5 text-[#C9A24A]" />
                      <span className="text-[10px] font-black font-mono tracking-tight text-[#0b3d2e]">
                        {rev.rating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  <span className="inline-block bg-[#F4EDE2] text-[#0b3d2e] text-[9px] font-bold px-2 py-0.5 rounded tracking-wide mt-2">
                    🗺️ {rev.trip}
                  </span>

                  <p className="text-xs text-gray-600 italic leading-relaxed mt-3">
                    "{rev.text}"
                  </p>
                </div>

                <div className="text-[10px] text-gray-400 text-right pt-2 font-mono">
                  Guided on: {formatDate(rev.date)}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Section Draft My Adventure CTA Banner for Testimonials */}
        <div className="mt-12 bg-gradient-to-r from-[#0b3d2e] to-[#124b3b] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C9A24A]/40 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#C9A24A]">
              JOIN HUNDREDS OF HAPPY SUMMITEERS
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Ready to create your own East African memories?
            </h3>
            <p className="text-xs text-gray-300 font-light">
              Customize your safari, trekking route, or private wilderness expedition today.
            </p>
          </div>
          <a
            href="#builder"
            className="shrink-0 bg-[#C9A24A] hover:bg-[#D9B85A] text-[#0b3d2e] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            Draft My Adventure <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* EXPEDITION FIELD STORIES & GUEST ARTICLES SECTION */}
      <FieldStoriesSection
        initialStoryPrefill={storyPrefill}
        onClearPrefill={() => setStoryPrefill(null)}
      />

      {/* FULLY FUNCTIONAL BRAND-ACCORDION FAQ ACCORDING TO SCHEMA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#EAE1D2] scroll-mt-24" id="faq">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#C9A24A]">SUPPORT HUB</span>
            <h2 className="text-3xl font-serif font-black text-[#0b3d2e] mt-1 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-xs text-gray-500 mt-2">
              All you need to understand about acclimatization levels, porter policy limits, and custom safari route planning.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((itm) => {
              const isOpen = !!faqOpenStates[itm.id];
              return (
                <div 
                  key={itm.id}
                  className="bg-[#FAF8F5] border border-[#E9E1D2] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(itm.id)}
                    className="w-full text-left p-5 flex justify-between items-center text-sm font-bold text-[#0b3d2e] hover:bg-[#F2ECE2] transition-colors"
                    id={`faq-toggle-btn-${itm.id}`}
                  >
                    <span>{itm.question}</span>
                    <span className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-xs text-[#0b3d2e] border border-[#DDD5C7] shadow-sm font-mono font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-5 border-t border-[#E9E1D2] bg-white text-xs text-gray-600 leading-relaxed font-normal animate-fadeIn">
                      <p>{itm.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section Draft My Adventure CTA Banner for FAQ */}
          <div className="mt-12 bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 text-[#0b3d2e] flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-[#C9A24A]/50 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#8F5C38]">
                HAVE SPECIFIC DATES IN MIND?
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0b3d2e]">
                Let's customize your full safari & summit itinerary
              </h3>
              <p className="text-xs text-gray-600 font-light">
                Calculate live prices, vehicle logistics, and reserve your expert local guide team.
              </p>
            </div>
            <a
              href="#builder"
              className="shrink-0 bg-[#0b3d2e] hover:bg-[#06241c] text-[#FAF8F5] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center gap-2 border border-[#C9A24A]"
            >
              Draft My Adventure <ArrowRight className="h-4 w-4 text-[#C9A24A]" />
            </a>
          </div>

        </div>
      </section>

      {/* FINAL TRANSFORMATIVE WHATSAPP CALL TO ACTION */}
      <section className="bg-[#0A3326] text-white py-16 px-4 text-center border-t border-[#C9A24A]">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#C9A24A]">LET'S LOCK IT IN</span>
          <h2 className="text-3xl sm:text-4.5xl font-serif font-black tracking-tight leading-none">
            Ready to Stand on Point Lenana?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            Message Cool J directly on WhatsApp for real-time mountain updates, custom team flight scheduling slots, or to run test payment allocations in safety.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="https://wa.me/254720572251?text=Hi%20Cool%20J%2C%20I'm%20interested%20in%20booking%20an%20expedition%20via%20your%20interactive%20portal!"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5c] text-white font-extrabold px-8 py-4 rounded-xl text-xs tracking-wider uppercase shadow-[0_10px_25px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] border border-white/20 cursor-pointer"
              id="footer-whatsapp-cta"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.529 1.771.815 2.796.815 3.183 0 5.769-2.586 5.769-5.766.001-3.182-2.585-5.769-5.769-5.769zm10.158 5.767c0 5.589-4.545 10.134-10.134 10.134-1.776 0-3.447-.463-4.904-1.272l-5.651 1.481 1.509-5.512c-.896-1.504-1.39-3.243-1.39-5.093 0-5.589 4.545-10.133 10.134-10.133 5.589 0 10.134 4.544 10.134 10.133z"/>
              </svg>
              <div className="text-left leading-tight">
                <span className="block font-black text-xs">Chat on WhatsApp</span>
                <span className="block text-[10px] text-emerald-100 font-mono font-normal">+254 720 572251 (Direct with Cool J)</span>
              </div>
            </a>

            <a
              href="mailto:jmichanjs@gmail.com?subject=Expedition Inquiry with Cool J"
              className="w-full sm:w-auto bg-[#07241B] hover:bg-[#0b3d2e] border-2 border-[#C9A24A] text-[#FAF8F5] font-extrabold px-8 py-4 rounded-xl text-xs tracking-wider uppercase shadow-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              id="footer-email-cta"
            >
              <div className="w-6 h-6 rounded-full bg-[#C9A24A]/20 flex items-center justify-center text-[#C9A24A]">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block font-black text-xs text-[#FAF8F5]">Official Email Desk</span>
                <span className="block text-[10px] text-[#C9A24A] font-mono font-normal">jmichanjs@gmail.com</span>
              </div>
            </a>
          </div>

          {/* Quick Pre-filled Chat Starters & Community Support */}
          <div className="mt-10 pt-8 border-t border-white/10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
              <p className="text-xs text-[#C9A24A] font-mono tracking-wider uppercase font-bold">
                Expedition Inquiries & Community Partnerships
              </p>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
              <a
                href="https://wa.me/254720572251?text=Jambo%20Cool%20J!%20I'd%20like%20to%20inquire%20about%20your%20Mount%20Kenya%20Summit%20expedition%20routes%20(Sirimon%20/%20Chogoria)%20and%20porter%20support."
                target="_blank"
                rel="noreferrer"
                className="bg-[#051C14]/80 hover:bg-[#07241B] border border-[#C9A24A]/40 hover:border-[#C9A24A] p-3.5 rounded-xl transition-all duration-200 group cursor-pointer block hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] group-hover:bg-[#C9A24A] group-hover:text-[#0b3d2e] transition-colors shrink-0">
                    <Mountain className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-[#C9A24A] transition-colors">Mount Kenya Ascent</h5>
                    <p className="text-[10px] text-gray-300 font-light mt-0.5">Sirimon / Chogoria routes, acclimatization & porters</p>
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/254720572251?text=Jambo%20Cool%20J!%20I'm%20interested%20in%20arranging%20a%20classic%20Wildlife%20Safari%20around%20Masai%20Mara%20or%20Ol%20Pejeta."
                target="_blank"
                rel="noreferrer"
                className="bg-[#051C14]/80 hover:bg-[#07241B] border border-[#C9A24A]/40 hover:border-[#C9A24A] p-3.5 rounded-xl transition-all duration-200 group cursor-pointer block hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] group-hover:bg-[#C9A24A] group-hover:text-[#0b3d2e] transition-colors shrink-0">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-[#C9A24A] transition-colors">Wildlife Safari Circuits</h5>
                    <p className="text-[10px] text-gray-300 font-light mt-0.5">Ol Pejeta, Masai Mara & custom 4x4 pop-top cruisers</p>
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/254720572251?text=Jambo%20Cool%20J!%20Please%20share%20details%20about%20the%20Gorilla%20Trekking%20packages%20in%20Bwindi%20or%20Rwanda."
                target="_blank"
                rel="noreferrer"
                className="bg-[#051C14]/80 hover:bg-[#07241B] border border-[#C9A24A]/40 hover:border-[#C9A24A] p-3.5 rounded-xl transition-all duration-200 group cursor-pointer block hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] group-hover:bg-[#C9A24A] group-hover:text-[#0b3d2e] transition-colors shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-[#C9A24A] transition-colors">Gorilla Trekking Permits</h5>
                    <p className="text-[10px] text-gray-300 font-light mt-0.5">Bwindi Impenetrable, Rwanda & border clearances</p>
                  </div>
                </div>
              </a>

              <a
                href="https://www.facebook.com/NanyukiGoodTimesBoxingClub"
                target="_blank"
                rel="noreferrer"
                className="bg-[#051C14]/80 hover:bg-[#07241B] border border-[#C9A24A]/40 hover:border-[#C9A24A] p-3.5 rounded-xl transition-all duration-200 group cursor-pointer block hover:shadow-lg hover:-translate-y-0.5"
                id="footer-boxing-club-link"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] group-hover:bg-[#C9A24A] group-hover:text-[#0b3d2e] transition-colors shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-white group-hover:text-[#C9A24A] transition-colors">Nanyuki Good Times Boxing Club</h5>
                      <span className="text-[10px] text-[#C9A24A]">↗</span>
                    </div>
                    <p className="text-[10px] text-gray-300 font-light mt-0.5">
                      Cool J Expeditions proudly supports Nanyuki Good Times Boxing Club & local community youth groups directly.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="pt-8">
            <ShareWidget />
          </div>
        </div>
      </section>

      {/* FOOTER METADATA */}
      <footer className="bg-black text-[#8E8B83] text-xs py-12 px-4 border-t border-[#C9A24A]/40 font-mono">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          
          <div className="space-y-3 font-sans">
            <Logo className="h-14 w-auto" variant="dark" />
            <div className="bg-[#07241B] border border-[#C9A24A]/35 rounded-xl p-3 shadow-inner">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#C9A24A] font-bold block mb-1">
                Registered Business Entity
              </span>
              <p className="text-white text-[11.5px] font-medium leading-snug">
                Cool J Expeditions <span className="text-gray-400 font-normal">under</span> <strong className="text-[#FAF8F5] font-semibold">The Great South Outdoors and Climbers</strong>
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8E8B83]">
              Premium customized Mount Kenya climbers, Serengeti migrations, Uganda Gorilla loops. Established direct local payments based in Nanyuki.
            </p>
          </div>

          <div>
            <h4 className="text-white text-[11px] tracking-wider uppercase font-extrabold mb-3">Expeditions & Stories</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#experiences" className="hover:text-[#C9A24A]">⛰️ Mount Kenya Summit (Sirimon Route)</a></li>
              <li><a href="#experiences" className="hover:text-[#C9A24A]">🦁 Ol Pejeta Rhino Safari Loop</a></li>
              <li><a href="#experiences" className="hover:text-[#C9A24A]">🦍 Bwindi Forest Gorilla Tracking</a></li>
              <li><a href="#field-stories" className="text-[#C9A24A] hover:underline font-bold">📝 Field Notes & Guest Stories (2-Photo Blog)</a></li>
              <li><a href="#experiences" className="hover:text-[#C9A24A]">🌍 Custom Multi-Country Expedition</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[11px] tracking-wider uppercase font-extrabold mb-3">Office Hub</h4>
            <p className="text-[11px]">📍 Baseline Equator Highway Crossing, Nanyuki, Kenya</p>
            <p className="text-[11px] mt-2">📱 +254 720 572251 (WhatsApp Master Desk)</p>
            <p className="text-[11px] mt-1">📧 jmichanjs@gmail.com</p>
          </div>

          <div>
            <h4 className="text-white text-[11px] tracking-wider uppercase font-extrabold mb-3">Authenticity Check</h4>
            <p className="text-[11px] leading-relaxed">
              Our custom treks and safaris are structured to respect the environment, support local guides fairly, and uplift families in the community.
            </p>
            <span className="inline-block mt-3 bg-white/5 px-2.5 py-1 rounded text-[9px] text-[#C9A24A] font-bold">
              ✓ Verified Sustainable Tour Provider
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 gap-4 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Cool J Expeditions (The Great South Outdoors and Climbers). All Rights Reserved.</span>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
            <button 
              onClick={() => {
                setPrivacyModalTab("privacy");
                setIsPrivacyOpen(true);
              }}
              className="hover:text-[#C9A24A] hover:underline cursor-pointer transition-colors"
            >
              Privacy Policy & Trust
            </button>
            <span className="text-gray-700">|</span>
            <button 
              onClick={() => {
                setPrivacyModalTab("cookies");
                setIsPrivacyOpen(true);
              }}
              className="hover:text-[#C9A24A] hover:underline cursor-pointer transition-colors"
            >
              Cookie Policy & Preferences
            </button>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE LIPA NA M-PESA POPUP DIALOG */}
      <MpesaSimModal
        isOpen={isMpesaOpen}
        onClose={() => setIsMpesaOpen(false)}
        usdAmount={quoteResponse ? quoteResponse.amount : 250}
        quoteId={quoteResponse ? quoteResponse.quoteId : "CJE-FALLBACK"}
      />

      {/* PRIVACY & COOKIE POLICY MODAL */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        defaultTab={privacyModalTab}
      />

      {/* GLOBAL COOKIE CONSENT BANNER (GDPR / CCPA / DPA 2019) */}
      <CookieConsentBanner
        onOpenPrivacyModal={() => {
          setPrivacyModalTab("cookies");
          setIsPrivacyOpen(true);
        }}
      />

      {/* PERSISTENT QUICK SUPPORT BUBBLE */}
      <QuickSupport
        selectedRegion={region}
        selectedActivity={activity}
        selectedDuration={duration}
        selectedGuests={guestsCount}
        selectedBudget={budget}
      />

      {/* SIMPLE FLOATING SCROLL BACK TO TOP ARROW (POSITIONED ON THE LEFT TO SEPARATE FROM WHATSAPP) */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 bg-white/95 hover:bg-white text-[#0b3d2e] hover:text-[#C9A24A] p-3 rounded-full shadow-lg border border-[#EADFCF] hover:border-[#C9A24A] backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
          id="scroll-to-home-btn"
          aria-label="Back to top"
          title="Back to Top"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-[#0b3d2e]" />
          <span className="sr-only">Back to Top</span>
        </button>
      )}

    </div>
  );
}
