# Membership Management System

A modern desktop application for managing memberships, built with Electron, React, TypeScript, and SQLite. This application provides a complete solution for organizations to track members, payments, and membership data with Excel import/export capabilities.

## 🚀 Features

- **Member Management**: Add, edit, and delete member information
- **Payment Tracking**: Record and monitor membership payments
- **Dashboard Analytics**: View key statistics and insights
- **Excel Integration**: Import/export data to/from Excel files
- **Modern UI**: Clean and intuitive user interface built with React
- **Offline First**: SQLite database for reliable offline operation
- **Cross-Platform**: Runs on Windows, macOS, and Linux

## 📋 Member Management

- **Member Profiles**: Store comprehensive member information including:
  - Personal details (name, email, phone, address)
  - Membership type (Standard, Premium, VIP)
  - Status tracking (Active, Inactive, Suspended)
  - Join date and payment history
  - Custom notes

- **Payment Processing**: Track various payment types:
  - Membership fees
  - Renewals
  - Late fees
  - Other payments

## 🎯 Dashboard Features

- Total member count
- Active vs inactive member breakdown
- Upcoming payment alerts
- Overdue payment tracking
- Quick access to key metrics

## 📊 Data Management

- **Excel Export**: Export all member data to Excel format
- **Excel Import**: Bulk import members from Excel files
- **Data Backup**: SQLite database for reliable data storage
- **Search & Filter**: Find members quickly with built-in search

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Desktop Framework**: Electron 28
- **Database**: SQLite with better-sqlite3
- **Build Tool**: Webpack 5
- **Styling**: CSS3 with modern design principles
- **Data Processing**: XLSX library for Excel operations

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kimleng11122/myDesktopApp.git
   cd myDesktopApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

## 🚀 Development

### Available Scripts

- `npm start` - Start the Electron application
- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build the application for production
- `npm run build:watch` - Build with watch mode for development

### Development Mode

For development with hot reload:
```bash
npm run dev
```

This will:
- Start webpack in watch mode
- Launch Electron when the build is ready
- Automatically reload when you make changes

## 📁 Project Structure

```
myAwesomeApp/
├── src/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script for secure IPC
│   ├── renderer/            # React frontend
│   │   ├── App.tsx          # Main React component
│   │   ├── components/      # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MembersList.tsx
│   │   │   ├── MemberForm.tsx
│   │   │   ├── PaymentsHistory.tsx
│   │   │   └── ExcelImportExport.tsx
│   │   ├── styles/          # CSS styles
│   │   └── index.tsx        # React entry point
│   ├── database/            # Database management
│   │   ├── database.js      # SQLite database setup
│   │   └── excelService.js  # Excel import/export logic
│   └── types/               # TypeScript type definitions
├── dist/                    # Built application (auto-generated)
├── package.json
├── webpack.config.js
├── tsconfig.json
└── README.md
```

## 💾 Database Schema

The application uses SQLite with the following main tables:

- **members**: Stores member information and membership details
- **payments**: Tracks payment history and dues
- **membership_types**: Defines available membership tiers

## 🔧 Configuration

### Database Location
The SQLite database is automatically created in the application's data directory:
- **Windows**: `%APPDATA%/membership-management-system/`
- **macOS**: `~/Library/Application Support/membership-management-system/`
- **Linux**: `~/.config/membership-management-system/`

### Excel Import/Export
- **Export**: All member data exported to Excel format
- **Import**: Supports bulk member import from Excel files
- **Format**: Standard Excel (.xlsx) format

## 🎨 UI Components

- **Dashboard**: Overview with key metrics and quick actions
- **Members List**: Comprehensive member listing with search/filter
- **Member Form**: Add/edit member information
- **Payments History**: Payment tracking and history
- **Import/Export**: Excel data management interface

## 🔒 Security

- Secure IPC communication between main and renderer processes
- Input validation and sanitization
- SQLite prepared statements to prevent injection attacks
- Electron security best practices implemented

## 📱 Cross-Platform Support

This application runs natively on:
- **Windows** (7, 8, 10, 11)
- **macOS** (10.14 or later)
- **Linux** (Ubuntu, Debian, Fedora, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

**kimleng**
- GitHub: [@Kimleng11122](https://github.com/Kimleng11122)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Kimleng11122/myDesktopApp/issues) page
2. Create a new issue with detailed information
3. Include your operating system and application version

## 🔮 Future Enhancements

- [ ] Email notifications for payment reminders
- [ ] Advanced reporting and analytics
- [ ] Member photo management
- [ ] Multi-organization support
- [ ] Cloud synchronization
- [ ] Mobile companion app
- [ ] API integration capabilities

---

**Built with ❤️ using Electron, React, and TypeScript**
