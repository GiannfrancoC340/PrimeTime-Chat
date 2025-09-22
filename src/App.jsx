import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './Context/AuthContext';
import Navbar from "./Pages/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from './Components/Signup';
import CreatePost from './Components/CreatePost';
import PostDetail from './Components/PostDetail';
import PrivateRoute from './Components/PrivateRoute';
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          {/* Redirect root to login if not authenticated */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:id" element={<PostDetail />} />
          
          {/* Home route - protected */}
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          
          {/* Other protected routes */}
          <Route path="/create-post" element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } />
          <Route path="/edit-post/:id" element={
            <PrivateRoute>
              <CreatePost isEditing={true} />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
