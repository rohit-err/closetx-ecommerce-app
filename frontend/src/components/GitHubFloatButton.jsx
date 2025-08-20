
const GitHubFloatButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 group">
      <a
        href="https://github.com/rohit-err"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg
                   hover:rotate-[360deg] hover:scale-110
                   transition-transform duration-500 ease-in-out relative"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt="GitHub"
          className="w-8 h-8 invert"
        />
      </a>

      {/* Tooltip */}
      <span
        className="absolute right-16 top-1/2 -translate-y-1/2
                   bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md"
      >
        🚀 Explore My GitHub
      </span>
    </div>
  );
};

export default GitHubFloatButton;

