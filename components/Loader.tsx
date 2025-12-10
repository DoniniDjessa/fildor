'use client';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="flex flex-col items-center gap-6">
        {/* Needle and Thread Animation */}
        <div className="relative">
          {/* Thread */}
          <svg
            className="w-24 h-24 animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#threadGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="10 5"
              className="animate-spin"
              style={{ animationDuration: '2s' }}
            />
            <defs>
              <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Needle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-rose-500 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L12 22M8 6L12 2L16 6M8 18L12 22L16 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h2 className="font-title text-lg font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
            Fil d&apos;Or
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 animate-pulse">
            Chargement...
          </p>
        </div>
      </div>
    </div>
  );
}

