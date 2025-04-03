// src/CourseViewer.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function CourseViewer() {
  const { filename } = useParams();
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/${filename}`)
      .then(res => res.text())
      .then(text => {
        console.log('📄 Rå markdown:', text);
        const lines = text.split('\n');

        const h1 = lines.find(line => line.startsWith('# '));
        setCourseTitle(h1 ? h1.replace('# ', '').trim() : '');

        const chapters = [];
        let currentChapter = null;
        let currentModule = null;

        lines.forEach(line => {
          if (line.startsWith('## ')) {
            if (currentModule && currentChapter) currentChapter.modules.push(currentModule);
            if (currentChapter) chapters.push(currentChapter);
            currentChapter = { title: line.replace('## ', '').trim(), modules: [] };
          } else if (line.startsWith('### ') && currentChapter) {
            if (currentModule) currentChapter.modules.push(currentModule);
            currentModule = { title: line.replace('### ', '').trim(), content: '' };
          } else if (currentModule) {
            currentModule.content += line + '\n';
          }
        });

        if (currentModule && currentChapter) currentChapter.modules.push(currentModule);
        if (currentChapter) chapters.push(currentChapter);
        console.log('📘 Parsed chapters:', chapters);
        setChapters(chapters);
      });
  }, [filename]);

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-blue-600 underline mb-4 block"
      >
        ← Tilbake til kurs
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-6">{courseTitle}</h1>

      {!selectedChapter && (
        <div className="grid gap-4">
          {chapters.map((chap, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedChapter(chap)}
            >
              <h2 className="text-lg font-semibold text-gray-800">{chap.title}</h2>
            </div>
          ))}
        </div>
      )}

      {selectedChapter && (
        <div>
          <button
            onClick={() => setSelectedChapter(null)}
            className="text-sm text-blue-600 underline mb-4 block"
          >
            ← Tilbake til kapitler
          </button>

          <h2 className="text-xl font-bold text-blue-700 mb-4">{selectedChapter.title}</h2>
          <div className="grid gap-4">
            {selectedChapter.modules.map((mod, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{mod.title}</h3>
                <ReactMarkdown>{mod.content}</ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseViewer;
