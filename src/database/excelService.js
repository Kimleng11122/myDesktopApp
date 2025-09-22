const XLSX = require('xlsx');

class ExcelService {
  exportMembers(members, filePath) {
    // Prepare data for Excel export
    const excelData = members.map(member => ({
      'ID': member.id,
      'Name': member.name,
      'Email': member.email || '',
      'Phone': member.phone || '',
      'Address': member.address || '',
      'Membership Type': member.membership_type,
      'Status': member.status,
      'Join Date': member.join_date,
      'Last Due Date': member.last_due_date || '',
      'Payment Count': member.payment_count,
      'Notes': member.notes || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // ID
      { wch: 20 },  // Name
      { wch: 25 },  // Email
      { wch: 15 },  // Phone
      { wch: 30 },  // Address
      { wch: 15 },  // Membership Type
      { wch: 10 },  // Status
      { wch: 12 },  // Join Date
      { wch: 12 },  // Last Due Date
      { wch: 12 },  // Payment Count
      { wch: 30 }   // Notes
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Members');

    // Write file
    XLSX.writeFile(wb, filePath);
  }

  async importMembers(filePath) {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Map Excel columns to member data
      const members = jsonData.map(row => ({
        name: row['Name'] || row['name'] || '',
        email: row['Email'] || row['email'] || null,
        phone: row['Phone'] || row['phone'] || null,
        address: row['Address'] || row['address'] || null,
        membership_type: row['Membership Type'] || row['membership_type'] || 'standard',
        status: row['Status'] || row['status'] || 'active',
        notes: row['Notes'] || row['notes'] || null
      })).filter(member => member.name); // Only include members with names

      return members;
    } catch (error) {
      console.error('Error importing Excel file:', error);
      throw new Error('Failed to import Excel file: ' + error.message);
    }
  }
}

module.exports = ExcelService;
