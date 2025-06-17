// components/campaign/QuizDetails.jsx
import BarCharts from "@/components/BarCharts";

export const QuizDetails = ({ quizQuestion, genderRatio }) => {
  if (!quizQuestion || !quizQuestion.questionText) return null;

  return (
    <div className="bg-white p-6 rounded-xl">
      <h2 className="text-[18px] font-md text-gray-800 mb-4">Quiz details</h2>

      <div className="mb-20">
        <h3 className="text-gray-500 text-[16px] mb-2">QUIZ INFO</h3>
        <div className="bg-[var(--bg-color-off-white)] p-10 rounded-xl">
          <p className="text-gray-700 mb-4 text-[16px]">
            {quizQuestion.questionText}
          </p>
          <hr className="border-t border-gray-300" />

          <ul className="py-2 text-[16px] text-gray-600 space-y-1">
            {quizQuestion.option1 && (
              <li className="py-[12px]">
                A. {quizQuestion.option1}
                <span className="float-right">0%</span>
              </li>
            )}
            {quizQuestion.option2 && (
              <li className="py-[12px]">
                B. {quizQuestion.option2}
                <span className="float-right">0%</span>
              </li>
            )}
            {quizQuestion.option3 && (
              <li className="py-[12px]">
                C. {quizQuestion.option3}
                <span className="float-right">0%</span>
              </li>
            )}
            {quizQuestion.option4 && (
              <li className="py-[12px]">
                D. {quizQuestion.option4}
                <span className="float-right">0%</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <BarCharts genderRatio={genderRatio} />

        <div className="grid grid-cols-1 sm:grid-cols-3 ml-4 sm:ml-20 text-sm text-gray-600 w-full max-w-md">
          <div className="mb-2 sm:mb-0">
            <span className="w-3 h-3 rounded-full bg-[#3653F7] inline-block mr-2" />{" "}
            Male ({genderRatio}%)
          </div>
          <div className="mb-2 sm:mb-0">
            <span className="w-3 h-3 rounded-full bg-[#E670C7] inline-block mr-2" />
            Female (0%)
          </div>
          <div>
            <span className="w-3 h-3 rounded-full bg-[#15B79E] inline-block mr-2" />{" "}
            Prefer Not to Say (0%)
          </div>
        </div>
      </div>
    </div>
  );
};
