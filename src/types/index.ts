export type UserRole = 'user' | 'marketer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth: Date;
  joiningDate: Date;
  lastActive: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  marketerId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  validUntil: Date;
}

export interface ScheduleCall {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number; // in minutes
  marketerId: string;
  clientName: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Timesheet {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  submissionType: 'weekly' | 'biweekly' | 'monthly';
  hours: number;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipients: string[]; // array of user IDs
  createdBy: string; // admin ID
  createdAt: Date;
  read: boolean;
  type: 'meeting' | 'offer' | 'system' | 'call';
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  participants: string[]; // array of user IDs
  organizer: string; // user ID
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Call {
  id: string;
  marketerId: string;
  clientId: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  scheduledFor: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMarketer: boolean;
}