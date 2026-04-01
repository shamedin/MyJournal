# TradeLog - Professional Trading Journal

A clean, minimal trading journal web app built with Next.js 16 that runs entirely in your browser with no backend required.

## Features

### Core Features
- **Trade Entry**: Log trades with detailed information including charts, emotions, confidence levels, and strategy notes
- **Chart Screenshots**: Upload 1D, 4H, and 15M chart images for visual reference
- **Auto-calculations**: Automatic calculation of win rates, equity curves, and risk:reward ratios
- **Psychology Tracking**: Record emotions and mental state for each trade
- **Tag System**: Organize trades by strategy type (scalp, breakout, etc.)

### Analysis & Statistics
- **Equity Curve**: Line chart showing account balance progression
- **Win/Loss Distribution**: Pie chart of winning vs losing trades
- **Strategy Breakdown**: Performance analysis by trading strategy
- **Risk & Reward Analysis**: Detailed metrics on average wins/losses, largest trades, and profit factors
- **KPI Dashboard**: Quick overview of key metrics (total trades, win rate, P&L, profit factor)

### Data Management
- **Trade History**: Browse all trades with filtering and search
- **Filter Options**: Filter by pair, result (win/loss), and strategy
- **Export Functions**:
  - Export individual trades as PDF (captures the journal layout)
  - Export all trades as Excel spreadsheet with summary sheet
  - Individual trade Excel exports

### UI Features
- **Dark Mode**: Built-in dark/light mode toggle with system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Local Storage**: All data stored in browser localStorage (no account needed)
- **Clean Interface**: Minimal design focused on trader productivity

## Getting Started

### Installation

```bash
# Clone or download the project
# Install dependencies
pnpm install

# or with npm
npm install

# or with yarn
yarn install
```

### Running Locally

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.2
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Export**:
  - `html2canvas` - PDF generation
  - `jspdf` - PDF formatting
  - `xlsx` - Excel export
- **State**: React hooks + localStorage
- **Date Handling**: date-fns

## Project Structure

```
app/
├── page.tsx                  # Home/landing page
├── journal/page.tsx          # Main trade entry page
├── statistics/page.tsx       # Statistics dashboard
├── history/page.tsx          # Trade history and management
└── layout.tsx                # Root layout with navigation

components/
├── trading-journal/          # Trade logging components
│   ├── TradeForm.tsx         # Main form for entering trades
│   ├── ChartImageUpload.tsx  # Image upload component
│   └── JournalLayout.tsx     # Trade display layout
├── statistics/               # Statistics/chart components
│   ├── StatsOverview.tsx     # KPI cards
│   ├── EquityCurve.tsx       # Balance line chart
│   ├── WinLossChart.tsx      # Win/loss pie chart
│   ├── StrategyBreakdown.tsx # Strategy bar chart
│   └── RiskRewardAnalysis.tsx # Risk metrics
├── navigation/
│   └── MainNav.tsx           # Top navigation with dark mode

lib/
├── types.ts                  # TypeScript interfaces
├── storage.ts                # localStorage utilities
├── calculations.ts           # Statistics calculations
└── exports.ts                # PDF and Excel export logic
```

## Usage

### Logging a Trade

1. Go to the **Journal** page
2. Fill in the trade details:
   - Date, pair, time, direction (BUY/SELL)
   - Strategy, confidence level, emotions
   - Expected and actual risk:reward ratios
   - Risk %, profit/loss, account balance
   - Notes and tags
3. Upload chart screenshots (1D, 4H, 15M)
4. Click "Save Trade"

### Viewing Statistics

1. Go to the **Statistics** page
2. View your trading metrics:
   - Total trades, win rate, total P&L
   - Equity curve over time
   - Win/loss distribution
   - Strategy performance breakdown
   - Risk & reward analysis

### Managing Trades

1. Go to the **History** page
2. Search and filter trades by:
   - Pair
   - Result (Win/Loss)
   - Strategy
   - Custom search terms
3. Export individual trades as Excel or delete them
4. View summary statistics for filtered trades

### Exporting Data

**PDF Export** (Individual Trade):
- View a trade in the journal
- Click the "PDF" button to download a printable journal sheet

**Excel Export**:
- Individual trade: Click "Excel" button on a trade
- All trades: Planned feature for bulk export

## Data Storage

- **All data is stored locally in your browser** using localStorage
- No server or account required
- Data persists between sessions
- You can export your data as Excel to back it up

### Clearing Data

To reset all data:
```javascript
// In browser console:
localStorage.clear()
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Requires localStorage support

## Future Enhancements

- Bulk export all trades to Excel
- Trade duplication/cloning
- Advanced filtering (date range, P&L range)
- Trade comparison tool
- Mobile app version
- Cloud sync with optional backend
- Advanced statistics (MAE, MFE tracking)
- Trading plan templates

## License

MIT

## Support

This is a frontend-only application. If you encounter any issues:

1. Check browser console for errors (F12)
2. Ensure localStorage is enabled
3. Try clearing browser cache
4. Use a different browser to test

## Privacy

Your trading data never leaves your browser. All calculations and exports happen locally. No data is sent to any server.

---

**TradeLog** - Built for traders who take their craft seriously.
