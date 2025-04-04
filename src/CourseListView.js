// src/CourseListView.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const coursesData = [
  {
    title: 'Barn som pårørende - Everywhere, Assistants, Norway',
    image: 'https://images.unsplash.com/photo-1615797311023-58bb6f8d3c16?auto=format&fit=crop&w=300&q=80',
    file: 'Barn som pårørende - Everywhere, Assistants, Norway.md'
  },
  {
    title: 'Matsikkerhet',
    image: 'https://images.unsplash.com/photo-1572025442646-88688c1630a7?auto=format&fit=crop&w=300&q=80',
    file: 'ernaering_clean.md'
  },
  {
    title: 'ESAS - Everywhere, Assistants, Norway',
    image: 'https://images.unsplash.com/photo-1572025442646-88688c1630a7?auto=format&fit=crop&w=300&q=80',
    file: 'ESAS - Everywhere, Assistants, Norway.md'
  },
  {
    title: 'NEWS - Institution, Assistants, Norway',
    image: 'https://images.unsplash.com/photo-1572025442646-88688c1630a7?auto=format&fit=crop&w=300&q=80',
    file: 'NEWS - Institution, Assistants, Norway.md'
  },
  {
    title: 'Palliasjon - Everywhere, Assistants, Norway',
    image: 'https://images.unsplash.com/photo-1572025442646-88688c1630a7?auto=format&fit=crop&w=300&q=80',
    file: 'Palliasjon - Everywhere, Assistants, Norway.md'
  },
];

function CourseListView() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // UseEffect for å hente og sette kursene
  useEffect(() => {
    const fetchCourses = async () => {
      const coursePromises = coursesData.map(async (course) => {
        const res = await fetch(`/${course.file}`);
        const text = await res.text();

        // 📷 Finn første bilde
        const match = text.match(/!\[\]\((.*?)\)/);
        const image = match ? match[1] : course.image; // Bruker eksisterende bilde hvis ingen finnes i markdown

        return {
          ...course,
          image,
        };
      });

      const courseList = await Promise.all(coursePromises);
      setCourses(courseList);
    };

    fetchCourses();
  }, []); // Empty dependency array, fetch once on load

  return (
    <div className="min-h-screen bg-[#E1F5FE] p-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Top padding and title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-700 font-serif">JodaSkills</h1>
        </div>

        <div className="grid gap-4">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden flex items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/course/${encodeURIComponent(course.file)}`)}
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded-full mr-4"
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

