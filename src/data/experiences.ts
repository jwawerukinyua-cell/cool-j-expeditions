import { Experience } from "../types";
import teamShiptons from "../assets/images/Trekking Team Resting.jpg";
import groupCustomers from "../assets/images/Happy Group of Climbers.jpg";
import kilimanjaroTanzania from "../assets/images/mount-kilimanjaro-.jpg";
import fleetSavanna from "../assets/images/fleet-savanna.jpg";
import fleetPaved from "../assets/images/fleet-paved.jpg";
import fleetInterior from "../assets/images/fleet-interior.jpg";
import fleetLineup from "../assets/images/fleet-tourists-enjoying.jpg";
import ugandaBwindiImg from "../assets/images/uganda_bwindi_1783435198714.jpg";
import ngareNdareImg from "../assets/images/ngare_ndare.jpg";
import lenanaPeak from "../assets/images/Point Lenana Peak Sign.jpg";
import climberSunset from "../assets/images/Mt Kenya Summit (Hero banner).jpg";
import coolJWithHappyTourists from "../assets/images/cool_j_with_happy_tourists.jpg";
import takingRestInSamburu from "../assets/images/taking_a_rest_in_samburu.jpg";
import walkWithRanger from "../assets/images/walk_with_ranger.jpg";
import elephantTakingAWalk from "../assets/images/elephant_taking_a_walk.jpg";
import happyGuests from "../assets/images/happy_guests.jpg";
import lakeNakuruImg from "../assets/images/lake_nakuru.jpg";
import masaiMaraImg from "../assets/images/masai_mara.jpg";

export const EXPERIENCES: Experience[] = [
  // ==========================================
  // 1. LAIKIPIA COUNTY & NANYUKI BASE (HOME REGION)
  // ==========================================
  {
    id: "mount-kenya",
    title: "Mount Kenya Summit Peak Ascent (Sirimon & Chogoria)",
    emoji: "⛰️",
    category: "High Altitude Climbing",
    countyGroup: "laikipia",
    locationLabel: "Laikipia & Central Kenya",
    keyword: "Mount Kenya Summit Trekking",
    duration: "4 - 6 Days",
    intensity: "Challenging",
    bestTime: "Dec - March, July - Oct",
    description: "Climb Africa's majestic second-highest peak (Point Lenana 4,985m). Ascend through scenic alpine moorlands, giant groundsels, and descend the breathtaking tarns of Gorges Valley & Lake Michaelson with 3 porters per climber and certified mountain rescue guides.",
    highlights: [
      "Point Lenana Peak Summit (4,985m) at sunrise",
      "Vast alpine moorlands, Lake Ellis & Lake Michaelson",
      "Sirimon-Chogoria traverse with dedicated chef & porter team"
    ],
    imagePlaceholder: climberSunset || lenanaPeak
  },
  {
    id: "ol-pejeta",
    title: "Ol Pejeta Conservancy & Sweetwaters Chimpanzee Haven",
    emoji: "🦏",
    category: "Rhino & Predator Sanctuary",
    countyGroup: "laikipia",
    locationLabel: "Laikipia County",
    keyword: "Ol Pejeta Rhino Sanctuary",
    duration: "1 - 3 Days",
    intensity: "Leisurely",
    bestTime: "Year-Round",
    description: "Explore East Africa's largest black rhino sanctuary and visit Najin & Fatu, the world's last remaining Northern White Rhinos. Tour the Sweetwaters Chimpanzee Sanctuary, track lion prides, and cross the official Equator line inside our customized open-roof Land Cruisers.",
    highlights: [
      "Sanctuary of the world's last two Northern White Rhinos",
      "Sweetwaters Chimpanzee Sanctuary guided warden tour",
      "Highest predator density in Kenya with lion tracking"
    ],
    imagePlaceholder: fleetSavanna
  },
  {
    id: "solio-ranch",
    title: "Solio Game Reserve & Rhino Breeding Haven",
    emoji: "🦏",
    category: "Exclusive Rhino Sanctuary",
    countyGroup: "laikipia",
    locationLabel: "Laikipia / Nyeri Plains",
    keyword: "Solio Ranch Rhino Sanctuary",
    duration: "1 - 2 Days",
    intensity: "Leisurely",
    bestTime: "Year-Round",
    description: "East Africa's most successful and intensely protected private breeding sanctuary for both Black and White Rhinos. Experience seeing dozens of rhinos grazing peacefully together in the yellow-barked fever tree acacia forests, accompanied by oryx, leopards, and giraffes.",
    highlights: [
      "Unmatched density: see 30 to 50+ rhinos in a single afternoon drive",
      "Historic breeding reserve that repopulated parks across Africa",
      "Stunning acacia-lined valley game tracks with Mount Kenya backdrop"
    ],
    imagePlaceholder: fleetLineup
  },
  {
    id: "ngare-ndare",
    title: "Ngare Ndare Forest & 450m Canopy Waterfalls Walk",
    emoji: "💧",
    category: "Canopy & Glacial Falls",
    countyGroup: "laikipia",
    locationLabel: "Laikipia / Meru Border",
    keyword: "Ngare Ndare Canopy Walkway",
    duration: "1 - 2 Days",
    intensity: "Moderate",
    bestTime: "Year-Round",
    description: "Discover the jewel of Mount Kenya's foothills. Traverse the famous 450-meter suspended canopy walkway among ancient African olive trees, swim in crystalline azure glacial waterfalls, and trace elephant migratory corridors with armed KFS rangers.",
    highlights: [
      "450m canopy walkway high above indigenous riverine forest",
      "Swim in natural blue glacial waterfall plunge pools",
      "Elephant corridor wildlife tracking and picnic lunch by the rapids"
    ],
    imagePlaceholder: coolJWithHappyTourists || ngareNdareImg
  },
  {
    id: "lewa-borana",
    title: "Lewa Wildlife & Borana Conservancies",
    emoji: "🦓",
    category: "UNESCO World Heritage",
    countyGroup: "laikipia",
    locationLabel: "Laikipia / Meru Boundary",
    keyword: "Lewa Borana Wilderness",
    duration: "2 - 4 Days",
    intensity: "Leisurely",
    bestTime: "Year-Round",
    description: "Step into a UNESCO World Heritage conservation pioneer. Experience rolling hills, private wilderness tracks, horseback safaris alongside herds, and unmatched rhino and elephant encounters on the boundary of Laikipia and Isiolo counties.",
    highlights: [
      "UNESCO World Heritage Site with zero tourist overcrowding",
      "Pioneering rhino anti-poaching and tracking experiences",
      "Spectacular views looking out towards Mount Kenya's northern slopes"
    ],
    imagePlaceholder: fleetPaved
  },
  {
    id: "lolldaiga-hills",
    title: "Lolldaiga Hills & Laikipia Wilderness Walking",
    emoji: "🏕️",
    category: "Rugged Wilderness & Trekking",
    countyGroup: "laikipia",
    locationLabel: "Laikipia Plateau",
    keyword: "Lolldaiga Hills Safari",
    duration: "2 - 3 Days",
    intensity: "Moderate",
    bestTime: "Year-Round",
    description: "Known as the 'Postcard Wild', Lolldaiga Hills features dramatic cedar-clad rocky ridges, archaeological cave paintings, and sweeping panoramic views across the Laikipia Plateau. Experience authentic guided bush walks and night game drives.",
    highlights: [
      "Guided bushwalking safaris and ancient rock art exploration",
      "Pristine highland wilderness with wild dogs and leopards",
      "Breathtaking sundowner vantage points overlooking Mt. Kenya"
    ],
    imagePlaceholder: walkWithRanger || teamShiptons
  },

  // ==========================================
  // 2. NEIGHBORING COUNTIES (CENTRAL & NORTH)
  // ==========================================
  {
    id: "aberdare-waterfalls",
    title: "Aberdare National Park & Mountain Waterfalls",
    emoji: "🏞️",
    category: "Highland Moorlands & Waterfalls",
    countyGroup: "neighboring",
    locationLabel: "Nyeri & Nyandarua Counties",
    keyword: "Aberdare Mountain Waterfalls",
    duration: "1 - 3 Days",
    intensity: "Moderate",
    bestTime: "Year-Round",
    description: "Ascend into the misty, enchanting cloud forests and alpine moorlands of the Aberdare Range. Witness Kenya's highest cascading waterfalls—Karuru Falls (273m) and Chania Falls—explore the Bamboo Zone, and spot rare bongo antelopes and giant forest hogs.",
    highlights: [
      "Spectacular Karuru Falls (Kenya's tallest three-tier waterfall)",
      "High moorland scenic hiking, bamboo forests & trout stream walks",
      "Historic Queen Elizabeth Treetops legacy and alpine wilderness"
    ],
    imagePlaceholder: happyGuests || fleetInterior
  },
  {
    id: "samburu-safari",
    title: "Samburu & Buffalo Springs 'Special Five' Safari",
    emoji: "🐆",
    category: "Northern Desert Oasis",
    countyGroup: "neighboring",
    locationLabel: "Samburu & Isiolo Counties",
    keyword: "Samburu Special 5 Safari",
    duration: "3 - 5 Days",
    intensity: "Moderate",
    bestTime: "June - Oct, Dec - March",
    description: "Journey north across rugged semi-arid landscapes along the Ewaso Ng'iro river. Track the legendary 'Samburu Special 5' (Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk), enjoy authentic Samburu warrior cultural visits, and photograph big cats in the golden dust.",
    highlights: [
      "Track the rare Northern 'Special 5' species not found in southern parks",
      "Scenic game loops along the Doum-palm lined Ewaso Ng'iro river",
      "Authentic cultural immersion with traditional Samburu community elders"
    ],
    imagePlaceholder: takingRestInSamburu || kilimanjaroTanzania
  },
  {
    id: "meru-national-park",
    title: "Meru National Park (Wilderness & Elsa's Realm)",
    emoji: "🦁",
    category: "Untamed Big 5 Wilderness",
    countyGroup: "neighboring",
    locationLabel: "Meru County",
    keyword: "Meru National Park Safari",
    duration: "2 - 4 Days",
    intensity: "Leisurely",
    bestTime: "Year-Round",
    description: "One of Kenya's most wild, uncrowded, and pristine national parks. Famous as the home where George and Joy Adamson raised Elsa the Lioness. Features 13 crystal-clear rivers, dense doum palms, massive elephant herds, and a dedicated rhino sanctuary.",
    highlights: [
      "Completely wild, secluded game viewing with virtually no crowds",
      "13 clear river systems supporting hippos, lions, and leopards",
      "Dedicated 48 sq km fenced Rhino Sanctuary"
    ],
    imagePlaceholder: fleetInterior
  },
  {
    id: "rift-valley-lakes",
    title: "Lake Nakuru & Lake Naivasha / Hell's Gate Gorge",
    emoji: "🦩",
    category: "Great Rift Valley & Geothermal",
    countyGroup: "neighboring",
    locationLabel: "Nakuru & Naivasha",
    keyword: "Lake Nakuru Naivasha Safari",
    duration: "2 - 3 Days",
    intensity: "Moderate",
    bestTime: "Year-Round",
    description: "Explore the Great Rift Valley's most famous lakes. Marvel at thousands of flamingos and Rothschild giraffes in Lake Nakuru, take a boat safari amongst hippos to Crescent Island on Lake Naivasha, and cycle through the towering red canyons of Hell's Gate National Park.",
    highlights: [
      "Lake Nakuru rhino sanctuary and pink flamingo birding haven",
      "Boat ride safari on Lake Naivasha & walking with wildlife on Crescent Island",
      "Bicycle riding and volcanic gorge trekking in Hell's Gate"
    ],
    imagePlaceholder: lakeNakuruImg
  },

  // ==========================================
  // 3. OTHER DESTINATIONS WITHIN KENYA
  // ==========================================
  {
    id: "masai-mara",
    title: "Masai Mara National Reserve (Great Wildebeest Migration)",
    emoji: "🦁",
    category: "World Wonder Savanna",
    countyGroup: "kenya",
    locationLabel: "Narok County",
    keyword: "Masai Mara Safari",
    duration: "3 - 5 Days",
    intensity: "Leisurely",
    bestTime: "Year-Round (Migration July - Oct)",
    description: "Africa's greatest wildlife theater. Witness millions of wildebeests and zebras braving crocodile-infested Mara River crossings, track prides of black-maned lions, cheetah coalitions, and elusive leopards across endless golden savannas.",
    highlights: [
      "World-famous Great Migration river crossings (July to October)",
      "Unrivaled Big Cat predator sightings and hot air balloon options",
      "Authentic Maasai community village cultural experiences"
    ],
    imagePlaceholder: masaiMaraImg
  },
  {
    id: "amboseli-elephants",
    title: "Amboseli National Park (Elephants & Mt. Kilimanjaro)",
    emoji: "🐘",
    category: "Iconic Elephant Plains",
    countyGroup: "kenya",
    locationLabel: "Kajiado County",
    keyword: "Amboseli Kilimanjaro Safari",
    duration: "2 - 4 Days",
    intensity: "Leisurely",
    bestTime: "Year-Round",
    description: "Home to the world's most famous free-ranging elephant herds walking directly against the snow-capped peak of Mount Kilimanjaro. Explore the lush Enkongo Narok freshwater swamp filled with hippos, pelicans, and waterbirds.",
    highlights: [
      "Iconic close-up photography of giant tuskers beneath Mount Kilimanjaro",
      "Observation Hill panoramic view over vast swamps and acacia woodlands",
      "Over 400 species of birds and thriving predator populations"
    ],
    imagePlaceholder: elephantTakingAWalk || kilimanjaroTanzania
  },
  {
    id: "tsavo-east-west",
    title: "Tsavo East & Tsavo West National Parks (Theater of the Wild)",
    emoji: "🌋",
    category: "Red Dust Wilderness & Springs",
    countyGroup: "kenya",
    locationLabel: "Taita-Taveta County",
    keyword: "Tsavo Wilderness Safari",
    duration: "3 - 5 Days",
    intensity: "Moderate",
    bestTime: "Year-Round",
    description: "Kenya's largest and most historic protected wilderness. Marvel at the famous 'Red Elephants' dust-bathing in Tsavo East, explore the underwater hippo glass observatory at Mzima Springs, and traverse the Shetani Lava flows in Tsavo West.",
    highlights: [
      "Famous red-soil dusted elephant herds and Yatta Plateau",
      "Mzima Springs underwater crystal-clear viewing chamber",
      "Shetani black volcanic lava flows and Ngulia Rhino Sanctuary"
    ],
    imagePlaceholder: fleetSavanna
  },
  {
    id: "diani-beach-coast",
    title: "Diani Beach & Kenyan Swahili Coast (Post-Safari Retreat)",
    emoji: "🏖️",
    category: "Tropical Ocean Extension",
    countyGroup: "kenya",
    locationLabel: "Kwale County & Mombasa",
    keyword: "Diani Beach Safari Extension",
    duration: "3 - 6 Days",
    intensity: "Relaxing",
    bestTime: "Year-Round",
    description: "The perfect tropical conclusion to your mountain climb or safari. Sink your toes into the powder-white sands of award-winning Diani Beach, sail on traditional Swahili dhows, snorkel Kisite-Mpunguti Marine Park coral reefs, and swim with wild dolphins.",
    highlights: [
      "Voted Africa's leading beach destination with turquoise Indian Ocean",
      "Kisite-Mpunguti marine reserve dolphin watching and coral reef snorkeling",
      "Sunset dhow cruise, fresh seafood feasts, and coastal Swahili culture"
    ],
    imagePlaceholder: ngareNdareImg
  },

  // ==========================================
  // 4. PRESERVED REGIONAL GRAND EXPEDITIONS (UNTOUCHED)
  // ==========================================
  {
    id: "multi-country",
    title: "East Africa Grand Safari (Mara, Serengeti & Bwindi Gorillas)",
    emoji: "🌍",
    category: "Grand Expeditions",
    countyGroup: "grand",
    locationLabel: "Kenya, Tanzania & Uganda",
    keyword: "Kenya Tanzania Uganda Combined Tour",
    duration: "8 - 14 Days",
    intensity: "Active Explorer",
    bestTime: "Year-Round (Migration July - Oct)",
    description: "The ultimate East African journey spanning Kenya, Tanzania, and Uganda. Experience the Maasai Mara & Serengeti Great Wildebeest Migration, track endangered mountain gorillas in Uganda's Bwindi Impenetrable Forest, and explore Crater Highlands with seamless border coordination.",
    highlights: [
      "Guaranteed mountain gorilla habituation tracking permits in Bwindi",
      "Great Migration river crossings in Masai Mara & Serengeti",
      "All-inclusive multi-country logistics, border visas, and private 4x4 fleet"
    ],
    imagePlaceholder: ugandaBwindiImg || groupCustomers
  }
];
