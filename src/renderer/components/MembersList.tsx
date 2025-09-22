import React, { useState } from 'react';
import { Member } from '../../types';

interface MembersListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

const MembersList: React.FC<MembersListProps> = ({ members, onEdit, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filteredAndSortedMembers = members
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.phone?.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Member];
      let bValue: any = b[sortBy as keyof Member];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await window.electronAPI.deleteMember(id);
        await onDelete();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'status-badge status-active',
      inactive: 'status-badge status-inactive',
      suspended: 'status-badge status-suspended'
    };
    return (
      <span className={statusClasses[status as keyof typeof statusClasses] || 'status-badge'}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2d3748' }}>👥 Members ({filteredAndSortedMembers.length})</h1>
        <button className="btn btn-primary" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search members by name, email, or phone..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="join_date">Sort by Join Date</option>
          <option value="status">Sort by Status</option>
          <option value="membership_type">Sort by Type</option>
        </select>
        
        <button
          className="btn btn-secondary"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Last Due</th>
              <th>Payments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>
                      {member.name}
                    </div>
                    {member.notes && (
                      <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                        {member.notes}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    {member.email && (
                      <div style={{ fontSize: '14px' }}>📧 {member.email}</div>
                    )}
                    {member.phone && (
                      <div style={{ fontSize: '14px' }}>📞 {member.phone}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    textTransform: 'capitalize',
                    fontWeight: '500',
                    color: '#4a5568'
                  }}>
                    {member.membership_type}
                  </span>
                </td>
                <td>{getStatusBadge(member.status)}</td>
                <td>{formatDate(member.join_date)}</td>
                <td>{formatDate(member.last_due_date)}</td>
                <td>
                  <span style={{ 
                    fontWeight: '600',
                    color: member.payment_count && member.payment_count > 0 ? '#38a169' : '#718096'
                  }}>
                    {member.payment_count || 0}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => onEdit(member)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleDelete(member.id!)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedMembers.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#718096' 
          }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'No members found matching your criteria.' 
              : 'No members found. Add your first member to get started!'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersList;
