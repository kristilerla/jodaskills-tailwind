import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CourseListView() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const files = [
      { filename: "ASK-habilitering-i-institusjon.md", title: "ASK-habiliteringskurs i institusjon" },
      { filename: "helsekompetanse-og-livsstil.md", title: "Helsekompetanse og livsstil" },
      { filename: "psykiskhelse-og-utviklingshemming.md", title: "Psykisk helse og utviklingshemming" },
      { filename: "samarbeid-med-parorene-og-verge.md", title: "Samarbeid med pårørende og verge" },
      { filename: "seksuell-helse-og-utviklingshemming.md", title: "Seksuell helse og utviklingshemming" },
      { filename: "utviklingshemming-i-institusjon.md", title: "Utviklingshemming i institusjon" },
      { filename: "veileder-for-arbeid-med-utviklingshemming.md", title: "Veileder for arbeid med utviklingshemming" },


    ];

    const fetchCourses = async () => {
      const coursePromises = files.map(async (file) => {
        const res = await fetch(`/${file.filename}`);
        const text = await res.text();

        const metadataMatch = text.match(/"image":\s*"([^"]+)"/);
        let image = metadataMatch ? metadataMatch[1] : null;

        if (!image) {
          const fallbackMatch = text.match(/!\[\]\((.*?)\)/);
          image = fallbackMatch ? fallbackMatch[1] : null;
        }

        return {
          ...file,
          image,
        };
      });

      const courseList = await Promise.all(coursePromises);

      const progressData = JSON.parse(
        localStorage.getItem("courseProgress") || "{}"
      );
      const withProgress = courseList.map((course) => {
        const progress = progressData[course.filename];
        return {
          ...course,
          progress,
        };
      });

      setCourses(withProgress);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#E1F5FE] font-sans">
      <div className="bg-white py-4 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-center text-black">
          Jodaskills
        </h1>
      </div>

      <div className="p-4 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="grid gap-4 mt-4">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-between cursor-pointer hover:shadow-lg transition px-4 py-3"
                onClick={() =>
                  navigate(`/course/${encodeURIComponent(course.filename)}`)
                }
              >
                <div className="flex items-center">
                  {course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 font-serif">
                      {course.title}
                    </h2>
                  </div>
                </div>
                {course.progress && (
                  <div className="w-10 h-10 flex items-center justify-center">
                    {course.progress.progress === course.progress.total ? (
                      <div className="text-[#679EAD] text-2xl font-bold">✔</div>
                    ) : (
                      <svg className="w-full h-full">
                        <g transform="rotate(-90 20 20)">
                          <circle
                            className="text-gray-200"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="18"
                            cx="20"
                            cy="20"
                          />
                          <circle
                            className="text-[#78002e] transition-all duration-700"
                            strokeWidth="3"
                            strokeDasharray="113"
                            strokeDashoffset={`$ {
                              113 - (course.progress.progress / course.progress.total) * 113
                            }`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="18"
                            cx="20"
                            cy="20"
                          />
                        </g>
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dy=".3em"
                          className="fill-[#78002e] text-[10px] font-bold"
                        >
                          {Math.round(
                            (course.progress.progress / course.progress.total) *
                              100
                          )}
                          %
                        </text>
                      </svg>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseListView;
