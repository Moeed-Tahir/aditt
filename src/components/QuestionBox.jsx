"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

function QuestionBox({ question, onChange, isQuiz, name, index }) {
  const [isExpanded, setIsExpanded] = useState(!question.text);

  const handleOptionChange = (optionIndex, value) => {
    onChange(index, "options", value, optionIndex);
  };

  const handleAnswerSelect = (answerIndex) => {
    onChange(index, isQuiz ? "correctAnswer" : "selectedAnswer", answerIndex);
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-[16px] border-1 mb-2">
        {isExpanded && (
          <>
            <p className="text-[14px] font-md">Question Title</p>
            <input
              type="text"
              placeholder="Question Title"
              className="w-full mb-4 p-3 border text-gray-600 text-sm rounded-full"
              value={question.text}
              onChange={(e) => onChange(index, "text", e.target.value)}
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
                    name={`question-${name}`}
                    className="mr-2"
                    checked={
                      isQuiz
                        ? question.correctAnswer === i
                        : question.selectedAnswer === i
                    }
                    onChange={() => handleAnswerSelect(i)}
                  />
                  <input
                    type="text"
                    placeholder={`Enter an answer choice`}
                    className="w-full text-gray-600 bg-white text-sm p-4 border rounded-full"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              className="bg-blue-600 text-white w-full px-6 py-2 rounded-full mt-4"
              onClick={() => {
                if (
                  !question.text.trim() ||
                  question.options.some((opt) => !opt.trim())
                ) {
                  alert("Please fill in the question and all answer options");
                  return;
                }
                if (isQuiz && question.correctAnswer === null) {
                  alert(
                    "Please select the correct answer for the quiz question"
                  );
                  return;
                }
                if (!isQuiz && question.selectedAnswer === null) {
                  alert("Please select an answer for the survey question");
                  return;
                }
                setIsExpanded(false);
              }}
            >
              {question.text ? "Update Question" : "Add Question"}
            </button>
          </>
        )}

        {!isExpanded && question.text && (
          <details className="bg-white rounded-xl" open={false}>
            <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
              <span>{question.text}</span>
              <ChevronDown
                className="w-5 h-5 text-gray-500"
                onClick={() => setIsExpanded(true)}
              />
            </summary>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              {question.options.map((opt, i) => (
                <li
                  key={i}
                  className="flex justify-between text-[16px] items-center pr-2"
                >
                  <span>{opt}</span>
                  {(isQuiz
                    ? question.correctAnswer === i
                    : question.selectedAnswer === i) && (
                    <Check className="w-5 h-5" />
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}

// Parent Component managing all questions
export default function QuestionManager({ isQuiz = true }) {
  const [questions, setQuestions] = useState([]);

  const handleChange = (index, field, value, optionIndex = null) => {
    const updated = [...questions];
    if (field === "options") {
      updated[index].options[optionIndex] = value;
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        selectedAnswer: null,
      },
    ]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        className="bg-[var(--bg-color-off-white)] w-full text-blue-500 px-6 py-4 rounded-full mt-4"
        onClick={handleAddQuestion}
      >
        + Add Question
      </button>
      {questions.map((q, i) => (
        <QuestionBox
          key={i}
          index={i}
          question={q}
          name={`q-${i}`}
          isQuiz={isQuiz}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}
