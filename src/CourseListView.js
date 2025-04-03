// src/CourseListView.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    title: 'Hepro-demo',
    image: 'https://images.unsplash.com/photo-1615797311023-58bb6f8d3c16?auto=format&fit=crop&w=300&q=80',
    file: 'hepro-demo.md'
  },
  {
    title: 'Matsikkerhet',
    image: 'https://images.unsplash.com/photo-1572025442646-88688c1630a7?auto=format&fit=crop&w=300&q=80',
    file: 'ernaering_clean.md'
  }
];

function CourseListView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Dine kurs</h1>
      <div className="grid gap-4">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden flex items-center cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/course/${encodeURIComponent(course.file)}`)}
          >
            <img src={course.image} alt={course.title} className="w-24 h-24 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseListView;