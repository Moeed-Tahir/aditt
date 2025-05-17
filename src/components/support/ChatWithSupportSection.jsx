import Link from "next/link";

function ChatWithSupportSection({ userId }) {
  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[24px] md:p-[40px] p-4 relative">
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-[130px] justify-between">
        <div className="w-full">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Still Have Questions?
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            Chat with us for quick support and answers to your questions.
          </p>
        </div>
        <div className="w-full flex items-center md:justify-end justify-start">
          <Link
            href={`/${userId}/chat-support`}
            className="bg-blue-600 text-white md:text-[16px] md:leading-6 text-[14px] leading-4 px-8 py-4 rounded-[80px] hover:bg-blue-700"
          >
            Chat with Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChatWithSupportSection;
