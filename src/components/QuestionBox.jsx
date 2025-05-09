"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function QuestionBox({ question, onChange, isQuiz,name }) {
  const [showForm, setShowForm] = useState(false);

  const handleAddQuestion = () => {
    if (!question.text.trim() ||
      ((isQuiz ? question.correctAnswer === i : question.selectedAnswer === i || question[`selectedAnswer${questionIndex}`] === i)
      )) {
      return;
    }
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <button
        className="bg-[var(--bg-color-off-white)] text-blue-500 px-45 py-3 rounded-full mb-4"
        onClick={() => setShowForm(true)}
      >
        + Add Question
      </button>

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <input
            type="text"
            
            placeholder="Question Title"
            className="w-full mb-4 p-3 border text-gray-400 text-sm rounded-full"
            value={question.text}
            onChange={(e) => onChange('text', e.target.value)}
          />
          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center mb-2">
              <input
                type="radio"
                
                name={name}
                className="mr-2"
                checked={isQuiz ?
                  question.correctAnswer === i :
                  question.selectedAnswer === i}
                onChange={() => onChange(
                  isQuiz ? 'correctAnswer' : 'selectedAnswer',
                  i
                )}
              />
              <input
                type="text"
                placeholder={`Enter an answer choice`}
                className="w-full text-gray-400 text-sm p-2 border rounded-full"
                value={opt}
                onChange={(e) => onChange('options', e.target.value, i)}
              />
            </div>
          ))}
          <button
            className="bg-blue-600 text-white px-60 py-2 rounded-full mt-4"
            onClick={handleAddQuestion}
          >
            Add
          </button>
        </div>
      )}

      {/* Show added question */}
      {question.text && (
        <details className="mb-2 bg-white p-4 rounded-xl border-1">
          <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
            <span>{question.text}</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </summary>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            {question.options.map((opt, i) => (
              <li key={i} className="flex justify-between items-center pr-2">
                <span>{opt}</span>
                {(isQuiz ? question.correctAnswer === i : question.selectedAnswer === i || question[`selectedAnswer${questionIndex}`] === i) && (
                  <Check className="w-5 h-5 text-black-500" />
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}