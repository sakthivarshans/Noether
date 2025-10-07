# **App Name**: Noether

## Core Features:

- Google Login: Authentication via Google OAuth and Firebase Auth to store user's email and name, then redirect to dashboard.
- Dashboard: Display of the Noether app name, tagline, responsive layout with cards, motivational quotes, and quick-access buttons to various tools.
- Document Processing with Gemini: Enables users to upload `.pptx` or `.pdf` files, summarize the content, highlight key topics, and generate flashcards, and create flowcharts using the Gemini API.
- Data Storage: Store uploaded files and Gemini API responses in Firebase Firestore, to manage and organize study materials efficiently.
- PYQ Answer Generation: Enables upload of past year question (PYQ) files to generate detailed answers using the Gemini API, including copy/download options.
- Timetable Generation: Automates the generation of study timetables based on the number of subjects and total study hours, allowing equal splitting with breaks and saving to Firestore.
- To-Do List and Reminders: Facilitates task addition with deadlines, sets reminders via Google Calendar API, and tracks tasks using a list with checkboxes, stored in Firestore.
- Voice-to-Text Notes: Transcribes voice input into text notes in real time, allowing for editing and saving, as well as downloading in `.txt` or `.docx` format.
- Pomodoro Timer: Implements a 25-minute timer with 5-minute breaks that runs in the background and displays time left, integrating start, pause, and reset functions with floating display capability.
- Fun Brain Games: Interactive puzzles and memory games with score tracking and leaderboard integration displayed in the user's profile and dashboard.
- Focus Music Player: Curated playlist of 5-10 instrumental tracks with play, pause, and next buttons, featuring background playback to aid focus.
- Power Nap Alarm: Allows users to set nap durations, activates a loud alarm with a math problem for deactivation to ensure awakening.
- Topic Search Engine: Topic Search: tool using the Google Programmable Search API or Gemini to find the top 5 results based on the query and display these in a readable format.
- User Profile: Provides an editable profile with fields such as name, college, degree, summary, projects, hobbies, and skills, saved to Firebase with minimal UI.

## Style Guidelines:

- Primary color: Light lavender (#E6E6FA) for a soothing and calming effect, aligning with the learning environment.
- Background color: Soft beige (#F5F5DC), providing a warm, neutral backdrop to ensure readability and focus.
- Accent color: Pale blue (#ADD8E6), used to highlight key interactive elements and calls to action, ensuring these stand out subtly without disrupting focus.
- Body text font: 'Inter', a sans-serif, which balances a clean, modern aesthetic with excellent readability for extended study sessions.
- Headline font: 'Space Grotesk', a sans-serif font for headers to lend a touch of modernity, and set off titles from body text.
- Use a set of minimalist, custom icons that reflect the functions they represent. For instance, the document upload icon might be a file with an upward-pointing arrow, the timer might use a simple clock face, and the voice notes a microphone. All icons should match the chosen color palette.
- The dashboard will feature a card-based layout, creating an organized and visually digestible experience. Each card represents a tool or feature, providing a direct access point. Implement responsive design to reflow the cards according to screen size, ensuring optimal display on both desktop and mobile devices.
- Implement subtle animations such as hover effects on buttons, smooth transitions between pages, and a gentle pulse on the Pomodoro timer. These animations provide feedback, and add polish.