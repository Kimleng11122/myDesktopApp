export interface Member {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  membership_type: 'standard' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'suspended';
  join_date?: string;
  last_due_date?: string;
  payment_count?: number;
  notes?: string;
}

export interface Payment {
  id?: number;
  member_id: number;
  amount: number;
  payment_date: string;
  payment_type: 'membership' | 'renewal' | 'late_fee' | 'other';
  next_due_date?: string;
  notes?: string;
  member_name?: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  upcomingPayments: number;
  overduePayments: number;
}

export interface ExcelImportResult {
  success: boolean;
  imported?: number;
}

export interface ExcelExportResult {
  success: boolean;
  path?: string;
}
