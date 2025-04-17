// ✅ CourseViewer.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function CourseViewer() {
  const { filename } = useParams();

  const [courseTitle, setCourseTitle] = useState("");
  const [flatModules, setFlatModules] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`/${filename}`)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split(/\r?\n/);

        let courseTitle = "";
        const chapters = [];
        let currentChapter = null;
        let currentModule = null;

        const metadataMatch = text.match(/"image":\s*"([^"]+)"/);
        let firstImage = metadataMatch ? metadataMatch[1] : null;
        if (!firstImage) {
          const fallbackMatch = text.match(/!\[\]\((.*?)\)/);
          firstImage = fallbackMatch ? fallbackMatch[1] : null;
        }
        setImage(firstImage);

        for (let line of lines) {
          if (line.startsWith("# ")) {
            courseTitle = line.replace("# ", "").trim();
          } else if (line.startsWith("## ")) {
            if (currentModule && currentChapter)
              currentChapter.modules.push(currentModule);
            if (currentChapter) chapters.push(currentChapter);
            currentChapter = {
              title: line.replace("## ", "").trim(),
              modules: [],
            };
            currentModule = null;
          } else if (line.startsWith("### ")) {
            if (currentModule && currentChapter)
              currentChapter.modules.push(currentModule);
            currentModule = {
              title: line.replace("### ", "").trim(),
              content: "",
            };
          } else if (currentModule) {
            currentModule.content += line + "\n";
          }
        }

        if (currentModule && currentChapter)
          currentChapter.modules.push(currentModule);
        if (currentChapter) chapters.push(currentChapter);

        setCourseTitle(courseTitle);

        const flat = [];
        chapters.forEach((chap) => {
          chap.modules.forEach((mod) => {
            flat.push({
              chapterTitle: chap.title,
              title: mod.title,
              content: mod.content,
            });
          });
        });

        setFlatModules(flat);
      });
  }, [filename]);

  useEffect(() => {
    if (flatModules.length && currentIndex !== null) {
      const progressData = JSON.parse(
        localStorage.getItem("courseProgress") || "{}"
      );
      const isCompleted = currentIndex + 1 === flatModules.length;

      progressData[filename] = {
        progress: currentIndex + 1,
        total: flatModules.length,
        completed: isCompleted,
      };

      localStorage.setItem("courseProgress", JSON.stringify(progressData));
    }
  }, [currentIndex, flatModules, filename]);

  return (
    <div className="min-h-screen bg-blue-50 p-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl">
        {currentIndex !== null ? (
          <div
            onClick={() => setCurrentIndex(null)}
            className="text-[#78002e] text-xl font-bold cursor-pointer hover:opacity-80 transition mb-2"
          >
            ←
          </div>
        ) : (
          <div
            onClick={() => window.history.back()}
            className="text-[#78002e] text-xl font-bold cursor-pointer hover:opacity-80 transition mb-2"
          >
            ←
          </div>
        )}

        {image && currentIndex === null && (
          <img
            src={image}
            alt={courseTitle}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
          {courseTitle}
        </h1>

        {currentIndex === null && (
          <div className="grid gap-4 mt-4">
            {[...new Set(flatModules.map((mod) => mod.chapterTitle))].map(
              (chapter, i) => {
                const firstIndex = flatModules.findIndex(
                  (m) => m.chapterTitle === chapter
                );
                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition"
                    onClick={() => setCurrentIndex(firstIndex)}
                  >
                    <h2 className="text-lg font-semibold text-gray-800 font-serif">
                      {chapter}
                    </h2>
                  </div>
                );
              }
            )}
          </div>
        )}

        {currentIndex !== null && flatModules[currentIndex] && (
          <div className="mt-4">
            <div className="w-full mb-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold text-[#78002e]">
                  {flatModules[currentIndex].chapterTitle}
                </span>
                <span className="text-[#78002e]">
                  {currentIndex + 1} av {flatModules.length}
                </span>
              </div>
              <div className="w-full bg-[#FFEBEE] h-1 rounded-full">
                <div
                  className="bg-[#78002e] h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentIndex + 1) / flatModules.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-1 font-serif">
              {flatModules[currentIndex].chapterTitle}
            </h2>

            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 font-serif">
                {flatModules[currentIndex].title}
              </h3>
              <div className="prose prose-sm max-w-none font-sans space-y-4">
                <ReactMarkdown>
                  {flatModules[currentIndex].content}
                </ReactMarkdown>
              </div>
            </div>

            {currentIndex > 0 && (
              <div
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="text-[#78002e] text-xl font-bold cursor-pointer hover:opacity-80 transition mb-4"
              >
                ←
              </div>
            )}

            {currentIndex < flatModules.length - 1 && (
              <>
                <div
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="text-[#78002e] text-xl font-bold cursor-pointer hover:opacity-80 transition mb-4"
                >
                  →
                </div>

                <div
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="mt-6 bg-[#FFEBEE] text-[#78002e] px-4 py-3 rounded-xl cursor-pointer hover:bg-pink-100 transition text-center font-semibold"
                >
                  {flatModules[currentIndex + 1].title} ↓
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseViewer;
