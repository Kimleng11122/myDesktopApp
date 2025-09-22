const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class DatabaseService {
  constructor() {
    try {
      const userDataPath = app.getPath('userData');
      const dbPath = path.join(userDataPath, 'members.db');
      console.log('Database path:', dbPath);
      this.db = new Database(dbPath);
      this.initTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  initTables() {
    // Create members table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        membership_type TEXT DEFAULT 'standard',
        status TEXT DEFAULT 'active',
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);

    // Create payments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        payment_type TEXT DEFAULT 'membership',
        next_due_date DATETIME,
        notes TEXT,
        FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
      CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
      CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
      CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(next_due_date);
    `);
  }

  // Member operations
  getMembers() {
    const stmt = this.db.prepare(`
      SELECT m.*, 
             (SELECT MAX(next_due_date) FROM payments WHERE member_id = m.id) as last_due_date,
             (SELECT COUNT(*) FROM payments WHERE member_id = m.id) as payment_count
      FROM members m 
      ORDER BY m.name
    `);
    return stmt.all();
  }

  addMember(memberData) {
    const stmt = this.db.prepare(`
      INSERT INTO members (name, email, phone, address, membership_type, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      memberData.name,
      memberData.email || null,
      memberData.phone || null,
      memberData.address || null,
      memberData.membership_type || 'standard',
      memberData.status || 'active',
      memberData.notes || null
    );

    return {
      id: result.lastInsertRowid,
      ...memberData
    };
  }

  updateMember(id, memberData) {
    const stmt = this.db.prepare(`
      UPDATE members 
      SET name = ?, email = ?, phone = ?, address = ?, 
          membership_type = ?, status = ?, notes = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(
      memberData.name,
      memberData.email || null,
      memberData.phone || null,
      memberData.address || null,
      memberData.membership_type || 'standard',
      memberData.status || 'active',
      memberData.notes || null,
      id
    );

    return result.changes > 0;
  }

  deleteMember(id) {
    const stmt = this.db.prepare('DELETE FROM members WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Payment operations
  getPayments(memberId = null) {
    let query = `
      SELECT p.*, m.name as member_name
      FROM payments p
      JOIN members m ON p.member_id = m.id
    `;
    
    if (memberId) {
      query += ' WHERE p.member_id = ?';
      const stmt = this.db.prepare(query);
      return stmt.all(memberId);
    } else {
      query += ' ORDER BY p.payment_date DESC';
      const stmt = this.db.prepare(query);
      return stmt.all();
    }
  }

  addPayment(paymentData) {
    const stmt = this.db.prepare(`
      INSERT INTO payments (member_id, amount, payment_date, payment_type, next_due_date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      paymentData.member_id,
      paymentData.amount,
      paymentData.payment_date || new Date().toISOString(),
      paymentData.payment_type || 'membership',
      paymentData.next_due_date || this.calculateNextDueDate(),
      paymentData.notes || null
    );

    return {
      id: result.lastInsertRowid,
      ...paymentData
    };
  }

  calculateNextDueDate() {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString();
  }

  // Dashboard statistics
  getDashboardStats() {
    try {
      console.log('Getting dashboard stats...');
      const totalMembers = this.db.prepare('SELECT COUNT(*) as count FROM members').get();
      console.log('Total members query result:', totalMembers);
      
      const activeMembers = this.db.prepare('SELECT COUNT(*) as count FROM members WHERE status = ?').get('active');
      console.log('Active members query result:', activeMembers);
      
      const inactiveMembers = this.db.prepare('SELECT COUNT(*) as count FROM members WHERE status = ?').get('inactive');
      console.log('Inactive members query result:', inactiveMembers);
    
      // Get upcoming payments (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const upcomingPayments = this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM payments 
        WHERE next_due_date <= ? AND next_due_date >= date('now')
      `).get(thirtyDaysFromNow.toISOString());

      // Get overdue payments
      const overduePayments = this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM payments 
        WHERE next_due_date < date('now')
      `).get();

      const stats = {
        totalMembers: totalMembers.count,
        activeMembers: activeMembers.count,
        inactiveMembers: inactiveMembers.count,
        upcomingPayments: upcomingPayments.count,
        overduePayments: overduePayments.count
      };
      
      console.log('Dashboard stats result:', stats);
      return stats;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseService;
