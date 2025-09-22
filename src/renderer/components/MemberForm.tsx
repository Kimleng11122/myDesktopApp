import React, { useState, useEffect } from 'react';
import { Member } from '../../types';

interface MemberFormProps {
  member?: Member | null;
  onSave: () => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membership_type: 'standard' as 'standard' | 'premium' | 'vip',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    notes: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_type: 'membership' as 'membership' | 'renewal' | 'late_fee' | 'other',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        membership_type: member.membership_type || 'standard',
        status: member.status || 'active',
        notes: member.notes || ''
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!member && (!paymentData.amount || isNaN(Number(paymentData.amount)) || Number(paymentData.amount) <= 0)) {
      newErrors.amount = 'Payment amount is required and must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (member) {
        // Update existing member
        await window.electronAPI.updateMember(member.id!, formData);
      } else {
        // Add new member with payment
        const newMember = await window.electronAPI.addMember(formData);
        
        // Add initial payment
        if (paymentData.amount) {
          await window.electronAPI.addPayment({
            member_id: newMember.id,
            amount: Number(paymentData.amount),
            payment_type: paymentData.payment_type,
            notes: paymentData.notes
          });
        }
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error saving member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {member ? '✏️ Edit Member' : '➕ Add New Member'}
          </h2>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter member name"
            />
            {errors.name && <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
            {errors.email && <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-textarea"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Membership Type</label>
              <select
                className="form-select"
                value={formData.membership_type}
                onChange={(e) => handleInputChange('membership_type', e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          
          {!member && (
            <div style={{ 
              marginTop: '24px', 
              padding: '20px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#4a5568' }}>💳 Initial Payment</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Amount *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={paymentData.amount}
                    onChange={(e) => handlePaymentChange('amount', e.target.value)}
                    placeholder="Enter payment amount"
                    step="0.01"
                    min="0"
                  />
                  {errors.amount && <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px' }}>{errors.amount}</div>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Payment Type</label>
                  <select
                    className="form-select"
                    value={paymentData.payment_type}
                    onChange={(e) => handlePaymentChange('payment_type', e.target.value)}
                  >
                    <option value="membership">Membership</option>
                    <option value="renewal">Renewal</option>
                    <option value="late_fee">Late Fee</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Payment Notes</label>
                <textarea
                  className="form-textarea"
                  value={paymentData.notes}
                  onChange={(e) => handlePaymentChange('notes', e.target.value)}
                  placeholder="Enter payment notes (optional)"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter additional notes (optional)"
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
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : (member ? '💾 Update Member' : '➕ Add Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
