import { BiCaretDown } from "react-icons/bi";

const SignInButton = () => {
  return (
    <div className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
      <button
        type="button"
        className="text-left text-white font-semibold md:text-gray-100 md:font-normal"
      >
        Hello, sign in
      </button>
      <button
        type="button"
        className="text-white font-bold hidden md:flex items-center"
      >
        Account & Lists
        <span>
          <BiCaretDown />
        </span>
      </button>
    </div>
  );
};

export default SignInButton;
