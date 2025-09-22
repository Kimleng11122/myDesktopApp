import React, { useState, useEffect } from 'react';
import { Payment, Member } from '../../types';

const PaymentsHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    member_id: '',
    amount: '',
    payment_type: 'membership' as 'membership' | 'renewal' | 'late_fee' | 'other',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedMemberId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, membersData] = await Promise.all([
        window.electronAPI.getPayments(selectedMemberId || undefined),
        window.electronAPI.getMembers()
      ]);
      setPayments(paymentsData);
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentForm.member_id || !paymentForm.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await window.electronAPI.addPayment({
        ...paymentForm,
        member_id: Number(paymentForm.member_id),
        amount: Number(paymentForm.amount)
      });
      
      setPaymentForm({
        member_id: '',
        amount: '',
        payment_type: 'membership',
        notes: ''
      });
      setShowAddPayment(false);
      await loadData();
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Error adding payment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaymentTypeColor = (type: string) => {
    const colors = {
      membership: '#38a169',
      renewal: '#3182ce',
      late_fee: '#e53e3e',
      other: '#718096'
    };
    return colors[type as keyof typeof colors] || '#718096';
  };

  const getMemberName = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : `Member #${memberId}`;
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2d3748' }}>💳 Payments History</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddPayment(true)}
        >
          ➕ Add Payment
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Payment Summary</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#38a169' }}>
              {payments.length}
            </div>
            <div className="stat-label">Total Payments</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#3182ce' }}>
              {formatCurrency(totalAmount)}
            </div>
            <div className="stat-label">Total Amount</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ed8936' }}>
              {formatCurrency(totalAmount / Math.max(payments.length, 1))}
            </div>
            <div className="stat-label">Average Payment</div>
          </div>
        </div>
      </div>

      <div className="search-container">
        <select
          className="filter-select"
          value={selectedMemberId || 'all'}
          onChange={(e) => setSelectedMemberId(e.target.value === 'all' ? null : Number(e.target.value))}
        >
          <option value="all">All Members</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        
        <button className="btn btn-secondary" onClick={loadData}>
          🔄 Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Next Due</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>
                    {payment.member_name || getMemberName(payment.member_id)}
                  </div>
                </td>
                <td>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#38a169',
                    fontSize: '16px'
                  }}>
                    {formatCurrency(payment.amount)}
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: getPaymentTypeColor(payment.payment_type) + '20',
                    color: getPaymentTypeColor(payment.payment_type),
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {payment.payment_type.replace('_', ' ')}
                  </span>
                </td>
                <td>{formatDate(payment.payment_date)}</td>
                <td>
                  {payment.next_due_date ? formatDate(payment.next_due_date) : 'N/A'}
                </td>
                <td>
                  <div style={{ 
                    maxWidth: '200px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {payment.notes || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {payments.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#718096' 
          }}>
            {selectedMemberId 
              ? 'No payments found for this member.' 
              : 'No payments found. Add your first payment to get started!'
            }
          </div>
        )}
      </div>

      {showAddPayment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">➕ Add Payment</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowAddPayment(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPayment}>
              <div className="form-group">
                <label className="form-label">Member *</label>
                <select
                  className="form-select"
                  value={paymentForm.member_id}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, member_id: e.target.value }))}
                  required
                >
                  <option value="">Select a member</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.membership_type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Amount *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Payment Type</label>
                  <select
                    className="form-select"
                    value={paymentForm.payment_type}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_type: e.target.value as any }))}
                  >
                    <option value="membership">Membership</option>
                    <option value="renewal">Renewal</option>
                    <option value="late_fee">Late Fee</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter payment notes (optional)"
                  rows={3}
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '12px', 
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddPayment(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  💾 Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsHistory;
