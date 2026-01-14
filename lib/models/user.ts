export interface User {
  _id?: string;

  // Auth
  authProvider: 'google';
  authProviderId: string;

  // Profile
  name: string;
  email: string;
  image?: string;
  role?: 'skillswapper' | 'admin'; // Default: skillswapper

  // Skills
  canTeach: string[];
  wantsHelpWith: string[];

  // State
  onboardingCompleted: boolean;

  // Meta
  createdAt: Date;
  updatedAt: Date;
}