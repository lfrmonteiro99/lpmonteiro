import React from "react";

export default function Skills() {
  return (
    <section id="skills" className="sm:min-h-screen sm:mx-auto pt-25">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">{`<Skills />`}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="rounded-lg border text-card-foreground shadow-sm group relative overflow-hidden bg-gray-900/80 backdrop-blur-sm bg-white/30 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>
          <div className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#63E6BE"
                  d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"
                />
              </svg>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Backend Development
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#4f5b93"
                      d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
                    />
                  </svg>
                </span>
                <span className="font-medium">PHP</span>
              </div>
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#4f5b93"
                      d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
                    />
                  </svg>
                </span>
                <span className="font-medium">Laravel</span>
              </div>
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#4f5b93"
                      d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
                    />
                  </svg>
                </span>
                <span className="font-medium">Symfony</span>
              </div>
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#4f5b93"
                      d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
                    />
                  </svg>
                </span>
                <span className="font-medium">MySQL</span>
              </div>
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#4f5b93"
                      d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
                    />
                  </svg>
                </span>
                <span className="font-medium">PostgresSQL</span>
              </div>
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="#4f5b93"
                      d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"
                    />
                  </svg>
                </span>
                <span className="font-medium">MariaDB</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border text-card-foreground shadow-sm group relative overflow-hidden bg-gray-900/80 backdrop-blur-sm bg-white/30 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>
          <div className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=""
                width="24px"
                viewBox="0 0 640 512"
              >
                <path
                  fill="#74C0FC"
                  d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"
                />
              </svg>
              <h3 className="sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Frontend Development
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border sm:w-fit w-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#FFD43B"
                      d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"
                    />
                  </svg>
                </span>
                <span className="font-medium">Javascript</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border text-card-foreground shadow-sm group relative overflow-hidden bg-gray-900/80 backdrop-blur-sm bg-white/30 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>
          <div className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=""
                width="24px"
                viewBox="0 0 640 512"
              >
                <path
                  fill="#f99b2f"
                  d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"
                />
              </svg>
              <h3 className="sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Cloud & DevOps
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border text-xs sm:w-fit w-full font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#FFD43B"
                      d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"
                    />
                  </svg>
                </span>
                <span className="font-medium">Docker</span>
              </div>
              <div className="rounded-full border text-xs sm:w-fit w-full font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#FFD43B"
                      d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"
                    />
                  </svg>
                </span>
                <span className="font-medium">GIT</span>
              </div>
              <div className="rounded-full border text-xs sm:w-fit w-full font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#FFD43B"
                      d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"
                    />
                  </svg>
                </span>
                <span className="font-medium">Linux</span>
              </div>
              <div className="rounded-full border text-xs sm:w-fit w-full font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#FFD43B"
                      d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"
                    />
                  </svg>
                </span>
                <span className="font-medium">CI/CD</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border text-card-foreground shadow-sm group relative overflow-hidden bg-gray-900/80 backdrop-blur-sm bg-white/30 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>
          <div className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#ea8ae2"
                  d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm192 32l-192 0 0 192 192 0 0-192z"
                />
              </svg>
              <h3 className="sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Tools & Technology
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full sm:w-fit w-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                  <svg
                    className="hover:scale-125 transition-all ease-in-out duration-100 w-4 h-4 text-[#E34F26]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="36px"
                    width="36px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#FFD43B"
                      d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"
                    />
                  </svg>
                </span>
                <span className="font-medium">Javascript</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
