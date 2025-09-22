import React from 'react';
import { DashboardStats } from '../../types';

interface DashboardProps {
  stats: DashboardStats | null;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#2d3748' }}>
        📊 Dashboard
      </h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalMembers}</div>
          <div className="stat-label">Total Members</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#38a169' }}>
            {stats.activeMembers}
          </div>
          <div className="stat-label">Active Members</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#e53e3e' }}>
            {stats.inactiveMembers}
          </div>
          <div className="stat-label">Inactive Members</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#ed8936' }}>
            {stats.upcomingPayments}
          </div>
          <div className="stat-label">Upcoming Payments</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#e53e3e' }}>
            {stats.overduePayments}
          </div>
          <div className="stat-label">Overdue Payments</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📈 Quick Overview</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '16px', color: '#4a5568' }}>Member Status Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Active Members</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '8px', 
                    backgroundColor: '#e2e8f0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(stats.activeMembers / stats.totalMembers) * 100}%`,
                      height: '100%',
                      backgroundColor: '#38a169'
                    }}></div>
                  </div>
                  <span style={{ fontWeight: '600', color: '#38a169' }}>
                    {stats.activeMembers}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Inactive Members</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '8px', 
                    backgroundColor: '#e2e8f0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(stats.inactiveMembers / stats.totalMembers) * 100}%`,
                      height: '100%',
                      backgroundColor: '#e53e3e'
                    }}></div>
                  </div>
                  <span style={{ fontWeight: '600', color: '#e53e3e' }}>
                    {stats.inactiveMembers}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '16px', color: '#4a5568' }}>Payment Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f0fff4', 
                border: '1px solid #9ae6b4',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Upcoming Payments (30 days)</span>
                  <span style={{ fontWeight: '600', color: '#38a169' }}>
                    {stats.upcomingPayments}
                  </span>
                </div>
              </div>
              
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fed7d7', 
                border: '1px solid #feb2b2',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Overdue Payments</span>
                  <span style={{ fontWeight: '600', color: '#e53e3e' }}>
                    {stats.overduePayments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
