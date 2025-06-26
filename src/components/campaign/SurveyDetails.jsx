import ProgressBar from "@/components/ProgressBar";

export const SurveyDetails = ({
  surveyQuestion1,
  surveyQuestion2,
  engagements,
}) => {
  if (
    (!surveyQuestion1 || !surveyQuestion1.questionText) &&
    (!surveyQuestion2 || !surveyQuestion2.questionText)
  ) {
    return null;
  }

  const getTotalResponses = (question) => {
    if (!question?.optionStats) return 0;
    return Object.values(question.optionStats).reduce(
      (sum, option) => sum + (option.totalCount || 0),
      0
    );
  };

  const getPercentage = (question, count) => {
    const total = getTotalResponses(question);
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };


  const renderQuestion = (question, title) => {
    if (!question?.questionText) return null;

    const totalResponses = engagements?.totalCount || getTotalResponses(question);

    return (
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between text-[14px] sm:text-[16px] text-gray-500 mb-1 gap-2 sm:gap-0">
          <span>{title}</span>
          <span className="font-bold text-lg sm:text-xl text-gray-700">
            {totalResponses} Response{totalResponses !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-color-off-white)]">
          <span className="text-[14px] sm:text-[16px] text-gray-800">
            {question.questionText}
          </span>

{['option1', 'option2', 'option3', 'option4'].map((optionKey) => {
  if (!question[optionKey]) return null;

  const count = question.optionStats?.[optionKey]?.totalCount || 0;
  const percentage = getPercentage(question, count); // already calculated here

  return (
    <div key={optionKey} className="p-1 relative">
      <ProgressBar
        value={percentage} // ✅ fixed line
        fill="bg-white rounded-xl"
        text={{
          left: question[optionKey],
          right: `${percentage}%`,
        }}
      />
    </div>
  );
})}

        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl">
      <h2 className="text-[16px] sm:text-[18px] font-md text-gray-800 mb-4">
        Survey details
      </h2>

      {renderQuestion(surveyQuestion1, "SURVEY QUESTION 1")}
      {renderQuestion(surveyQuestion2, "SURVEY QUESTION 2")}
    </div>
  );
};