export interface User {
  id: string;
  email: string;
  full_name?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  instructions?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationSchedule {
  id: string;
  medication_id: string;
  time: string; // HH:MM format
  days_of_week: number[]; // 0-6, Sunday = 0
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  taken_at?: string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  browser_notifications: boolean;
  reminder_minutes_before: number;
  snooze_minutes: number;
  created_at: string;
  updated_at: string;
}

// Helper types for UI
export interface MedicationWithSchedule extends Medication {
  schedules: MedicationSchedule[];
}

export interface TodaysMedication {
  id: string;
  name: string;
  dosage: string;
  instructions?: string;
  time: string;
  status: 'pending' | 'taken' | 'missed' | 'overdue';
  log_id?: string;
}

export interface WeeklyStats {
  adherence_percentage: number;
  total_doses: number;
  taken_doses: number;
  missed_doses: number;
  current_streak: number;
}