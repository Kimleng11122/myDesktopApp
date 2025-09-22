import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MembersList from './components/MembersList';
import MemberForm from './components/MemberForm';
import PaymentsHistory from './components/PaymentsHistory';
import ExcelImportExport from './components/ExcelImportExport';
import { Member, DashboardStats } from '../types';

type Page = 'dashboard' | 'members' | 'add-member' | 'edit-member' | 'payments' | 'import-export';

interface AppState {
  currentPage: Page;
  selectedMember: Member | null;
  members: Member[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
}

declare global {
  interface Window {
    electronAPI: {
      getMembers: () => Promise<Member[]>;
      addMember: (memberData: Omit<Member, 'id'>) => Promise<Member>;
      updateMember: (id: number, memberData: Omit<Member, 'id'>) => Promise<boolean>;
      deleteMember: (id: number) => Promise<boolean>;
      getPayments: (memberId?: number) => Promise<any[]>;
      addPayment: (paymentData: any) => Promise<any>;
      getDashboardStats: () => Promise<DashboardStats>;
      exportExcel: () => Promise<{ success: boolean; path?: string }>;
      importExcel: () => Promise<{ success: boolean; imported?: number }>;
    };
  }
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentPage: 'dashboard',
    selectedMember: null,
    members: [],
    dashboardStats: null,
    loading: true
  });

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const [members, dashboardStats] = await Promise.all([
        window.electronAPI.getMembers(),
        window.electronAPI.getDashboardStats()
      ]);
      
      setState(prev => ({
        ...prev,
        members,
        dashboardStats,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigateTo = (page: Page, member?: Member) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      selectedMember: member || null
    }));
  };

  const handleMemberAdded = async () => {
    await loadData();
    navigateTo('members');
  };

  const handleMemberUpdated = async () => {
    await loadData();
    navigateTo('members');
  };

  const handleMemberDeleted = async () => {
    await loadData();
    navigateTo('members');
  };

  const renderCurrentPage = () => {
    if (state.loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      );
    }

    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard stats={state.dashboardStats} />;
      case 'members':
        return (
          <MembersList
            members={state.members}
            onEdit={(member) => navigateTo('edit-member', member)}
            onDelete={handleMemberDeleted}
            onRefresh={loadData}
          />
        );
      case 'add-member':
        return (
          <MemberForm
            onSave={handleMemberAdded}
            onCancel={() => navigateTo('members')}
          />
        );
      case 'edit-member':
        return (
          <MemberForm
            member={state.selectedMember}
            onSave={handleMemberUpdated}
            onCancel={() => navigateTo('members')}
          />
        );
      case 'payments':
        return <PaymentsHistory />;
      case 'import-export':
        return <ExcelImportExport onImport={loadData} />;
      default:
        return <Dashboard stats={state.dashboardStats} />;
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2 style={{ marginBottom: '30px', fontSize: '1.5rem' }}>
          📊 Membership Manager
        </h2>
        
        <nav>
          <button
            className={`nav-item ${state.currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTo('dashboard')}
          >
            📈 Dashboard
          </button>
          
          <button
            className={`nav-item ${state.currentPage === 'members' ? 'active' : ''}`}
            onClick={() => navigateTo('members')}
          >
            👥 Members
          </button>
          
          <button
            className={`nav-item ${state.currentPage === 'add-member' ? 'active' : ''}`}
            onClick={() => navigateTo('add-member')}
          >
            ➕ Add Member
          </button>
          
          <button
            className={`nav-item ${state.currentPage === 'payments' ? 'active' : ''}`}
            onClick={() => navigateTo('payments')}
          >
            💳 Payments
          </button>
          
          <button
            className={`nav-item ${state.currentPage === 'import-export' ? 'active' : ''}`}
            onClick={() => navigateTo('import-export')}
          >
            📊 Import/Export
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default App;
