export interface Review {
  id: number;
  name: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  date: string;
  photo?: string;
}

export interface Experience {
  id: string;
  title: string;
  emoji: string;
  category: string;
  countyGroup?: "laikipia" | "neighboring" | "kenya" | "grand";
  locationLabel?: string;
  keyword: string;
  duration: string;
  intensity: string;
  bestTime: string;
  description: string;
  highlights: string[];
  imagePlaceholder: string;
}

export interface BookingResponse {
  quoteId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  region: string;
  activity: string;
  duration: string;
  guestsCount: number;
  startDate: string;
  amount: number;
  status: string;
  createdDate: string;
}

export interface MpesaReceipt {
  transactionId: string;
  paymentMethod: string;
  businessNo: string;
  timestamp: string;
  status: string;
  message: string;
}

export interface FieldStory {
  id: string;
  title: string;
  author: string;
  country?: string;
  authorType: "guest" | "guide" | "admin";
  circuit: string;
  category: "founder-story" | "guide-dispatch" | "climbing" | "safari" | "community" | "behind-the-scenes";
  readTimeMinutes: number;
  content: string;
  summary: string;
  photos: string[]; // Up to 2 photos maximum
  date: string;
  likesCount: number;
  isFeatured?: boolean;
  status?: "pending" | "approved" | "rejected";
}
