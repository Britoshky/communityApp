# Community Noticeboard Application

## Overview

This project is a hybrid mobile application developed using **Ionic** and **Angular**. It provides a platform for community members to share and manage public notices. Designed for simplicity and effectiveness, it allows users to post, view, and delete notices while supporting offline functionality through local database storage.

---

## Features

1. **Notices Management**: Create, view, and delete community notices.
2. **Paginated View**: Navigate through notices with pagination, customizable to display 10, 20, 50, or 100 items per page.
3. **Form Validation**:
   - **Title**: Minimum 5 characters.
   - **Description**: Minimum 20 characters.
   - All fields are required.
4. **Image Capture**: Take or upload a photo for each notice using the device's camera.
5. **Local Storage**: Save notices locally using SQLite, ensuring offline availability.
6. **Delete Confirmation**: Use a modal to confirm notice deletion.
7. **404 Redirect**: Invalid routes redirect users to the main notices page.
8. **Responsive Design**: Works seamlessly on both mobile and desktop devices.

---

## Technologies Used

- **Framework**: Ionic with Angular
- **Database**: SQLite (via Capacitor plugin)
- **Plugins**:
  - Ionic PWA Elements (camera functionality)
  - Capacitor SQLite (local database)
- **Languages**: TypeScript, HTML, SCSS
- **Build Tools**: Node.js, Ionic CLI

---

## Installation

### Prerequisites

Before starting, ensure the following tools are installed on your system:
- [Node.js](https://nodejs.org/) (v14 or later).
- [Ionic CLI](https://ionicframework.com/docs/cli):
  ```bash
  npm install -g @ionic/cli
  ```

### Steps

1. **Clone the Repository**  
   Clone the repository to your local environment:
   ```bash
   git clone https://github.com/Britoshky/communityApp.git
   cd communityApp
   ```

2. **Install Dependencies**  
   Install all the required dependencies for the project:
   ```bash
   npm install
   ```

3. **Run the Application**  
   Start the development server and view the application in your browser:
   ```bash
   ionic serve
   ```

4. **Build for Production**  
   Generate a production build to deploy the application:
   ```bash
   ionic build
   ```

5. **Run on a Device (Optional)**  
   If you want to test the application on a physical device, follow these steps:
   - Install the Capacitor CLI:
     ```bash
     npm install -g @capacitor/cli
     ```
   - Add your desired platform (Android or iOS):
     ```bash
     ionic cap add android
     ionic cap add ios
     ```
   - Sync the project:
     ```bash
     ionic cap sync
     ```
   - Open the platform-specific IDE (Android Studio or Xcode) to deploy the app:
     ```bash
     ionic cap open android
     ionic cap open ios
     ```
---

## Author

Developed by **Britoshky**. For inquiries or suggestions, please reach out via [GitHub](https://github.com/Britoshky).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
