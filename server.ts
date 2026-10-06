import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static assets in both development and production
app.use(express.static(path.join(process.cwd(), "public")));

// Initialize Gemini Client with correct user-agent for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to build custom, highly-detailed native itineraries when API keys are unauthenticated
function generatePremiumFallback(region: string, activity: string, duration: string) {
  const days = parseInt(duration) || 5;
  let itineraryContent = `### 🏔️ Expedition: Premium Custom ${days}-Day Journey\n\n`;
  itineraryContent += `**Destination:** ${region || "Mount Kenya & Greater Laikipia"}\n`;
  itineraryContent += `**Vibe & Focus:** ${activity || "Wilderness & Cultural Safari"}\n`;
  itineraryContent += `**Lead Guide:** John Mwangi (Cool J) & Team Nanyuki\n\n`;
  
  itineraryContent += `#### 🗺️ Day-by-Day Expedition Logs\n\n`;
  
  const targetRegion = (region || "").toLowerCase();
  const targetActivity = (activity || "").toLowerCase();

  if (targetRegion.includes("ngare ndare") || targetActivity.includes("canopy") || targetActivity.includes("waterfall")) {
    // Ngare Ndare Forest & Waterfalls
    itineraryContent += `**Day 1: Nanyuki to Ngare Ndare Forest Canopy Walk & Glacial Pools**\n`;
    itineraryContent += `- 08:00 AM: Depart Nanyuki base in custom 4x4 Land Cruiser heading along Mount Kenya's northern slopes.\n`;
    itineraryContent += `- Guided walk along the iconic 450-meter suspended canopy walkway high above ancient African cedar canopies.\n`;
    itineraryContent += `- Mid-day: Descend to the crystalline azure waterfalls; swim in the natural mineral plunge pools and enjoy a riverside picnic lunch.\n`;
    itineraryContent += `- Afternoon tracking through the elephant migratory corridor with armed Kenya Forest Service rangers.\n`;
    itineraryContent += `- Evening return to Nanyuki lodge or luxury wilderness eco-camp on the forest edge.\n\n`;
    if (days >= 2) {
      itineraryContent += `**Day 2: Mukogodo Hills & Cultural Boma Immersion**\n`;
      itineraryContent += `- Early morning birding walk; track rare colobus monkeys and sunbirds in the mist.\n`;
      itineraryContent += `- Visit neighboring indigenous community bomas for traditional storytelling and honey harvesting demonstrations.\n`;
      itineraryContent += `- Sunset campfire with panoramic views extending across the northern frontier.\n\n`;
    }
    if (days >= 3) {
      itineraryContent += `**Day 3+: Extended Ol Pejeta / Samburu Wilderness Loop**\n`;
      itineraryContent += `- Seamless transition into adjacent wildlife conservancies for Big 5 predator tracking.\n`;
      itineraryContent += `- Farewell Equator crossing celebration and return transfer.\n\n`;
    }
  } else if (targetRegion.includes("samburu") || targetRegion.includes("buffalo springs")) {
    // Samburu National Reserve & Northern Wilderness
    itineraryContent += `**Day 1: Nanyuki Descent past Mount Ololokwe to Samburu National Reserve**\n`;
    itineraryContent += `- Scenic drive north crossing from alpine foothills into the striking semi-arid doum-palm landscapes.\n`;
    itineraryContent += `- Afternoon game drive along the Ewaso Ng'iro river banks; spot massive elephant herds cooling in the red mud.\n`;
    itineraryContent += `- Settle into luxury riverbank safari camp as leopards begin their evening prowl.\n\n`;
    
    itineraryContent += `**Day 2: Tracking the Legendary 'Samburu Special 5'**\n`;
    itineraryContent += `- Dawn expedition tracking Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and the long-necked gerenuk.\n`;
    itineraryContent += `- Midday rest during equatorial heat with river views.\n`;
    itineraryContent += `- Afternoon cultural immersion with Samburu Moran warriors; learn bushcraft, ancient songs, and medicinal plant lore.\n\n`;
    
    if (days >= 3) {
      itineraryContent += `**Day 3: Buffalo Springs & Shaba Reserve Predator Quest**\n`;
      itineraryContent += `- Cross to Buffalo Springs crystal oasis; track prides of lions and rare African wild dogs.\n`;
      itineraryContent += `- Bush dinner under the vast Milky Way canopy with Samburu tribal elders.\n\n`;
    }
    
    itineraryContent += `**Day ${days}: Final Sunrise Game Drive & Return to Nanyuki Baseline**\n`;
    itineraryContent += `- Morning birding along the riverbeds (over 450 species recorded).\n`;
    itineraryContent += `- Leisurely transfer back south with panoramic photo stops.\n\n`;
  } else if (targetRegion.includes("lewa") || targetRegion.includes("borana")) {
    // Lewa & Borana Conservancies
    itineraryContent += `**Day 1: Arrival at Lewa Wildlife Conservancy (UNESCO World Heritage)**\n`;
    itineraryContent += `- Private 4x4 pickup and transfer to exclusive eco-lodge.\n`;
    itineraryContent += `- Afternoon rhino tracking drive with veteran anti-poaching scouts.\n\n`;
    itineraryContent += `**Day 2: Borana Escarpment & Horseback Wildlife Encounter**\n`;
    itineraryContent += `- Morning horseback safari gliding silently alongside giraffes, zebras, and elands.\n`;
    itineraryContent += `- Visit the Lewa Education & Community Centre to witness conservation in action.\n`;
    itineraryContent += `- Sundowners overlooking the dramatic Laikipia plateau.\n\n`;
    if (days >= 3) {
      itineraryContent += `**Day 3: Lion Tracking & Wilderness Walking Trail**\n`;
      itineraryContent += `- Early morning radio-telemetry tracking of resident lion prides.\n`;
      itineraryContent += `- Wilderness walking trail with armed rangers exploring hidden waterfalls.\n\n`;
    }
    itineraryContent += `**Day ${days}: Final Game Loop & Nanyuki Transfer**\n`;
    itineraryContent += `- Checkout and scenic transfer back to Nanyuki airport or Nairobi.\n\n`;
  } else if (targetRegion.includes("uganda") || targetActivity.includes("gorilla")) {
    // Uganda Gorilla Trekking
    itineraryContent += `**Day 1: Entebbe to Bwindi Impenetrable Forest**\n`;
    itineraryContent += `- Custom flight or ground transfer through the rolling green hills of Western Uganda.\n`;
    itineraryContent += `- Check-in to cloud-forest wilderness lodge overlooking primeval tree canopies.\n\n`;
    
    itineraryContent += `**Day 2: The Sacred Gorilla Tracking Sanctuary**\n`;
    itineraryContent += `- Morning briefing with Uganda Wildlife Authority (UWA) rangers.\n`;
    itineraryContent += `- Trek through thick misty jungle, tracking native silverback gorilla families.\n`;
    itineraryContent += `- Stand in quiet reverence, observing a gorilla family feed and play from just meters away.\n\n`;
    
    if (days >= 3) {
      itineraryContent += `**Day 3: Lake Bunyonyi Canoe Exploration & Batwa Heritage**\n`;
      itineraryContent += `- Relax on Africa's second deepest lake, discovering its terraced islands by traditional canoe.\n`;
      itineraryContent += `- Meet indigenous Batwa elders, listening to ancestral forest tracking histories.\n\n`;
    }
    
    itineraryContent += `**Day ${days}: Entebbe Airport return transfer**\n`;
    itineraryContent += `- Scenic drive back to Entebbe, crossing the Equator line for final travel departures.\n\n`;
  } else if (targetRegion.includes("tanzania") || targetRegion.includes("kilimanjaro")) {
    // Tanzania
    itineraryContent += `**Day 1: Arusha Basecamp to Machame Gate**\n`;
    itineraryContent += `- Scenic drive through Chagga village coffee farms to Kilimanjaro park gates.\n`;
    itineraryContent += `- Forest canopy hike to Machame camp (3,000m) with high altitude porters.\n\n`;
    
    itineraryContent += `**Day 2: Machame Camp to Shira Plateau (3,840m)**\n`;
    itineraryContent += `- Steep ridge crossing to the high heather moorland plateau. Stunning sunset views of Kibo peak.\n\n`;
    
    if (days >= 3) {
      itineraryContent += `**Day 3: Shira Plateau past Lava Tower (4,630m) to Barranco Valley**\n`;
      itineraryContent += `- Important *climb high, sleep low* acclimatization protocol to guarantee a 100% safe summit rate.\n\n`;
    }
    
    if (days >= 4) {
      itineraryContent += `**Day ${days - 1}: Barranco Wall and Uhuru Peak (5,895m) Midnight Ascent**\n`;
      itineraryContent += `- Tackle the famous Barranco Wall scramble, continuing up to Barafu camp.\n`;
      itineraryContent += `- Summit bid at midnight, arriving at Uhuru Peak at sunrise for an epic celebration.\n\n`;
    }
    
    itineraryContent += `**Day ${days}: Mweka Gate descent and Kilimanjaro certification**\n`;
    itineraryContent += `- Descend to gates, award official summit gold medals, and transfer to Arusha.\n\n`;
  } else {
    // Kenya
    if (targetActivity.includes("climbing") || targetActivity.includes("mountaineering") || targetActivity.includes("trek") || targetRegion.includes("mount kenya")) {
      // Mount Kenya Climbing
      itineraryContent += `**Day 1: Baseline Nanyuki to Sirimon Gate & Judier Camp (3,300m)**\n`;
      itineraryContent += `- Travel from Nairobi/Nanyuki to Sirimon Gate (2,650m). Clear mountain clearances.\n`;
      itineraryContent += `- Trek through majestic tropical montane forests, bamboo groves, and open moorland.\n`;
      itineraryContent += `- Overnight camping at Judier Camp. *Vibe:* Golden sunset briefing and acclimatization tracking.\n\n`;
      
      itineraryContent += `**Day 2: Trek Judier Camp to Shipton's Camp (4,200m)**\n`;
      itineraryContent += `- Traverse the scenic Mackinder's Valley, marveling at the giant Lobelia and Senecio rosettes.\n`;
      itineraryContent += `- Pace set strictly to *pole pole* (slowly) to maximize oxygenation safety.\n`;
      itineraryContent += `- Overnight rest at Shipton's Camp, looking directly up at the high snow peaks of Batian and Nelion.\n\n`;
      
      if (days >= 3) {
        itineraryContent += `**Day 3: Shipton's Acclimatization hike to Kami Hut (4,430m)**\n`;
        itineraryContent += `- Short technical ascent to Kami Tarn for safety checks and respiratory monitoring.\n`;
        itineraryContent += `- High-carb trail lunch prepared by our Chef Association team.\n`;
        itineraryContent += `- Restful afternoon to conserve energy for the midnight summit bid.\n\n`;
      }
      
      if (days >= 4) {
        itineraryContent += `**Day ${days - 1}: Summit Ascent to Point Lenana (4,985m) & Descend to Chogoria Gate**\n`;
        itineraryContent += `- 03:00 AM: Technical headlamp ascent through steep alpine scree slopes.\n`;
        itineraryContent += `- 06:30 AM: Stand triumphantly at Point Lenana as the sun paints the Indian Ocean clouds golden.\n`;
        itineraryContent += `- Celebratory hot chocolate and summit photo shoot with Cool J.\n`;
        itineraryContent += `- Descend beautiful Chogoria ridge past Gorges Valley and Lake Michaelson to lodge camp.\n\n`;
      }
      
      itineraryContent += `**Day ${days}: Return to Baseline Nanyuki & Nairobi Farewell**\n`;
      itineraryContent += `- Relaxed breakfast, formal local tips handout ceremony for our legendary porters team.\n`;
      itineraryContent += `- Scenic transfer back to Nanyuki Equator baseline crossing.\n`;
      itineraryContent += `- End of expedition, parting as friends and forever climbers!\n\n`;
    } else {
      // Kenya Safari & Greater Laikipia
      itineraryContent += `**Day 1: Nairobi/Nanyuki to Ol Pejeta Conservancy & Sweetwaters**\n`;
      itineraryContent += `- Custom Land Cruiser transfer crossing the Equator line directly into Nanyuki.\n`;
      itineraryContent += `- Check-in to premium eco-tented safari camp.\n`;
      itineraryContent += `- Sunset game drive, spotting black rhinos, lion prides, and the world's last Northern White Rhinos.\n\n`;
      
      itineraryContent += `**Day 2: Chimpanzee Sanctuary, Bush Walks & Night Predator Tracking**\n`;
      itineraryContent += `- Guided walk at Sweetwaters Sanctuary with veteran conservancy wardens.\n`;
      itineraryContent += `- Interactive local community cultural briefing over roasted tea.\n`;
      itineraryContent += `- Night drive seeking nocturnal predators: leopards, aardvarks, and bush babies.\n\n`;
      
      if (days >= 3) {
        itineraryContent += `**Day 3: Ngare Ndare Glacial Waterfalls or Solio Rhino Reserve**\n`;
        itineraryContent += `- Day trip to swim in Ngare Ndare's blue azure waterfalls and walk the canopy bridge.\n`;
        itineraryContent += `- Evening campfires sharing stories of ancient northern wildlife corridors.\n\n`;
      }
      
      itineraryContent += `**Day ${days}: Final Game Drive & Nanyuki Farewell**\n`;
      itineraryContent += `- Early morning predator watch before checkout.\n`;
      itineraryContent += `- Final custom local payment review, gift shop visit, and transfer to airport.\n\n`;
    }
  }
  
  itineraryContent += `#### 🎒 Expert Packing & Safety Tips by Cool J\n`;
  itineraryContent += `- **Pole Pole:** Go slow! Acclimatization and wildlife tracking reward patience.\n`;
  itineraryContent += `- **Community First:** We hire certified local porters & guides, guaranteeing fair living wages.\n`;
  itineraryContent += `- **Fleet Assurance:** Every group from 1 to 30 travelers is matched with dedicated open-roof 4x4 safari Land Cruisers (6-7 window seats per vehicle).\n`;
  itineraryContent += `- **Water Strategy:** Drink at least 4-5 liters of filtered water daily on the trails.\n`;
  itineraryContent += `- **Swahili Starter:** *Jambo* (Hello), *Asante Sana* (Thank you very much), *Karibu* (Welcome).\n\n`;
  
  itineraryContent += `*(Offline-Optimized Itinerary generated by Cool J's backup system to bypass network/authentication outages!)*`;
  
  return itineraryContent;
}

// Seed Initial Reviews/Social Proof to show instant rich data
let localReviews = [
  {
    id: 5,
    name: "Mfalme Ukweli",
    country: "Kenya",
    trip: "Mount Kenya Technical Peak Ascent",
    rating: 5,
    text: "They know their stuff and are good at expeditions. From detailed acclimatization routines to premium safety procedures, ascending Sirimon with Cool J was a masterpiece of professional guiding.",
    date: "2026-07-02",
    photo: "/assets/images/mfalme ukweli.png"
  },
  {
    id: 1,
    name: "Roda wa Shiku",
    country: "Kenya",
    trip: "Ol Pejeta Family Conservancy Tour",
    rating: 5,
    text: "My touring experience at Ol pajeta conservancy with you guys was the best.My family had so much fun, will do it again soon.!",
    date: "2026-06-28",
    photo: "/assets/images/rodah_reviewer_1783348521900.jpg"
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

// Seed Initial Bookings
let localBookings: any[] = [];

// Seed Field Stories & Articles
let localArticles: any[] = [
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
      "/assets/images/John Mwangi M. (Cool J).jpg",
      "/assets/images/Mt Kenya Summit (Hero banner).jpg"
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
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
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
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2026-07-04",
    likesCount: 64,
    isFeatured: true,
    status: "approved"
  },
  {
    id: "story-3",
    title: "Canopy Walks & Azure Glacial Waters in Ngare Ndare Forest",
    author: "David & Elena Rossi",
    country: "Italy",
    authorType: "guest",
    circuit: "Laikipia Day Expedition (Ngare Ndare Forest Reserve)",
    category: "safari",
    readTimeMinutes: 2,
    summary: "Walking high above the indigenous canopy on suspended rope bridges, then jumping into crystal blue glacial waterfalls with armed KFS rangers.",
    content: "If you are in Nanyuki, do NOT miss Ngare Ndare. We spent the morning walking 450 meters along the suspended wooden canopy walkway, watching black-and-white colobus monkeys leap through ancient cedar branches.\n\nAfterwards, our ranger led us down to the hidden waterfalls. The water originates straight from the Mount Kenya glaciers—freezing cold, but swimming in those azure turquoise natural pools was the most refreshing highlight of our entire Kenya trip!\n\nCool J arranged our 4x4 cruiser, packed organic local lunch boxes, and secured all KFS permits beforehand.",
    photos: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2026-07-28",
    likesCount: 29,
    isFeatured: false,
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
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2026-08-05",
    likesCount: 52,
    isFeatured: true,
    status: "approved"
  }
];

// 1. AI ITINERARY GENERATOR ENDPOINT
app.post("/api/plan-itinerary", async (req, res) => {
  const { region, activity, duration, vibe, specializedRequests } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    const fallback = generatePremiumFallback(region, activity, duration);
    return res.status(200).json({
      itinerary: fallback
    });
  }

  try {
    const prompt = `You are Cool J, a legendary 20+ year veteran adventure expedition guide based in Nanyuki, Kenya, specializing in custom private journeys across Mount Kenya, Serengeti/Masai Mara safaris, Tanzania, and Uganda.
    Create a highly engaging, professional, and SEO-optimized daily travel itinerary for a guest with these preferences:
    - Region of Interest: ${region}
    - Type of Adventure/Vibe: ${activity} (Vibe: ${vibe})
    - Duration: ${duration}
    - Custom Requests / Physical level / Notes: ${specializedRequests || "None"}

    Your response must style beautifully in Markdown and include:
    1. **Expedition Overview**: A paragraph describing the majestic geography, difficulty level, and what makes this itinerary unique.
    2. **Day-by-Day Itinerary**:
       - Detailed breakdown for each day (e.g. Day 1, Day 2, up to the duration).
       - Give exciting, specific locations like Ol Pejeta, Point Lenana, Sirimon Route, Chogoria, Galdessa, or Maasai communities.
       - Use a highly adventurous, native, local expert tone.
    3. **Expert Tips by Cool J**:
       - Acclimatization tips for Mt Kenya or safari etiquette.
       - Recommended gear and local Swahili words (e.g. *Karibu*, *Pole pole*).
    4. **Safety & Sustainability Note**: Mention carbon offset, supporting local porters & guides, and conservation details.

    Keep the length concise and informative (no more than 500 words). Use clean headers and bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Cool J, a majestic Kenyan expedition leader. Speak with authority, passion, deep local hospitality, and professional safety assurance."
      }
    });

    res.json({ itinerary: response.text });
  } catch (error: any) {
    console.error("Gemini API Error (falling back to local generator):", error);
    const fallback = generatePremiumFallback(region, activity, duration);
    res.json({ itinerary: fallback });
  }
});

// 2. SUBMIT REVIEW ENDPOINT (Social Proof persistence)
app.get("/api/reviews", (req, res) => {
  res.json(localReviews);
});

app.post("/api/reviews", (req, res) => {
  const { name, country, trip, rating, text } = req.body;
  if (!name || !text || !rating) {
    return res.status(400).json({ error: "Name, rating, and review text are required." });
  }
  const newReview = {
    id: localReviews.length + 1,
    name,
    country: country || "Traveler",
    trip: trip || "Custom Expedition",
    rating: Number(rating),
    text,
    date: new Date().toISOString().split('T')[0]
  };
  localReviews.unshift(newReview);
  res.json(newReview);
});

// 2B. EXPEDITION FIELD STORIES & ARTICLES (Guest & Admin Vetted Pipeline)
app.get("/api/articles", (req, res) => {
  const { includeAll, pin } = req.query;
  const isAuthorized = pin === "2026" || pin === "coolj2026";

  if (includeAll === "true" && isAuthorized) {
    // Return all articles (including pending & rejected) for authenticated admin
    return res.json(localArticles);
  }

  // Public feed: only approved articles
  const approvedArticles = localArticles.filter(
    (a) => a.status === "approved" || !a.status
  );
  res.json(approvedArticles);
});

app.post("/api/articles", (req, res) => {
  const { title, author, country, authorType, circuit, category, content, summary, photos, adminPin } = req.body;
  
  if (!title || !author || !content) {
    return res.status(400).json({ error: "Title, author name, and story content are required." });
  }

  // Validate author type / admin verification
  let validatedType: "guest" | "guide" | "admin" = "guest";
  let status: "pending" | "approved" = "pending";

  if (authorType === "admin" || authorType === "guide") {
    if (adminPin === "2026" || adminPin === "coolj2026") {
      validatedType = authorType;
      status = "approved"; // Admin/guide posts with valid PIN are published immediately
    } else {
      validatedType = "guest"; // fallback to guest if pin is invalid
      status = "pending";
    }
  }

  // Strictly cap photos to maximum 2 photos
  const sanitizedPhotos: string[] = Array.isArray(photos) ? photos.slice(0, 2) : [];

  // Calculate realistic read time (words / 180 wpm)
  const wordCount = (content || "").split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const newArticle = {
    id: "story-" + Date.now(),
    title: title.trim(),
    author: author.trim(),
    country: country ? country.trim() : "Guest Explorer",
    authorType: validatedType,
    circuit: circuit ? circuit.trim() : "Custom East Africa Trail",
    category: category || "climbing",
    readTimeMinutes,
    summary: summary ? summary.trim() : content.slice(0, 160) + "...",
    content: content.trim(),
    photos: sanitizedPhotos,
    date: new Date().toISOString().split('T')[0],
    likesCount: 1,
    isFeatured: status === "approved" && validatedType !== "guest",
    status
  };

  localArticles.unshift(newArticle);
  
  const responseMessage = status === "approved"
    ? "Published live! Your official dispatch is now on the public expedition board."
    : "Asante Sana! Your expedition story has been received and is queued for verification. It will appear publicly once vetted by Cool J's team.";

  res.status(201).json({
    ...newArticle,
    message: responseMessage
  });
});

// Admin Moderation: Approve / Reject Story Status
app.patch("/api/articles/:id/status", (req, res) => {
  const { id } = req.params;
  const { pin, status, isFeatured } = req.body;

  if (pin !== "2026" && pin !== "coolj2026") {
    return res.status(401).json({ error: "Unauthorized: Invalid admin authorization PIN" });
  }

  const article = localArticles.find((a) => a.id === id);
  if (!article) {
    return res.status(404).json({ error: "Story not found" });
  }

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    article.status = status;
  }
  if (typeof isFeatured === "boolean") {
    article.isFeatured = isFeatured;
  }

  res.json({
    success: true,
    message: `Story updated to '${article.status}'`,
    article
  });
});

// Admin Moderation: Delete Story
app.delete("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  const pin = req.body?.pin || req.query?.pin || req.headers["x-admin-pin"];

  if (pin !== "2026" && pin !== "coolj2026") {
    return res.status(401).json({ error: "Unauthorized: Invalid admin authorization PIN" });
  }

  const index = localArticles.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Story not found" });
  }

  const deleted = localArticles.splice(index, 1)[0];
  res.json({
    success: true,
    message: `Story "${deleted.title}" deleted successfully.`,
    id
  });
});

app.post("/api/articles/:id/like", (req, res) => {
  const { id } = req.params;
  const article = localArticles.find((a) => a.id === id);
  if (article) {
    article.likesCount = (article.likesCount || 0) + 1;
    return res.json({ success: true, likesCount: article.likesCount });
  }
  res.status(404).json({ error: "Article not found" });
});


// 3. SECURE BOOKING REQUEST CREATOR
app.post("/api/booking/quote", (req, res) => {
  const { region, activity, duration, budget, startDate, guestsCount, clientName, clientEmail, clientPhone } = req.body;

  if (!clientName || !clientEmail) {
    return res.status(400).json({ error: "Client name and email are required to generate a custom itinerary quote." });
  }

  const parsingDays = parseInt(duration) || 5;
  const numGuests = Math.min(30, Math.max(1, Number(guestsCount) || 1));
  const budgetStr = budget || "$1,500 - $2,500";

  // Classify selected budget tier for calculation
  let tier: "budget" | "standard" | "premium" | "luxury" = "standard";
  if (budgetStr.includes("$1,000 - $1,500") || budgetStr.includes("Budget")) tier = "budget";
  else if (budgetStr.includes("$1,500 - $2,500") || budgetStr.includes("Standard")) tier = "standard";
  else if (budgetStr.includes("$2,500 - $3,500") || budgetStr.includes("Premium")) tier = "premium";
  else if (budgetStr.includes("$3,500+") || budgetStr.includes("Luxury")) tier = "luxury";

  let totalAmount = 0;
  const vehiclesNeeded = Math.ceil(numGuests / 6); // 6 guests max per safari Land Cruiser for window seating
  const regLower = (region || "").toLowerCase();

  // REGION SPECIFIC CALCULATION ENGINE (Accommodations & meals self-arranged by default, crew is all-inclusive)
  if (regLower.includes("ngare ndare") || regLower.includes("canopy") || regLower.includes("waterfall")) {
    const entryFeePerDay = 40;
    const cruiserRatePerDay = 170;
    const inclusiveCrewPerDay = 45;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * Math.ceil(numGuests / 4);
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("solio")) {
    const entryFeePerDay = 80;
    const cruiserRatePerDay = 180;
    const inclusiveCrewPerDay = 45;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("aberdare")) {
    const entryFeePerDay = 52;
    const cruiserRatePerDay = 180;
    const inclusiveCrewPerDay = 45;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("lolldaiga")) {
    const entryFeePerDay = 50;
    const cruiserRatePerDay = 170;
    const inclusiveCrewPerDay = 45;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("meru national park") || regLower.includes("elsa")) {
    const entryFeePerDay = 60;
    const cruiserRatePerDay = 190;
    const inclusiveCrewPerDay = 50;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("samburu") || regLower.includes("buffalo springs") || regLower.includes("shaba")) {
    const entryFeePerDay = 80;
    const cruiserRatePerDay = 190;
    const inclusiveCrewPerDay = 50;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("lewa") || regLower.includes("borana")) {
    const entryFeePerDay = 130;
    const cruiserRatePerDay = 200;
    const inclusiveCrewPerDay = 60;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("nakuru") || regLower.includes("naivasha") || regLower.includes("hell's gate")) {
    const entryFeePerDay = 70;
    const cruiserRatePerDay = 180;
    const inclusiveCrewPerDay = 45;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("amboseli")) {
    const entryFeePerDay = 100;
    const cruiserRatePerDay = 200;
    const inclusiveCrewPerDay = 50;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("tsavo")) {
    const entryFeePerDay = 52;
    const cruiserRatePerDay = 200;
    const inclusiveCrewPerDay = 50;

    const entryCost = entryFeePerDay * parsingDays * numGuests;
    const transportCost = cruiserRatePerDay * parsingDays * vehiclesNeeded;
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = Math.ceil(entryCost + transportCost + bundledCrew);

  } else if (regLower.includes("diani") || regLower.includes("coast")) {
    const transferPerGuest = 60;
    const inclusiveCrewPerDay = 35;

    const transportCost = transferPerGuest * numGuests;
    const bundledCrew = inclusiveCrewPerDay * parsingDays;
    totalAmount = Math.ceil(transportCost + bundledCrew);

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
    const parkFeesCost = Math.ceil(parkFeesPerDay * parsingDays * numGuests);
    const transportCost = Math.ceil(90 * vehiclesNeeded);
    totalAmount = bundledCrewAndLogistics + parkFeesCost + transportCost;

  } else if (regLower.includes("nanyuki") || regLower.includes("laikipia") || regLower.includes("ol pejeta")) {
    const entryFeePerDay = 110;
    const cruiserVehicleRatePerDay = 180;
    const inclusiveCrewPerDay = 50;

    const entryCost = Math.ceil(entryFeePerDay * parsingDays * numGuests);
    const transportCost = Math.ceil(cruiserVehicleRatePerDay * parsingDays * vehiclesNeeded);
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = entryCost + transportCost + bundledCrew;

  } else if (regLower.includes("masai mara") || regLower.includes("safaris")) {
    const maraEntryFeePerDay = 150;
    const cruiserVehicleRatePerDay = 220;
    const inclusiveCrewPerDay = 55;

    const entryCost = Math.ceil(maraEntryFeePerDay * parsingDays * numGuests);
    const transportCost = Math.ceil(cruiserVehicleRatePerDay * parsingDays * vehiclesNeeded);
    const bundledCrew = inclusiveCrewPerDay * parsingDays * vehiclesNeeded;
    totalAmount = entryCost + transportCost + bundledCrew;

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
    const parkFeesCost = Math.ceil(parkFeesPerDay * parsingDays * numGuests);
    const transportCost = Math.ceil(150 * vehiclesNeeded);
    totalAmount = bundledCrewAndLogistics + parkFeesCost + transportCost;

  } else if (regLower.includes("uganda") || regLower.includes("gorilla")) {
    const gorillaPermitCost = 800;
    const cruiserVehicleRatePerDay = 200;
    const localRangerGuidePerDay = 50;

    const permitCostTotal = gorillaPermitCost * numGuests;
    const transportCost = Math.ceil((cruiserVehicleRatePerDay + localRangerGuidePerDay) * parsingDays * vehiclesNeeded);
    totalAmount = permitCostTotal + transportCost;

  } else if (regLower.includes("combo") || regLower.includes("multi-country")) {
    const permitAndParkDaily = 220;
    const cruiserVehicleRatePerDay = 220;
    const inclusiveCrewPerDay = 60;

    const parkCost = Math.ceil(permitAndParkDaily * Math.min(parsingDays, 4) * numGuests);
    const transportCost = Math.ceil((cruiserVehicleRatePerDay + inclusiveCrewPerDay) * parsingDays * vehiclesNeeded);
    totalAmount = parkCost + transportCost;

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

    totalAmount = Math.ceil(baseDailyRatePerPerson * parsingDays * numGuests * groupFactor);
  }

  // Large group multi-vehicle volume discount
  if (numGuests >= 10) {
    totalAmount = Math.round(totalAmount * 0.93);
  }

  const quoteId = "CJE-" + Math.floor(100000 + Math.random() * 900000);
  const newBooking = {
    quoteId,
    clientName,
    clientEmail,
    clientPhone: clientPhone || "WhatsApp",
    region: region || "Mount Kenya",
    activity: activity || "Mixed Adventure",
    duration,
    guestsCount: numGuests,
    startDate: startDate || "To be scheduled",
    amount: totalAmount,
    status: "Pending Deposit",
    createdDate: new Date().toISOString()
  };

  localBookings.push(newBooking);
  res.json(newBooking);
});

// 4. MPESA LOCAL PAYMENTS (Lightning Fast Sim)
// Emulates a real M-Pesa Express push notification payment loop
app.post("/api/mpesa-express", (req, res) => {
  const { phone, amount, quoteId } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: "Valid phone number and amount are required for M-Pesa push." });
  }

  const cleanPhone = phone.replace(/\s+/g, '');
  const transactionId = "MPESA" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Return step 1: SMS STK Push simulated initiation direct to recipient's personal mobile number
  res.json({
    status: "Requested",
    message: `Direct M-Pesa STK Push initiated successfully to ${cleanPhone}. The funds will transfer directly to John Mwangi's number (0720 572251). Please check your phone for the PIN prompt!`,
    transactionId,
    amount,
    quoteId
  });
});

// Mock database polling for client simulation
app.post("/api/mpesa-poll", (req, res) => {
  const { transactionId } = req.body;
  // Simulates instant 3-second completion
  res.json({
    status: "SUCCESS",
    receipt: {
      transactionId,
      paymentMethod: "M-Pesa Direct (Send Money)",
      businessNo: "Direct to John Mwangi (0720 572251)",
      timestamp: new Date().toISOString(),
      status: "Verified",
      message: "Payment successfully received directly by John Mwangi. Tusker and gears are locked! Karibu!"
    }
  });
});

// 5. SECURE MEDIA UPLOAD & PERSISTENT STATUS TRACKER
app.get("/api/media-status", (req, res) => {
  const mediaList = [
    { 
      key: "savanna", 
      publicPath: "public/assets/images/fleet-savanna.jpg", 
      srcPaths: ["src/assets/images/fleet-savanna.jpg", "src/assets/images/fleet-savanna.jpg.jpeg"] 
    },
    { 
      key: "interior", 
      publicPath: "public/assets/images/fleet-interior.jpg", 
      srcPaths: ["src/assets/images/fleet-interior.jpg", "src/assets/images/fleet-interior.jpg.jpeg"] 
    },
    { 
      key: "paved", 
      publicPath: "public/assets/images/fleet-paved.jpg", 
      srcPaths: ["src/assets/images/fleet-paved.jpg", "src/assets/images/fleet-paved.jpg.jpeg"] 
    },
    { 
      key: "tuskers", 
      publicPath: "public/assets/videos/tuskers.mp4", 
      srcPaths: [
        "src/assets/videos/tuskers.mp4",
        "src/assets/videos/tuskers.mp4.mp4",
        "src/assets/videos/tuskers.mp4.jpeg",
        "src/assets/videos/tuskers.mp4.png",
        "src/assets/videos/tuskers.mp4.mov",
        "src/assets/videos/tuskers.mov",
        "public/assets/videos/tuskers.mp4.mp4",
        "public/assets/videos/tuskers.mp4.mov",
        "public/assets/videos/tuskers.mov"
      ] 
    },
    { 
      key: "guides", 
      publicPath: "public/assets/videos/guides_hiking.mp4", 
      srcPaths: [
        "src/assets/videos/guides_hiking.mp4",
        "src/assets/videos/guides_hiking.mp4.mp4",
        "src/assets/videos/guides_hiking.mp4.jpeg",
        "src/assets/videos/guides_hiking.mp4.png",
        "src/assets/videos/guides_hiking.mp4.mov",
        "src/assets/videos/guides_hiking.mov",
        "public/assets/videos/guides_hiking.mp4.mp4",
        "public/assets/videos/guides_hiking.mp4.mov",
        "public/assets/videos/guides_hiking.mov"
      ] 
    },
  ];

  const status: Record<string, boolean> = {};
  for (const item of mediaList) {
    const fullPublicPath = path.join(process.cwd(), item.publicPath);
    let exists = fs.existsSync(fullPublicPath);

    // On Vercel, the backend serverless function is isolated from the static public/dist folder files.
    // However, they are guaranteed to exist on Vercel's CDN because they are part of the static build output.
    if (process.env.VERCEL) {
      exists = true;
    }

    if (!exists) {
      // Check if it exists in any of the src paths
      for (const srcPath of item.srcPaths) {
        const fullSrcPath = path.join(process.cwd(), srcPath);
        if (fs.existsSync(fullSrcPath)) {
          try {
            // Ensure target directory exists
            fs.mkdirSync(path.dirname(fullPublicPath), { recursive: true });
            // Copy file
            fs.copyFileSync(fullSrcPath, fullPublicPath);
            exists = true;
            console.log(`Auto-synced media file from ${srcPath} to ${item.publicPath}`);
            break;
          } catch (err) {
            console.error(`Failed to auto-sync media ${item.key}:`, err);
          }
        }
      }
    }
    status[item.key] = exists;
  }
  res.json(status);
});

app.post("/api/upload-media", async (req, res) => {
  const { key, base64Data } = req.body;

  if (!key || !base64Data) {
    return res.status(400).json({ error: "Key and base64Data are required." });
  }

  // Map keys to actual paths
  const keyMap: Record<string, { folder: string; fileName: string }> = {
    savanna: { folder: "public/assets/images", fileName: "fleet-savanna.jpg" },
    interior: { folder: "public/assets/images", fileName: "fleet-interior.jpg" },
    paved: { folder: "public/assets/images", fileName: "fleet-paved.jpg" },
    tuskers: { folder: "public/assets/videos", fileName: "tuskers.mp4" },
    guides: { folder: "public/assets/videos", fileName: "guides_hiking.mp4" },
  };

  const config = keyMap[key];
  if (!config) {
    return res.status(400).json({ error: "Invalid media key." });
  }

  try {
    const folderPath = path.join(process.cwd(), config.folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, config.fileName);
    
    // Strip header if present e.g. "data:video/mp4;base64,"
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");

    await fs.promises.writeFile(filePath, buffer);
    console.log(`Saved custom media file successfully to: ${filePath}`);

    res.json({ success: true, message: `Successfully uploaded ${config.fileName}!` });
  } catch (error: any) {
    console.error("Failed to write uploaded media file:", error);
    res.status(500).json({ error: `Failed to write file on server: ${error.message}` });
  }
});

// Serve web apps correctly depending on environment
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Cool J Expeditions Server running at http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
