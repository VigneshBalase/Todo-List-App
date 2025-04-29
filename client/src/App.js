import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpSignIn from './Screens/SignUp';
import Home from './Screens/Home';

// ProtectedRoute Component (checks for token)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

// RedirectIfAuthenticated (if logged in, redirect to /home)
const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* If logged in, redirect to /home. Otherwise, show SignUpSignIn */}
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <SignUpSignIn />
            </RedirectIfAuthenticated>
          }
        />

        {/* Protected route - only accessible with a valid token */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Fallback route (optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;