/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  days?: number;
  duration?: string;
  category?: string;
  description: string;
  image: string;
  bannerImage?: string;
  gallery?: string[];
  itinerary?: any;
  highlights?: string;
  isFeatured?: boolean;
  location?: string;
  inclusions?: string[];
  exclusions?: string[];
  groupSize?: string;
  languages?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'domestic' | 'international';
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  name: string;
  type: string;
  seats: number;
  luggage: number;
  pricePerKm: number;
  pricePerDay?: number;
  image: string;
  features?: string[];
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  link?: string;
  image: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  packageId?: string;
  createdAt: string;
}

export interface Settings {
  whatsappNumber: string;
  defaultMessage: string;
  updatedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
