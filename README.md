# React Authentication Boilerplate

A modern React authentication boilerplate built with Vite, featuring user authentication, protected routes, and a beautiful UI using Material-UI and Tailwind CSS.

## 🚀 Features

- **Modern Stack**: React 18, Vite, React Router v7
- **Authentication**: Complete auth flow with login/register/logout
- **Protected Routes**: Route protection with authentication checks
- **UI Components**: Material-UI components with Tailwind CSS styling
- **State Management**: React Context API for global state
- **API Integration**: Axios for HTTP requests with interceptors
- **Responsive Design**: Mobile-friendly responsive layout
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router v7
- **UI Framework**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Vite
- **Linting**: ESLint

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-auth-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

## 🗂️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx  # Route protection component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Protected dashboard
│   └── Profile.jsx     # User profile page
├── utils/              # Utility functions
│   └── api.js          # Axios configuration
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🔐 Authentication Flow

1. **Registration**: Users can create new accounts
2. **Login**: Authentication with email/password
3. **Token Management**: JWT tokens stored in localStorage
4. **Protected Routes**: Automatic redirection for unauthenticated users
5. **Logout**: Clear tokens and redirect to home

## 🎨 Styling

The project uses a combination of:
- **Material-UI**: For component library and theming
- **Tailwind CSS**: For utility-first styling
- **Custom CSS**: For additional styling needs

Tailwind's `preflight` is disabled to avoid conflicts with Material-UI's default styles.

## 🔧 API Integration

The boilerplate includes:
- Axios instance with base URL configuration
- Request interceptors for adding authentication tokens
- Response interceptors for handling token expiration
- Error handling for API calls

## 🛡️ Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Protected route components
- Input validation and sanitization
- Error boundary implementation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Backend Requirements

This frontend expects a backend API with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)