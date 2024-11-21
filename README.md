# LiveTranscript+

LiveTranscript+ is a modern web application that provides real-time audio transcription with a beautiful and interactive user interface. Built with React, TypeScript, and Tailwind CSS, it offers a seamless experience for converting speech to text.

![LiveTranscript+ Preview](public/og-image.svg)

## Features

- 🎙️ Real-time audio recording and transcription
- 📁 Audio file upload support
- 🎨 Beautiful, responsive UI with dark/light mode
- 💬 Interactive transcript display with timestamps
- ❤️ Like and comment functionality
- 🌈 Animated backgrounds and transitions
- 📱 Full responsive design for all devices

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Tanstack Query
- AssemblyAI API for transcription
- Shadcn/UI components
- React Router DOM

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/livetranscript-plus.git
cd livetranscript-plus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your AssemblyAI API key:
```env
VITE_ASSEMBLY_AI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Click the microphone button or drag and drop an audio file to start transcription
2. View real-time transcription results with timestamps
3. Like and comment on transcripts
4. Toggle between dark and light modes
5. Download or share your transcripts

## Project Structure

```
src/
  ├── components/        # React components
  ├── pages/            # Page components
  ├── utils/            # Utility functions
  ├── hooks/            # Custom React hooks
  ├── lib/              # Library configurations
  └── App.tsx           # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [AssemblyAI](https://www.assemblyai.com/) for providing the transcription API
- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/livetranscript-plus](https://github.com/yourusername/livetranscript-plus)