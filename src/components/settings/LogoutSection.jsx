import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutSection() {
  const router = useRouter();

  const handleLogout = async () => {
    Cookies.remove("userId");
    Cookies.remove("token");
    router.push("/signin-user");
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[24px] md:p-[40px] p-4 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="w-full">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Logout
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            Logout from your account
          </p>
        </div>
        <div className="w-full flex items-center md:justify-end justify-start">
          <button
            className="bg-white text-[14px] md:text-[16px] flex justify-center items-center font-md text-[#FF4319] w-full md:w-[230px] h-[48px] md:h-[56px] rounded-full border-2 border-[#FF4319] hover:bg-[#FF4319] hover:text-white cursor-pointer"
            onClick={handleLogout}
          >
            Logout Account
          </button>
        </div>
      </div>
    </div>
  );
}
