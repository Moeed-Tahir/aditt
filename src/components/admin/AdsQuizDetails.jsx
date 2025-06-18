export const AdsQuizDetails = ({ quizQuestion, genderRatio, genderType }) => {
  if (!quizQuestion || !quizQuestion.questionText) return null;

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[18px] font-md text-gray-800">Quiz details</h2>
        <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          Target: {genderType} ({genderRatio}%)
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-500 text-[16px] mb-2">QUIZ INFO</h3>
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="text-gray-700 mb-4 text-[16px] font-medium">
            {quizQuestion.questionText}
          </p>
          <hr className="border-t border-gray-200 mb-4" />

          <ul className="text-[16px] text-gray-600 space-y-3">
            {quizQuestion.option1 && (
              <li className="py-2 px-3 bg-white rounded-lg shadow-sm">
                <span className="font-medium">A.</span> {quizQuestion.option1}
                {quizQuestion.option1 === quizQuestion.answer && (
                  <span className="float-right text-green-500 font-medium">✓ Correct</span>
                )}
              </li>
            )}
            {quizQuestion.option2 && (
              <li className="py-2 px-3 bg-white rounded-lg shadow-sm">
                <span className="font-medium">B.</span> {quizQuestion.option2}
                {quizQuestion.option2 === quizQuestion.answer && (
                  <span className="float-right text-green-500 font-medium">✓ Correct</span>
                )}
              </li>
            )}
            {quizQuestion.option3 && (
              <li className="py-2 px-3 bg-white rounded-lg shadow-sm">
                <span className="font-medium">C.</span> {quizQuestion.option3}
                {quizQuestion.option3 === quizQuestion.answer && (
                  <span className="float-right text-green-500 font-medium">✓ Correct</span>
                )}
              </li>
            )}
            {quizQuestion.option4 && (
              <li className="py-2 px-3 bg-white rounded-lg shadow-sm">
                <span className="font-medium">D.</span> {quizQuestion.option4}
                {quizQuestion.option4 === quizQuestion.answer && (
                  <span className="float-right text-green-500 font-medium">✓ Correct</span>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Users will need to answer this quiz correctly to proceed with the campaign.</p>
      </div>
    </div>
  );
};