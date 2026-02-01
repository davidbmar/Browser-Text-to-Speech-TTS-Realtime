# Getting Started with Browser TTS

Complete instructions to get the Browser Text-to-Speech application running on your machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
  - Check your version: `node --version`
  - Download from: https://nodejs.org/
- **npm** (comes with Node.js)
  - Check your version: `npm --version`
- **Git**
  - Check if installed: `git --version`
  - Download from: https://git-scm.com/

## Step-by-Step Installation

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/davidbmar/Browser-Text-to-Speech-TTS-Realtime.git
```

### 2. Navigate to the Project Directory

```bash
cd Browser-Text-to-Speech-TTS-Realtime
```

### 3. Install Dependencies

This will download all required npm packages (may take 1-2 minutes):

```bash
npm install
```

### 4. Start the Development Server

**Option A: Use the default port (5000)**

```bash
npm run dev
```

**Option B: Use a custom port**

```bash
PORT=3344 npm run dev
```

You can replace `3344` with any available port number.

### 5. Open in Your Browser

Once the server starts, you'll see a message like:

```
11:27:47 PM [express] serving on port 5000
```

Open your browser and navigate to:
- Default: **http://localhost:5000**
- Custom port: **http://localhost:3344** (or your chosen port)

## What Happens on First Use

### Initial Model Download

The first time you click "Speak" with a voice selected:

1. **Download Phase** (~20-50MB depending on voice)
   - Progress bar shows download status
   - This happens only once per voice model
   - Models are cached in your browser's IndexedDB

2. **Initialization Phase**
   - WebAssembly runtime loads
   - Model is initialized in browser memory
   - Takes 5-10 seconds on first load

3. **Ready to Use**
   - Subsequent uses are instant (no download needed)
   - Works offline after initial download

## Basic Usage

1. **Select a Voice** from the dropdown (e.g., "English US - Female")
2. **Enter Text** in the text area
3. **Click "Speak"** - audio begins playing as soon as the first sentence is ready
4. **Adjust Settings** (optional):
   - Speed: 0.5x to 2.0x
   - Volume: 0 to 100%
   - Enable/disable auto warm-up

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Troubleshooting

### Port Already in Use

If you see an error like `EADDRINUSE` or `port already in use`:

```bash
# Use a different port
PORT=3001 npm run dev
```

### Server Won't Start (macOS)

If you're on an older version and see `ENOTSUP` errors:

```bash
# Pull the latest fixes
git pull
npm install
npm run dev
```

### Models Won't Download

1. **Check your internet connection** - first download requires internet
2. **Check browser console** (F12) for errors
3. **Try a different browser** - Chrome/Edge recommended
4. **Clear browser cache** and reload

### No Audio Playing

1. **Check browser volume** and system volume
2. **Check if browser tab is muted** (right-click tab)
3. **Try a different voice** - some models may load better than others
4. **Check browser console** (F12) for errors

### Browser Compatibility Issues

**Supported Browsers:**
- Chrome 89+ ✅ (recommended)
- Firefox 89+ ✅
- Safari 15+ ✅
- Edge 89+ ✅

**Not Supported:**
- Internet Explorer ❌
- Older mobile browsers ❌

## Advanced Configuration

### Environment Variables

You can set additional environment variables:

```bash
# Development mode (default)
NODE_ENV=development PORT=3000 npm run dev

# Production mode
NODE_ENV=production PORT=8080 npm run build && npm start
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start

# Or with custom port
PORT=8080 npm start
```

## Project Structure

Once you've cloned the repo, here's what you'll find:

```
Browser-Text-to-Speech-TTS-Realtime/
├── client/              # React frontend application
│   ├── src/
│   │   ├── hooks/      # React hooks (use-tts.ts)
│   │   ├── lib/        # Core TTS engine
│   │   └── pages/      # UI pages
│   └── index.html      # Entry HTML file
├── server/              # Express backend server
│   └── index.ts        # Server with COOP/COEP headers
├── package.json         # Dependencies and scripts
└── README.md           # Full documentation
```

## Next Steps

- Read [README.md](README.md) for complete API documentation
- Check [QUICK_START.md](QUICK_START.md) for usage examples
- See [replit.md](replit.md) for architecture details
- Try different voices and settings
- Explore the code in `client/src/hooks/use-tts.ts`

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the browser console (F12) for error messages
3. Check [GitHub Issues](https://github.com/davidbmar/Browser-Text-to-Speech-TTS-Realtime/issues)
4. Create a new issue with:
   - Your operating system
   - Browser and version
   - Error messages from console
   - Steps to reproduce

## Quick Reference

```bash
# Clone repo
git clone https://github.com/davidbmar/Browser-Text-to-Speech-TTS-Realtime.git
cd Browser-Text-to-Speech-TTS-Realtime

# Install and run
npm install
npm run dev

# Open browser
# → http://localhost:5000
```

That's it! You should now have a fully functional browser-based text-to-speech application running locally.
