export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Is it safe to trek Mount Kenya or visit these regions?",
    answer: "Yes, absolutely. Mount Kenya is extremely safe with proper acclimatization and a highly experienced guide. Cool J has over 20 years of rescue and safety expertise, following strict weather monitoring, slow pacing ('pole pole') to prevent altitude symptoms, and carrying comprehensive mountain first-aid. All safari regions we visit across Laikipia, Samburu, and Mount Kenya are stable and very welcoming of global visitors.",
    category: "Safety & Prep"
  },
  {
    id: 2,
    question: "What's included in the expedition cost?",
    answer: "Inclusions vary depending on custom preference, but typically cover: fully licensed guide services, high-quality mountain accommodation/camping gear, all park and conservancy fees (KWS, Ol Pejeta, Samburu, Ngare Ndare), 3 daily freshly cooked local meals prepared by our expedition chefs, custom 4x4 Land Cruiser fleet transport, and filtered drinking water.",
    category: "Cost & Inclusions"
  },
  {
    id: 3,
    question: "How flexible are the itineraries?",
    answer: "Extremely flexible! That's the Cool J advantage. Standard operators require rigid schedules, but with us you can customize your daily routes. If we find a rare wildlife herd in Samburu, want extra swim time in Ngare Ndare's azure waterfalls, or want to spend an extra hour learning tracking inside a Maasai or Samburu community, we adapt perfectly.",
    category: "Itinerary"
  },
  {
    id: 4,
    question: "What is your group size policy? (1 to 30+ explorers)",
    answer: "We accommodate private solo explorers (1 person), couples & families (2-6 people), as well as larger university, corporate, and mountain club groups (up to 30 people). For parties larger than 6-7, we deploy our synchronized multi-vehicle 4x4 Land Cruiser fleet caravans with dedicated driver-guides, ensuring guaranteed window seats, intimate safety attention, and personalized pacing for every single traveler.",
    category: "Safety & Prep"
  },
  {
    id: 5,
    question: "Can we visit Ngare Ndare Forest, Ol Pejeta, and Samburu in one trip?",
    answer: "Yes! Combining Ngare Ndare Forest (famous for its 450m canopy walkway and glacial blue waterfall pools) with Ol Pejeta Rhino Sanctuary and Samburu's 'Special Five' is one of our most popular 3-7 day safari loops originating from our Nanyuki base.",
    category: "Destinations"
  },
  {
    id: 6,
    question: "Can you arrange safaris for seniors or kids?",
    answer: "Absolutely! We customize the routes for comfortable pacing, lodge-based safaris with zero intense trekking, and short daily transit times. Ol Pejeta, Lewa, and Masai Mara have fantastic luxury safari camps and lodges that are very child- and senior-friendly.",
    category: "Itinerary"
  },
  {
    id: 7,
    question: "How does the M-Pesa local payment option work?",
    answer: "In East Africa, and Kenya in particular, M-Pesa is the safest, fastest way to transact. We support instant 'Lipa Na M-Pesa' till and send-money options. For our international travelers, we help you set up standard card conversion or simulate the M-Pesa Express push securely right when you arrive in Nanyuki.",
    category: "Cost & Inclusions"
  }
];

