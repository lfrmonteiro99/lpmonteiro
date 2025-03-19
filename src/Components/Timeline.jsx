import { stacks } from "../Data/Stacks";

export default function Timeline() {
  return (
    <div className="relative px-4 py-16 hidden md:block">
      {/* Timeline container with line */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 right-0 top-24 h-0.5 bg-slate-700 " />

        <div className="flex flex-col md:flex-row md:justify-between">
          {stacks.map((stack, index) => (
            <div
              key={stack.year}
              className="relative md:flex-1 md:px-2 mb-10 md:mb-0"
            >
              {/* Dot on timeline */}
              <div
                className={`${stack.backgroundColor} w-4 h-4 rounded-full absolute md:left-1/2 md:-translate-x-1/2 md:top-24 md:-mt-[0.5rem] z-10`}
              />

              {/* Year */}
              <div
                className={`absolute md:top-10 md:left-1/2 md:-translate-x-1/2 ${stack.textColor} font-bold text-lg`}
              >
                {stack.year}
              </div>

              {/* Stack tags */}
              <div className="md:absolute md:top-32 md:left-1/2 md:-translate-x-1/2 md:w-full">
                <div className="flex flex-col gap-2 md:items-center">
                  {stack.stacks.map((stack) => (
                    <span
                      key={stack}
                      className={`px-3 py-1 rounded-full bg-slate-700 ${stack.textColor} text-sm text-center whitespace-nowrap`}
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
