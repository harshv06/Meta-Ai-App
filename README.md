# __Meta AI Clone__
This is a clone of the Meta AI application with features for chatbot conversations and image generation. The app boasts a clean UI, animations, and state management using Redux. It is built with Expo and allows storing chats locally for better user experience.

### Features
*1. Chatbot Functionality: Engage in conversations with the AI chatbot.*  

*2. Image Generation: Generate images using AI.*

*3. Clean UI: Designed with a focus on simplicity and user experience.*  

*4. Animations: Enhances visual appeal with smooth animations.*  

*5. Redux State Management: Efficiently manages state across the app.*  

*6. Local Storage Support: Save and retrieve chats from local storage for a seamless user experience.*  

*7. Built with Expo for cross-platform compatibility (Android/iOS).*  

### Installation and Setup
Follow these steps to set up the project locally:

1. Prerequisites
Ensure you have the following installed:

>Node.js (v14 or later)  
>npm or yarn  
>Expo CLI (if not installed, run npm install -g expo-cli)


  
2. Clone the Repository
```
git clone https://github.com/your-username/meta-ai-clone.git
cd meta-ai-clone
```
3. Install Dependencies
Run the following command to install the required packages:

```
npm install
```
### or
```
yarn install
```
4. Start the App
Start the Expo development server:
```
expo start
```
You can now scan the QR code using the Expo Go app on your device or run the app on an emulator.  


## State Management
The app uses Redux Toolkit for state management:

chatSlice: Manages chat conversations and message states.  

1. Includes actions for adding, updating, and deleting messages or chats.
2. Supports persisting chats to local storage.
3. Local Storage
4. Chats and messages are stored using a custom utility that interfaces with Expo Secure Store:

Chats are saved automatically after creation or updates.
Messages are saved and retrieved seamlessly between app sessions.
Built With
React Native with Expo
Redux Toolkit for state management
Expo Secure Store for local storage
Animations using React Native libraries (e.g., react-native-reanimated)
Contributing
Contributions are welcome! If you'd like to suggest improvements or report bugs:

Fork the repository.  

Create a new branch  

```(git checkout -b feature-branch-name)```  

Commit your changes  

```(git commit -m "Add feature/fix bug")```  

Push to your branch  

```(git push origin feature-branch-name)```  

Create a pull request.  

License
This project is licensed under the MIT License.

Contact
For any inquiries or feedback, please contact:

Name: Harsh
Email: harshvonmail@gmail.com
GitHub: harshv06
