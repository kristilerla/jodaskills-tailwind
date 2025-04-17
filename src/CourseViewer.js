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

        // Flat struktur
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

  return (
    <div className="min-h-screen bg-blue-50 p-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl">
        {currentIndex !== null ? (
          <button
            onClick={() => setCurrentIndex(null)}
            className="text-gray-700 hover:text-gray-900 font-semibold text-lg mb-4 flex items-center gap-1"
          >
            ←
          </button>
        ) : (
          <button
            onClick={() => window.history.back()}
            className="text-gray-700 hover:text-gray-900 font-semibold text-lg mb-4 flex items-center gap-1"
          >
            ←
          </button>
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
            <div className="flex items-center justify-between mb-2">
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="text-gray-600 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 font-medium transition"
                >
                  ← Tilbake
                </button>
              )}
              <span className="text-sm text-gray-600 ml-auto">
                {currentIndex + 1} av {flatModules.length}
              </span>
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

            {currentIndex < flatModules.length - 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="bg-purple-900 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-800 transition"
                >
                  Neste →
                </button>

                <div
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="mt-6 bg-orange-100 text-orange-700 px-4 py-3 rounded-xl cursor-pointer hover:bg-orange-200 transition text-center font-semibold"
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
