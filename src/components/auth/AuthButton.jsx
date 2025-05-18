// components/SigninButton.jsx
const AuthButton = ({ loading, text }) => (
  <button
    type="submit"
    disabled={loading}
    className={`mt-4 w-full py-4 px-6 rounded-[58px] text-white font-semibold cursor-pointer flex items-center justify-center gap-2 ${
      loading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {loading ? (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    ) : (
      <span>{text}</span>
    )}
  </button>
);

export default AuthButton;
