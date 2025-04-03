import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseListView from './CourseListView';
import CourseViewer from './CourseViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourseListView />} />
        <Route path="/course/:filename" element={<CourseViewer />} />
      </Routes>
    </Router>
  );
}

export default App;