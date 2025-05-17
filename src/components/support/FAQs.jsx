import ExpandableBars from "./ExpandableBars";

function FAQs() {
  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[24px] md:p-[40px] p-4 relative">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-[130px] justify-between">
        <div className="w-full md:w-1/3">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Frequently Asked Questions
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            Find answers to common questions about using our platform.
          </p>
        </div>
        <div className="w-full">
          <ExpandableBars />
        </div>
      </div>
    </div>
  );
}

export default FAQs;
