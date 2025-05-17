import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';

// Add theme context
const ThemeContext = React.createContext();

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/watch" element={<Home />} />
    </Routes>
  );
}

export default App; 