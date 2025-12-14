import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Exchange from './components/Exchange';
import Shop from './components/Shop';
import News from './components/News';
import Education from './components/Education';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import { User, UserRole } from './types';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper for Admin
interface ProtectedAdminRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ user, children }) => {
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Protected Route Wrapper for User
interface ProtectedUserRouteProps {
    user: User | null;
    children: React.ReactNode;
}
  
const ProtectedUserRoute: React.FC<ProtectedUserRouteProps> = ({ user, children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const App: React.FC = () => {
  const { users } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Initialize userId from localStorage to persist session across refreshes
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('cmk_session_id');
  });

  // Derive the current user object directly from the users list.
  // This ensures that if the user's balance/data changes in Context, 
  // the App state is automatically "fresh".
  const user = userId ? users.find(u => u.id === userId) || null : null;

  // Handle side-effect: if userId exists but user not found (e.g. deleted), clear session
  useEffect(() => {
    if (userId && !user && users.length > 0) {
        localStorage.removeItem('cmk_session_id');
        setUserId(null);
    }
  }, [userId, user, users]);

  const handleLogin = (incomingUser: User) => {
    localStorage.setItem('cmk_session_id', incomingUser.id);
    setUserId(incomingUser.id);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cmk_session_id');
    setUserId(null);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar 
            user={user} 
            onLogout={handleLogout} 
            onOpenAuth={() => setIsAuthOpen(true)}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/news" element={<News />} />
            <Route path="/education" element={<Education currentUser={user} />} />
            <Route 
                path="/profile" 
                element={
                    <ProtectedUserRoute user={user}>
                        <Profile currentUser={user!} />
                    </ProtectedUserRoute>
                } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute user={user}>
                  <AdminPanel />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </main>

        <Footer />
        
        <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)}
            onLogin={handleLogin}
        />
      </div>
    </Router>
  );
};

export default App;