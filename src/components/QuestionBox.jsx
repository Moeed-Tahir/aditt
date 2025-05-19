"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import AlertBox from "./AlertBox";

function QuestionBox({ question, onChange, isQuiz, name, buttonLabel }) {
  const [isExpanded, setIsExpanded] = useState(!question.text);

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onChange({ ...question, options: newOptions });
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isQuiz) {
      onChange({ ...question, correctAnswer: answerIndex });
    } else {
      onChange({ ...question, selectedAnswer: answerIndex });
    }
  };

  const [alert, setAlert] = useState({
    message: "",
    type: "", // 'success' | 'error' | 'info' | 'warning'
    visible: false,
  });

  const validateQuestion = () => {
    if (!question.text || !question.text.trim()) {
      setAlert({
        message: "Please enter a question title",
        type: "error",
        visible: true,
      });
      return false;
    }

    const emptyOptions = question.options.filter(opt => !opt.trim());
    if (emptyOptions.length > 0) {
      setAlert({
        message: "Please fill in all answer options",
        type: "error",
        visible: true,
      });
      return false;
    }

    if (isQuiz && (question.correctAnswer === null || question.correctAnswer === undefined)) {
      setAlert({
        message: "Please select the correct answer for the quiz question",
        type: "error",
        visible: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateQuestion()) {
      setIsExpanded(false);
    } else {
      setTimeout(() => {
        setAlert(prev => ({ ...prev, visible: false }));
      }, 4000);
    }
  };

  return (
    <div className="w-full p-2 md:p-4">
      <div className="bg-white p-3 md:p-4 rounded-[16px] border-1 mb-2 w-full">
        {isExpanded && (
          <>
            <p className="text-[14px] font-md">Question Title</p>
            <input
              type="text"
              placeholder="Question Title"
              className="w-full mb-3 p-3 border text-gray-600 text-sm rounded-full"
              value={question.text}
              onChange={(e) => onChange({ ...question, text: e.target.value })}
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
                  <input
                    type="radio"
                    name={`question-${name}`}
                    className="flex-shrink-0"
                    checked={isQuiz 
                      ? question.correctAnswer === i 
                      : question.selectedAnswer === i}
                    onChange={() => handleAnswerSelect(i)}
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
              className="bg-blue-600 text-white w-full px-6 py-3 rounded-full mt-4 text-sm md:text-base"
              onClick={handleSubmit}
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
            <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center w-full">
              <span className="truncate mr-2">{question.text}</span>
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
                  <span className="truncate mr-2">{opt}</span>
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

export default function QuestionManager({ question, onChange, isQuiz, name, buttonLabel }) {
  const [hasQuestion, setHasQuestion] = useState(!!question.text);

  const handleAddQuestion = () => {
    setHasQuestion(true);
    onChange({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      selectedAnswer: null,
    });
  };

  const handleQuestionChange = (updatedQuestion) => {
    onChange(updatedQuestion);
  };

  return (
    <div className="w-full px-2 md:px-4">
      {!hasQuestion && (
        <button
          className="bg-[var(--bg-color-off-white)] w-full text-blue-500 px-6 py-4 rounded-full mt-2 text-sm md:text-base"
          onClick={handleAddQuestion}
        >
          {buttonLabel ||
            (isQuiz ? "+ Add Quiz Question" : "+ Add Survey Question")}
        </button>
      )}
      {hasQuestion && (
        <QuestionBox
          question={question}
          name={name}
          isQuiz={isQuiz}
          onChange={handleQuestionChange}
          buttonLabel={buttonLabel}
        />
      )}
    </div>
  );
}