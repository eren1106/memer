import { useContext } from 'react';
import Login from './pages/login/Login';
import SignUp from './pages/signUp/SignUp';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";

function App() {
  const {user} = useContext(AuthContext);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/:userId" element={<Profile />} />  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
