// src/CourseListView.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseListView() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const files = [
        { filename: 'hepro-demo.md', title: 'Hepro-demo' },
        { filename: 'ernaering_clean.md', title: 'Matsikkerhet' }
      ];

      const coursePromises = files.map(async (file) => {
        const res = await fetch(`/${file.filename}`);
        const text = await res.text();

        const match = text.match(/!\[\]\((.*?)\)/);
        const image = match ? match[1] : null;

        return {
          ...file,
          image,
        };
      });

      const courseList = await Promise.all(coursePromises);
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-jodablue font-sans">
      <div className="bg-white py-4 shadow">
        <h1 className="text-center text-3xl font-bold font-serif text-blue-900">
          Jodaskills
        </h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
      
        <div className="grid gap-4">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden flex items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/course/${encodeURIComponent(course.filename)}`)}
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-24 h-24 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 font-serif">{course.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseListView;
