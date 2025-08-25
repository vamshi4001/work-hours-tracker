# Work Hours Tracker

A clean, modern web application for tracking work hours with weekly and monthly views. Built with Next.js, TypeScript, and IndexedDB for local data persistence.

## Features

### 📅 Dual View Modes
- **Monthly View**: Complete month calendar with all weeks
- **Weekly View**: Focused single-week view for detailed tracking
- **Easy Toggle**: Switch between views with a single click

### ⌨️ Intuitive Data Entry
- **Direct Input**: Click any weekday cell and start typing
- **Tab Navigation**: Move between cells using Tab/Shift+Tab
- **Auto-Save**: Data saves automatically as you type
- **Decimal Support**: Enter precise hours (e.g., 7.5, 8.25)

### 🎨 Clean Design
- **Visual Hierarchy**: Hours displayed in large, bold blue text
- **Date Context**: Small date numbers in each cell corner
- **Weekend Handling**: Weekends are disabled and grayed out
- **Responsive Layout**: Works on desktop and mobile devices

### 💾 Data Persistence
- **Local Storage**: Uses IndexedDB for reliable browser storage
- **No Server Required**: All data stays on your device
- **Cross-Session**: Data persists when you close and reopen the app
- **Month-Based**: Each month's data is stored separately

### 📊 Smart Totals
- **Weekly Totals**: Automatic calculation for each week row
- **Monthly/Weekly Total**: Bottom summary based on current view
- **Real-Time Updates**: Totals update as you type

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vamshi4001/work-hours-tracker.git
   cd work-hours-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## How to Use

### Basic Usage
1. **Choose Your View**: Toggle between Monthly and Weekly views using the buttons in the header
2. **Enter Hours**: Click any weekday cell and type your hours (e.g., 8, 7.5, 8.25)
3. **Navigate**: Use Previous/Next buttons to move between months or weeks
4. **Review Totals**: Check weekly and monthly totals automatically calculated

### Navigation
- **Monthly View**: Navigate month by month
- **Weekly View**: Navigate week by week
- **Current Period**: App opens to current month/week by default

### Data Entry Tips
- Only weekdays are editable (weekends are disabled)
- Use decimal points for partial hours (7.5 = 7 hours 30 minutes)
- Tab key moves to next editable cell
- Shift+Tab moves to previous cell
- Data saves automatically - no need to click save

### Visual Guide
- **Small gray numbers**: Date of the month (top-left corner)
- **Large blue numbers**: Hours entered (center of cell)
- **Grayed cells**: Weekends (non-editable)
- **White cells**: Editable weekdays

## Technical Details

### Built With
- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **date-fns**: Modern date utility library
- **IndexedDB**: Browser database for local storage

### Project Structure
```
hours-tracker/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # App layout component
│   └── page.tsx             # Main hours tracker component
├── lib/
│   └── indexedDB.ts         # Database utility functions
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

### Data Storage
- Data is stored locally in your browser using IndexedDB
- Each month's data is stored as a separate record
- Format: `{ "2025-08-25": "8.0", "2025-08-26": "7.5" }`
- No data is sent to external servers

## Customization

### Changing Week Start Day
By default, weeks start on Monday. To change this, modify the `weekStartsOn` parameter in the date-fns functions:

```typescript
const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // 0 = Sunday
```

### Styling
The app uses inline styles for maximum compatibility. To customize colors or fonts, edit the style objects in `app/page.tsx`.

### Adding Features
The modular structure makes it easy to add features:
- Export functionality (CSV, PDF)
- Project/task categories
- Time tracking with start/stop
- Reporting and analytics

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

IndexedDB is supported in all modern browsers.

## Privacy & Security

- **Local Only**: All data stays on your device
- **No Tracking**: No analytics or tracking scripts
- **No Account Required**: No sign-up or login needed
- **Offline Ready**: Works without internet connection

## Troubleshooting

### Data Not Saving
- Ensure your browser allows IndexedDB
- Check if you're in private/incognito mode (may limit storage)
- Clear browser cache and try again

### Tab Navigation Not Working
- Make sure you're clicking on weekday cells (not weekends)
- Try refreshing the page if navigation seems stuck

### Performance Issues
- The app is optimized for fast performance
- If slow, try clearing browser data or restarting browser

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

### Open Source & Free for Personal Use

This Work Hours Tracker is completely **free and open source** for everyone to use:

✅ **Personal Use**: Use it to track your own work hours  
✅ **Commercial Use**: Use it in your business or for client work  
✅ **Modification**: Customize it to fit your needs  
✅ **Distribution**: Share it with others or host your own version  
✅ **Private Use**: Use it internally in your organization  

**No restrictions, no fees, no sign-up required!**

### SEO & Discoverability

This app is optimized for search engines with:
- Comprehensive meta tags and Open Graph data
- Mobile-friendly responsive design
- Fast loading times with Next.js optimization
- Semantic HTML structure
- Accessibility features for screen readers

Perfect for freelancers, contractors, consultants, and anyone who needs to track work hours efficiently.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Review the code - it's well-commented and straightforward

---

**Happy time tracking!** 🎯
