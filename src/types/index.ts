export type AccountType = 'customer' | 'provider' | 'both';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  country: string;
  city: string;
  accountType: AccountType;
  bio?: string;
  isAdmin?: boolean;
  createdAt: any;
  updatedAt?: any;
}

export interface ProviderProfile {
  id: string; // matches User.id
  userId: string;
  businessName: string;
  logoUrl?: string;
  bio: string;
  country: string;
  city: string;
  serviceAreas?: string[];
  categories: string[];
  phone?: string;
  email: string;
  website?: string;
  showEmail: boolean;
  showPhone: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: any;
  updatedAt?: any;
}

export type NeedStatus = 'OPEN' | 'IN_PROGRESS' | 'FULFILLED' | 'CLOSED' | 'EXPIRED';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Need {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  title: string;
  category: string;
  country: string;
  city: string;
  description: string;
  budgetMin?: number;
  budgetMax?: number;
  currency: string;
  preferredCondition?: string;
  urgency?: UrgencyLevel;
  expiryDate?: string;
  contactPreference?: string;
  status: NeedStatus;
  offersCount: number;
  searchKeywords?: string[];
  createdAt: any;
  updatedAt?: any;
}

export interface Listing {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  condition?: string;
  availability?: string;
  imageUrl?: string;
  active: boolean;
  searchKeywords?: string[];
  createdAt: any;
  updatedAt?: any;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Offer {
  id: string;
  needId: string;
  needTitle: string;
  customerId: string;
  providerId: string;
  providerName: string;
  message: string;
  proposedPrice: number;
  currency: string;
  estimatedDelivery?: string;
  availability?: string;
  status: OfferStatus;
  createdAt: any;
  updatedAt?: any;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  needId?: string;
  needTitle?: string;
  offerId?: string;
  lastMessageText: string;
  lastMessageSenderId: string;
  lastMessageTimestamp: any;
  createdAt: any;
  updatedAt: any;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  read?: boolean;
  createdAt: any;
}

export type NotificationType =
  | 'NEW_OFFER'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'NEW_MESSAGE'
  | 'STATUS_CHANGE';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedId?: string;
  relatedType?: 'need' | 'offer' | 'conversation';
  read: boolean;
  createdAt: any;
}

export interface SavedNeed {
  id: string;
  userId: string;
  needId: string;
  needTitle: string;
  category: string;
  country: string;
  city: string;
  budgetMax?: number;
  currency: string;
  createdAt: any;
}

export interface SavedListing {
  id: string;
  userId: string;
  listingId: string;
  listingTitle: string;
  category: string;
  country: string;
  city: string;
  price: number;
  currency: string;
  createdAt: any;
}

export type ReportTargetType = 'need' | 'provider' | 'listing' | 'message';
export type ReportStatus = 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';

export interface Report {
  id: string;
  reporterId: string;
  reporterEmail?: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
  reason: string;
  details: string;
  status: ReportStatus;
  createdAt: any;
  updatedAt?: any;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  iconName: string;
  description: string;
  active: boolean;
}
