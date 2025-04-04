

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    title: 'Matsikkerhet', 
    file: 'ernaering_clean.md',
  },
  {
    title: 'ESAS - Everywhere, Assistants, Norway',
    file: 'ESAS - Everywhere, Assistants, Norway.md',
  },
  {
    title: 'Jodapro - Everywhere, Assistants, Norway',
    file: 'Jodapro - Everywhere, Assistants, Norway.md',
  },
  {
    title: 'Palliasjon - Everywhere, Assistants, Norway',
    file: 'Palliasjon - Everywhere, Assistants, Norway.md',
  },
  {
    title: 'Smertelindring - Everywhere, Assistants, Norway',
    file: 'Smertelindring - Everywhere, Assistants, Norway.md',
  },
  {
    title: 'NEWS - Institution, Assistants, Norway',
    file: 'NEWS - Institution, Assistants, Norway.md',
  }
];

function CourseListView() {
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursePromises = courses.map(async (course) => {
        const res = await fetch(`/${course.file}`);
        const text = await res.text();

        // Finn første bilde i markdown
        const match = text.match(/!\[\]\((.*?)\)/);
        const image = match ? match[1] : null;

        return {
          ...course,
          image,
        };
      });

      const courseList = await Promise.all(coursePromises);
      setCoursesData(courseList);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Kursene dine</h1>
        <div className="grid gap-4">
          {coursesData.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden flex items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/course/${encodeURIComponent(course.file)}`)}
            >
              {course.image && (
                <img src={course.image} alt={course.title} className="w-24 h-24 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseListView;