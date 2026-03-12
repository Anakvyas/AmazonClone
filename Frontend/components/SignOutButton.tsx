import Image from "next/image";

const SignOutButton = () => {
  return (
    <div className="text-xs text-gray-100 flex gap-2 items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
      <Image
        src="https://placehold.co/80x80"
        alt="userImage"
        width={200}
        height={200}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p>Hello, User</p>
        <button type="button" className="text-white font-bold flex items-center">
          Log out
        </button>
      </div>
    </div>
  );
};

export default SignOutButton;
