"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import AlertBox from "./AlertBox";

function QuestionBox({ question, onChange, isQuiz, name, index, buttonLabel }) {
  const [isExpanded, setIsExpanded] = useState(!question.text);

  const handleOptionChange = (optionIndex, value) => {
    onChange(index, "options", value, optionIndex);
  };

  const handleAnswerSelect = (answerIndex) => {
    onChange(index, isQuiz ? "correctAnswer" : "selectedAnswer", answerIndex);
  };

  const [alert, setAlert] = useState({
    message: "",
    type: "", // 'success' | 'error' | 'info' | 'warning'
    visible: false,
  });

  return (
    <div className="w-full p-2 md:p-4">
      {" "}
      {/* Changed padding for mobile */}
      <div className="bg-white p-3 md:p-4 rounded-[16px] border-1 mb-2 w-full">
        {" "}
        {/* Full width */}
        {isExpanded && (
          <>
            <p className="text-[14px] font-md">Question Title</p>
            <input
              type="text"
              placeholder="Question Title"
              className="w-full mb-3 p-3 border text-gray-600 text-sm rounded-full"
              value={question.text}
              onChange={(e) => onChange(index, "text", e.target.value)}
            />
            <p className="text-[14px]">Question Answer</p>

            <div className="bg-[var(--bg-color-off-white)] rounded-[16px] p-3 mt-2">
              <p className="text-[14px] mb-2">
                {isQuiz
                  ? "Click to select the correct answer"
                  : "Answer options"}
              </p>
              {question.options.map((opt, i) => (
                <div key={i} className="flex items-center mb-2 gap-2">
                  {" "}
                  {/* Added gap */}
                  <input
                    type={isQuiz ? "radio" : "radio"}
                    name={`question-${name}`}
                    className="flex-shrink-0" /* Prevent squeezing */
                  />
                  <input
                    type="text"
                    placeholder={`Enter an answer choice`}
                    className="w-full text-gray-600 bg-white text-sm p-3 border rounded-full"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button
              className="bg-blue-600 text-white w-full px-6 py-3 rounded-full mt-4 text-sm md:text-base" /* Larger tap target */
              onClick={() => {
                if (
                  !question.text.trim() ||
                  question.options.some((opt) => !opt.trim())
                ) {
                  setAlert({
                    message:
                      "Please fill in the question and all answer options",
                    type: "error",
                    visible: true,
                  });
                  setTimeout(() => {
                    setAlert((prev) => ({ ...prev, visible: false }));
                  }, 4000);
                  return;
                }
                if (isQuiz && question.correctAnswer === null) {
                  setAlert({
                    message:
                      "Please select the correct answer for the quiz question",
                    type: "error",
                    visible: true,
                  });
                  setTimeout(() => {
                    setAlert((prev) => ({ ...prev, visible: false }));
                  }, 4000);
                  return;
                }
                setIsExpanded(false);
              }}
            >
              {buttonLabel ||
                (isQuiz ? "Add Quiz Question" : "Add Survey Question")}
            </button>
          </>
        )}
        {alert.visible && (
          <AlertBox message={alert.message} type={alert.type} />
        )}
        {!isExpanded && question.text && (
          <details className="bg-white rounded-xl w-full" open={false}>
            {" "}
            {/* Full width */}
            <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center w-full">
              <span className="truncate mr-2">{question.text}</span>{" "}
              {/* Truncate long text */}
              <ChevronDown
                className="w-5 h-5 text-gray-500 flex-shrink-0"
                onClick={() => setIsExpanded(true)}
              />
            </summary>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              {question.options.map((opt, i) => (
                <li
                  key={i}
                  className="flex justify-between text-[14px] items-center pr-2"
                >
                  <span className="truncate mr-2">{opt}</span>{" "}
                  {/* Truncate long options */}
                  {(isQuiz
                    ? question.correctAnswer === i
                    : question.selectedAnswer === i) && (
                    <Check className="w-4 h-4 flex-shrink-0" />
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

export default function QuestionManager({ isQuiz = true, buttonLabel }) {
  const [questions, setQuestions] = useState([]);
  const [hasQuestion, setHasQuestion] = useState(false);

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
    setHasQuestion(true);
  };

  return (
    <div className="w-full px-2 md:px-4">
      {" "}
      {/* Full width with small side padding */}
      {!hasQuestion && (
        <button
          className="bg-[var(--bg-color-off-white)] w-full text-blue-500 px-6 py-4 rounded-full mt-2 text-sm md:text-base" /* Larger tap target */
          onClick={handleAddQuestion}
        >
          {buttonLabel ||
            (isQuiz ? "+ Add Quiz Question" : "+ Add Survey Question")}
        </button>
      )}
      {questions.map((q, i) => (
        <QuestionBox
          key={i}
          index={i}
          question={q}
          name={`q-${i}`}
          isQuiz={isQuiz}
          onChange={handleChange}
          buttonLabel={buttonLabel}
        />
      ))}
    </div>
  );
}
