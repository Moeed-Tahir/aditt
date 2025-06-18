import ProgressBar from "@/components/ProgressBar";

export const AdsSurveyDetails = ({
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

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl">
      <h2 className="text-[16px] sm:text-[18px] font-md text-gray-800 mb-4">
        Survey details
      </h2>

      {surveyQuestion1 && surveyQuestion1?.questionText && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between text-[14px] sm:text-[16px] text-gray-500 mb-1 gap-2 sm:gap-0">
            <span>SURVEY QUESTION 1</span>
            <span className="font-bold text-lg sm:text-xl text-gray-700">
              {engagements?.totalCount} Responses
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-color-off-white)]">
            <span className="text-[14px] sm:text-[16px] text-gray-800">
              {surveyQuestion1?.questionText}
            </span>
            {surveyQuestion1?.option1 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion1?.option1?.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion1?.option1,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {surveyQuestion1?.option2 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion1?.option2?.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion1?.option2,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {surveyQuestion1.option3 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion1.option3.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion1.option3,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {surveyQuestion1.option4 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion1.option4.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion1.option4,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {/* Other options... */}
          </div>
        </div>
      )}

      {surveyQuestion2 && surveyQuestion2.questionText && (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-[13px] sm:text-[16px] text-gray-500 mb-1 gap-2 sm:gap-0">
            <span>SURVEY QUESTION 2</span>
            <span className="font-bold text-lg sm:text-xl text-gray-700">
              {engagements?.totalCount} Responses
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-color-off-white)]">
            <span className="text-[14px] sm:text-[16px] text-gray-800">
              {surveyQuestion2.questionText}
            </span>
            {surveyQuestion2.option1 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion2.option1.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion2.option1,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {surveyQuestion2.option2 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion2.option2.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion2.option2,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {surveyQuestion2.option3 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion2.option3.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion2.option3,
                    right: "0%",
                  }}
                />
              </div>
            )}
            {surveyQuestion2.option4 && (
              <div className="p-1 relative">
                <ProgressBar
                  value={surveyQuestion2.option4.totalCount}
                  fill="bg-white rounded-xl"
                  text={{
                    left: surveyQuestion2.option4,
                    right: "0%",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
