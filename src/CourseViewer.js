import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function CourseViewer() {
  const { filename } = useParams();
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/${filename}`)
      .then(res => res.text())
      .then(text => {
        const lines = text.split(/\r?\n/);

        const chapters = [];
        let courseTitle = '';
        let currentChapter = null;
        let currentModule = null;

            // Prøv å hente bilde fra metadata først
    const metadataMatch = text.match(/"image":\s*"([^"]+)"/);
    let firstImage = metadataMatch ? metadataMatch[1] : null;

    // Hvis ingen metadata-bilde, bruk første ![]()-bilde
    if (!firstImage) {
      const fallbackMatch = text.match(/!\[\]\((.*?)\)/);
      firstImage = fallbackMatch ? fallbackMatch[1] : null;
    }

    setImage(firstImage);

        for (let line of lines) {
          if (line.startsWith('# ')) {
            courseTitle = line.replace('# ', '').trim();
          } else if (line.startsWith('## ')) {
            if (currentModule && currentChapter) currentChapter.modules.push(currentModule);
            if (currentChapter) chapters.push(currentChapter);
            currentChapter = { title: line.replace('## ', '').trim(), modules: [] };
            currentModule = null;
          } else if (line.startsWith('### ')) {
            if (currentModule && currentChapter) currentChapter.modules.push(currentModule);
            currentModule = { title: line.replace('### ', '').trim(), content: '' };
          } else if (currentModule) {
            currentModule.content += line + '\n';
          }
        }

        if (currentModule && currentChapter) currentChapter.modules.push(currentModule);
        if (currentChapter) chapters.push(currentChapter);

        setCourseTitle(courseTitle);
        setChapters(chapters);
      });
  }, [filename]);

  const handleNextModule = () => {
    if (selectedChapter && selectedModuleIndex !== null) {
      const nextIndex = selectedModuleIndex + 1;
      if (nextIndex < selectedChapter.modules.length) {
        setSelectedModuleIndex(nextIndex);
      } else {
        setSelectedModuleIndex(null);
        setSelectedChapter(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 font-sans flex justify-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate('/')}
          className="bg-purple-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-800 transition mb-4"
        >
          ← Tilbake til kurs
        </button>

        {image && !selectedChapter && (
          <img
            src={image}
            alt={courseTitle}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        )}

        <h1 className="text-2xl font-bold text-blue-700 mb-6 font-serif">
          {courseTitle}
        </h1>

        {!selectedChapter && (
          <div className="grid gap-4">
            {chapters.map((chap, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  setSelectedChapter(chap);
                  setSelectedModuleIndex(0);
                }}
              >
                <h2 className="text-lg font-semibold text-gray-800 font-serif">
                  {chap.title}
                </h2>
              </div>
            ))}
          </div>
        )}

        {selectedChapter && selectedModuleIndex !== null && (
          <div>
            <button
              onClick={() => {
                setSelectedModuleIndex(null);
                setSelectedChapter(null);
              }}
              className="bg-purple-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-800 transition mb-4"
            >
              ← Tilbake til kapitler
            </button>

            <h2 className="text-xl font-bold text-blue-700 mb-4 font-serif">
              {selectedChapter.title}
            </h2>

            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 font-serif">
                {selectedChapter.modules[selectedModuleIndex].title}
              </h3>
              <div className="prose prose-sm max-w-none font-sans space-y-4">
                <ReactMarkdown>
                  {selectedChapter.modules[selectedModuleIndex].content}
                </ReactMarkdown>
              </div>
            </div>

            {selectedModuleIndex < selectedChapter.modules.length - 1 && (
              <button
                onClick={handleNextModule}
                className="bg-purple-900 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-800 transition"
              >
                Neste →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseViewer;