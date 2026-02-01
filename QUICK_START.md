# Quick Start Guide

Get up and running with Browser TTS in under 5 minutes.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/browser-tts-realtime.git
cd browser-tts-realtime

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser to `http://localhost:5000`

## First Steps

### 1. Test the TTS Engine

1. The app will load on the home page
2. Select a voice from the dropdown (default: HFC Female US)
3. Type or paste text in the text area
4. Click "Speak" to hear the text
5. Use the controls to adjust speed and volume

### 2. Try Different Voices

Available voices:
- **English (US)**: HFC Female, HFC Male, LibriTTS
- **English (UK)**: Alba, Aru
- **German**: Thorsten
- **French**: Siwis
- **Spanish**: DaveFX

### 3. Explore Features

- **Real-time Streaming**: Audio starts playing immediately while rest generates
- **Pause/Resume**: Control playback with pause and resume buttons
- **Speed Control**: Adjust speech rate from 0.5x to 2.0x
- **Volume Control**: Adjust volume from 0% to 100%
- **Progress Tracking**: See generation progress in real-time

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Troubleshooting

### Audio Not Playing

- Check browser compatibility (Chrome 92+, Firefox 95+, Safari 15.2+)
- Ensure you're using HTTPS or localhost
- Check browser console for errors
- Try a different voice

### Slow Performance

- Ensure cross-origin isolation headers are working
- Check CPU usage (WASM is CPU-intensive)
- Try reducing text length
- Close other browser tabs

### Model Loading Issues

- Wait for initial model download (can take 30-60 seconds first time)
- Check network connectivity
- Clear browser cache and reload

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Check [IMPROVEMENTS.md](IMPROVEMENTS.md) for enhancement ideas
- Review [replit.md](replit.md) for architecture details
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Browser Requirements

- WebAssembly support
- SharedArrayBuffer support (requires cross-origin isolation)
- Web Audio API support
- Modern browser (released in last 2-3 years)

## Performance Tips

1. **Pre-warm models**: Models auto-warm on voice selection for instant playback
2. **Use shorter sentences**: Better streaming experience
3. **Close background tabs**: More CPU for WASM processing
4. **Use Chrome/Edge**: Best WebAssembly performance

## Common Use Cases

### Reading Articles

1. Copy article text
2. Paste into text area
3. Select preferred voice
4. Click Speak
5. Listen while doing other tasks

### Language Learning

1. Select voice in target language
2. Enter text to practice pronunciation
3. Adjust speed for learning
4. Repeat as needed

### Accessibility

1. Paste web content
2. Adjust speed and volume for comfort
3. Use keyboard shortcuts (coming soon)
4. Listen to content hands-free

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/browser-tts-realtime/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/browser-tts-realtime/discussions)
- Documentation: [Project Wiki](https://github.com/yourusername/browser-tts-realtime/wiki)
