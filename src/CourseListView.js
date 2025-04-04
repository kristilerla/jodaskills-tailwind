// src/CourseListView.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseListView() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const files = [
      { filename: 'ernaering_clean.md', title: 'Matsikkerhet' },
      { filename: 'ESAS.md', title: 'ESAS' },
      { filename: 'Jodacare.md', title: 'Jodacare' },
      { filename: 'Jodapro.md', title: 'Jodapro' },
      { filename: 'Palliasjon.md', title: 'Palliasjon' },
      { filename: 'Smertelindring.md', title: 'Smertelindring' },
      { filename: 'NEWS.md', title: 'NEWS' },
      { filename: 'Barn-paaror.md', title: 'Barn som pårørende' },
    ];

    const fetchCourses = async () => {
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
    <div className="min-h-screen bg-[#E1F5FE] p-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-serif font-bold text-center text-blue-700 mb-6">Jodaskills</h1>
        <div className="grid gap-4">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden flex items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/course/${encodeURIComponent(course.filename)}`)}
            >
              {course.image && (
                <img src={course.image} alt={course.title} className="w-24 h-24 object-cover" />
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