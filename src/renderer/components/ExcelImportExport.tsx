import React, { useState } from 'react';

interface ExcelImportExportProps {
  onImport: () => void;
}

const ExcelImportExport: React.FC<ExcelImportExportProps> = ({ onImport }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const result = await window.electronAPI.exportExcel();
      
      if (result.success) {
        showMessage('success', `Members exported successfully to: ${result.path}`);
      } else {
        showMessage('error', 'Export was cancelled or failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      showMessage('error', 'Error exporting members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const result = await window.electronAPI.importExcel();
      
      if (result.success) {
        showMessage('success', `Successfully imported ${result.imported} members`);
        await onImport(); // Refresh the data
      } else {
        showMessage('error', 'Import was cancelled or failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      showMessage('error', 'Error importing members. Please check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#2d3748' }}>
        📊 Import/Export Excel
      </h1>

      {message && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#f0fff4' : '#fed7d7',
          border: `1px solid ${message.type === 'success' ? '#9ae6b4' : '#feb2b2'}`,
          color: message.type === 'success' ? '#22543d' : '#742a2a'
        }}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Export Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📤 Export Members</h2>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#4a5568', marginBottom: '16px' }}>
              Export all members to an Excel file (.xlsx). The file will include all member information 
              including contact details, membership type, status, and payment history.
            </p>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ marginBottom: '8px', color: '#2d3748' }}>📋 Export includes:</h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                color: '#4a5568'
              }}>
                <li>• Member ID, Name, Email, Phone</li>
                <li>• Address, Membership Type, Status</li>
                <li>• Join Date, Last Due Date</li>
                <li>• Payment Count, Notes</li>
              </ul>
            </div>
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Exporting...' : '📤 Export to Excel'}
          </button>
        </div>

        {/* Import Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📥 Import Members</h2>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#4a5568', marginBottom: '16px' }}>
              Import members from an Excel file (.xlsx). The file should have columns matching 
              the member data structure.
            </p>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ marginBottom: '8px', color: '#2d3748' }}>📋 Required columns:</h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                color: '#4a5568'
              }}>
                <li>• <strong>Name</strong> (required)</li>
                <li>• Email, Phone, Address (optional)</li>
                <li>• Membership Type, Status (optional)</li>
                <li>• Notes (optional)</li>
              </ul>
            </div>
          </div>
          
          <button
            className="btn btn-success"
            onClick={handleImport}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Importing...' : '📥 Import from Excel'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h2 className="card-title">📖 Instructions</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '12px', color: '#4a5568' }}>For Export:</h3>
            <ol style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Click "Export to Excel" button</li>
              <li>Choose where to save the file</li>
              <li>Open the file in Excel or similar application</li>
              <li>Edit data as needed and save</li>
            </ol>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '12px', color: '#4a5568' }}>For Import:</h3>
            <ol style={{ color: '#4a5568', paddingLeft: '20px' }}>
              <li>Prepare your Excel file with proper columns</li>
              <li>Click "Import from Excel" button</li>
              <li>Select your Excel file</li>
              <li>Members will be added automatically</li>
            </ol>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: '#fef5e7', 
          borderRadius: '8px',
          border: '1px solid #f6e05e'
        }}>
          <h4 style={{ marginBottom: '8px', color: '#744210' }}>⚠️ Important Notes:</h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            color: '#744210'
          }}>
            <li>• Only .xlsx files are supported</li>
            <li>• The first row should contain column headers</li>
            <li>• Member names are required for import</li>
            <li>• Duplicate members will be added as new entries</li>
            <li>• Imported members will have "active" status by default</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportExport;
