export type Category = 'Billing' | 'Bug' | 'Feature' | 'Account' | 'General';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportMessage {
  id: string;
  customerEmail: string;
  body: string;
  createdAt: string; // ISO string
  category?: Category;
  priority?: Priority;
  resolved?: boolean;
}

