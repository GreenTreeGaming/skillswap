export interface User {
  _id?: string;

  // Auth
  authProvider: 'google';
  authProviderId: string;

  // Profile
  name: string;
  email: string;
  image?: string;

  ratingAvg: number;     // e.g. 4.83
  ratingCount: number;

  // Skills
  canTeach: string[];
  wantsHelpWith: string[];

  // State
  onboardingCompleted: boolean;

  // 🔐 Admin
  admin?: boolean;       // true only for admins

  // Meta
  createdAt: Date;
  updatedAt: Date;
}