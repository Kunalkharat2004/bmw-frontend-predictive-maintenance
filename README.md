# BMW Vehicle Health Monitoring - Frontend

Modern React dashboard for AI-powered vehicle health monitoring and predictive maintenance.

## Features

- **Real-time Telemetry Input**: 12 vehicle parameters with intuitive sliders
- **AI-Powered Analysis**: LSTM + Autoencoder predictions
- **Visual KPIs**: Color-coded metrics for quick assessment
- **Component Health**: Detailed breakdown by system
- **Degradation Analysis**: Identify top risk factors
- **Maintenance Recommendations**: AI-driven decisions
- **Beautiful UI**: Modern design with TailwindCSS

## Tech Stack

- **React 19.2** - UI Framework
- **Vite 7.2** - Build tool
- **TailwindCSS 4.1** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already created with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 4. Make Sure Backend is Running

The frontend requires the Flask backend to be running:
```bash
cd ../backend
python app.py
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx           # Main dashboard
│   ├── TelemetryForm.jsx       # Input sliders
│   ├── KPICards.jsx            # Metrics display
│   ├── ComponentHealth.jsx     # Health breakdown
│   ├── DegradationContributors.jsx
│   └── MaintenanceRecommendation.jsx
├── services/
│   └── api.js          # API integration
├── utils/
│   └── helpers.js      # Utilities
├── App.jsx             # Root component
└── index.css           # Styles
```

## Usage

1. **Adjust Telemetry**: Use sliders to set vehicle parameters
   - Battery System (SoC, SoH, Voltage, Current)
   - Thermal (Battery & Motor Temperature)
   - Motor (Vibration, RPM)
   - Braking (Pad Wear)
   - Usage Metrics

2. **Analyze**: Click "🔍 Analyze Vehicle Health"

3. **Review Results**:
   - Maintenance recommendation
   - KPI metrics (4 cards)
   - Component health (5 systems)
   - Degradation contributors

## Building for Production

```bash
npm run build
```

Outputs to `dist/` directory. Deploy to Vercel, Netlify, or any static hosting.

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:5000/api`)

For production:
```env
VITE_API_BASE_URL=https://your-backend.com/api
```

## Features vs Streamlit

✅ Modern, beautiful design  
✅ Mobile-responsive  
✅ Fast, smooth interactions  
✅ Fully customizable  
✅ Easy deployment  
✅ Better user experience  

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Support

For issues or questions, check the backend README and API documentation.

---

**Powered by AI & Machine Learning** 🚗
