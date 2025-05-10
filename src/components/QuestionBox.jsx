"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function QuestionBox({ isQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const addNewQuestion = () => {
    const newQuestion = {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      selectedAnswer: null,
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestionIndex(questions.length); // open the newly added question form
  };

  const updateQuestion = (index, key, value, optIndex) => {
    const updated = [...questions];
    if (key === "options") {
      updated[index].options[optIndex] = value;
    } else {
      updated[index][key] = value;
    }
    setQuestions(updated);
  };

  const submitQuestion = (index) => {
    const question = questions[index];

    if (!question.text.trim() || question.options.some((opt) => !opt.trim())) {
      alert("Please fill in the question and all answer options");
      return;
    }

    if (isQuiz && question.correctAnswer === null) {
      alert("Please select the correct answer for the quiz question");
      return;
    }

    if (!isQuiz && question.selectedAnswer === null) {
      alert("Please select an answer for the survey question");
      return;
    }

    setActiveQuestionIndex(null); // collapse the form
  };

  return (
    <div className="p-4">
      {activeQuestionIndex === null && (
        <button
          className="bg-[var(--bg-color-off-white)] w-full text-blue-500 px-6 py-3 rounded-full mb-4"
          onClick={addNewQuestion}
        >
          + Add Question
        </button>
      )}
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          {activeQuestionIndex === index ? (
            <div className="bg-white p-4 rounded shadow mb-2">
              <p className="text-[14px] font-md">Question Title</p>
              <input
                type="text"
                placeholder="Question Title"
                className="w-full mb-4 p-3 border text-gray-600 text-sm rounded-full"
                value={question.text}
                onChange={(e) =>
                  updateQuestion(index, "text", e.target.value)
                }
              />
              <p className="text-[14px]">Question Answer</p>

              <div className="bg-[var(--bg-color-off-white)] rounded-[16px] p-3">
                <p className="text-[14px]">
                  {isQuiz
                    ? "Click to select the correct answer"
                    : "Answer options"}
                </p>
                {question.options.map((opt, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <input
                      type={isQuiz ? "radio" : "checkbox"}
                      name={`question-${index}`}
                      className="mr-2"
                      checked={
                        isQuiz
                          ? question.correctAnswer === i
                          : question.selectedAnswer === i
                      }
                      onChange={() =>
                        updateQuestion(
                          index,
                          isQuiz ? "correctAnswer" : "selectedAnswer",
                          i
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder={`Enter an answer choice`}
                      className="w-full text-gray-600 bg-white text-sm p-2 border rounded-full"
                      value={opt}
                      onChange={(e) =>
                        updateQuestion(index, "options", e.target.value, i)
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                className="bg-blue-600 text-white w-full px-6 py-2 rounded-full mt-4"
                onClick={() => submitQuestion(index)}
              >
                Add Question
              </button>
            </div>
          ) : (
            question.text && (
              <details className="bg-white p-4 rounded-xl border-1" open>
                <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
                  <span>{question.text}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </summary>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  {question.options.map((opt, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center pr-2"
                    >
                      <span>{opt}</span>
                      {(isQuiz
                        ? question.correctAnswer === i
                        : question.selectedAnswer === i) && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )
          )}
        </div>
      ))}
      
    </div>
  );
}
