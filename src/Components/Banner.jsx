import BannerPhraseSwapper from "./BannerPhraseSwapper";
import BannerIntroductionText from "./BannerIntroductionText";

export default function Banner() {
  return (
    <section id="home" className="h-min-screen">
      <div className="flex flex-row justify-center h-screen z-20">
        <div className="col-span-8 gap-5 sm:place-self-center text-center justify-self-start">
          <BannerPhraseSwapper />
          <BannerIntroductionText />
          <div className="sm:flex block justify-center mt-5">
            <div className="">
              <a
                href="/src/assets/cv_latest.pdf"
                className="transition text-center flex w-full justify-center text-center group duration-200 px-6 py-3 cursor-pointer w-full rounded-full mr-4 bg-gradient-to-br from-blue-400 to-red-600 hover:bg-slate-200 text-white hover:opacity-80transition text-center flex justify-center text-center group duration-200 px-6 py-3 cursor-pointer sm:w-fit rounded-full mr-4 bg-gradient-to-br from-blue-400 to-red-600 hover:bg-slate-200 text-white hover:opacity-80"
              >
                Download CV
                <span className="ml-2">
                  <svg
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#e2e8f0"
                      d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <div className="sm:flex block item-center justify-center">
              <a
                href="#about"
                className="group px-6 py-3 w-full sm:w-fit rounded-full flex items-center justify-center transition duration-200 hover:bg-gray-50/10 text-white hover:bg-opacity-5"
              >
                {`Know more about me`}{" "}
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">{`->`}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
