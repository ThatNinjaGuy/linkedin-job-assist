# LinkedIn Cover Letter Generator

This application is designed to help users generate personalized cover letters for LinkedIn job applications using OpenAI's GPT technology. The app provides a user-friendly interface to input and store your resume and OpenAI API key, and then generates a cover letter based on a job description.

## Features

- **Profile Management**:
  - Store your OpenAI API key securely.
  - Save your resume text for use in generating cover letters.

- **Cover Letter Generation**:
  - Generate a cover letter by combining your resume with a job description.
  - Uses OpenAI's GPT to create a relevant and personalized cover letter.

- **User Interface**:
  - Simple navigation between the Profile and Generator pages.
  - Responsive design with a focus on usability.

- **Development Mode**:
  - Control API usage with a flag to prevent unnecessary calls during development.

## Components

- **App**: The main component that manages the navigation between the Profile and Generator pages.
- **Profile**: Allows users to input and save their OpenAI API key and resume text.
- **Generator**: Generates a cover letter using the stored resume and a job description fetched from local storage.

## Usage

1. **Profile Setup**:
   - Navigate to the Profile page.
   - Enter your OpenAI API key and resume text.
   - Save your profile information.

2. **Generate Cover Letter**:
   - Navigate to the Generator page.
   - Click the "Generate" button to create a cover letter based on your resume and a job description.

## Development Mode

To prevent unnecessary API calls during development, a flag (`useChatGPT`) is available in `src/utils/chatGPTUtil.js`. Set this flag to `false` to use dummy data instead of making actual API calls. This helps in reducing costs and allows for testing without incurring charges.

```javascript
// src/utils/chatGPTUtil.js
const useChatGPT = false; // Set to true to make actual API calls
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/linkedin-cover-letter-generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd linkedin-cover-letter-generator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

## Testing as a Chrome Extension

1. Build the project:

   ```bash
   npm run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click "Load unpacked" and select the `build` folder generated within the project directory.

5. The extension should now be loaded and ready for testing.

## Technologies Used

- React: For building the user interface.
- OpenAI GPT: For generating cover letters.
- Local Storage: For storing user data securely.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
