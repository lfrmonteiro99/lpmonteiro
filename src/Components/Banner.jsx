import BannerPhraseSwapper from "./BannerPhraseSwapper";
import BannerIntroductionText from "./BannerIntroductionText";
import React from "react";

export default function Banner() {
  const canvasRef = React.useRef(null);
  const glassRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    canvas.addEventListener("mousemove", (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 5 + 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.speedY = -Math.random() * -1;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.7 + 0.3;
      }

      getRandomColor() {
        const colors = [
          "rgba(96, 165, 250, ",
          "rgba(147, 197, 253, ",
          "rgba(59, 130, 246, ",
          "rgba(219, 234, 254, ",
          "rgba(191, 219, 254, ",
          "rgba(220, 38, 38, ",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Mouse repulsion
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;

            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
          }
        }

        // Upward movement
        this.y += this.speedY;
        if (this.y < -10) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 10;
          this.baseX = this.x;
          this.baseY = this.y;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = Array(150)
      .fill()
      .map(() => new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", null);
    };
  }, []);

  React.useEffect(() => {
    const glassCanvas = glassRef.current;
    if (!glassCanvas) return;
    const glassCtx = glassCanvas.getContext("2d");

    glassCanvas.width = window.innerWidth;
    glassCanvas.height = window.innerHeight;

    let shards = [];
    let pointer = {
      x: null,
      y: null,
      radius: 80,
    };

    // Track if animation is active
    let isAnimating = false;
    // Animation duration in milliseconds
    const animationDuration = 1500;

    class GlassShard {
      constructor(angle, distance, clickX, clickY) {
        this.angle = angle;
        this.distance = distance;
        this.x = clickX;
        this.y = clickY;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;

        // Reduce velocity for slower movement (reduce these values)
        this.velocityX = Math.cos(angle) * (Math.random() * 1.5 + 0.8); // Reduced from 3+2
        this.velocityY = Math.sin(angle) * (Math.random() * 1.5 + 0.8); // Reduced from 3+2

        // Reduce decay rate for slower fade out
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01; // Reduced from 0.05+0.02
      }

      update() {
        // Move shard away from click point
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Reduce friction for slower deceleration
        this.velocityX *= 0.99; // Changed from 0.98 (less friction)
        this.velocityY *= 0.99; // Changed from 0.98 (less friction)

        // Reduce life (for fade out)
        this.life -= this.decay;

        // Return true if shard is still alive
        return this.life > 0;
      }

      draw() {
        glassCtx.save();
        glassCtx.translate(this.x, this.y);
        glassCtx.rotate(this.rotation);
        glassCtx.beginPath();
        glassCtx.moveTo(0, 0);
        glassCtx.lineTo(this.size, this.size);
        glassCtx.lineTo(-this.size, this.size);
        glassCtx.closePath();
        glassCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity * this.life})`;
        glassCtx.fill();
        glassCtx.restore();
      }
    }

    function createShards(x, y) {
      // Clear existing shards
      shards = [];

      // Create new shards at click position
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * pointer.radius;
        shards.push(new GlassShard(angle, distance, x, y));
      }

      // Start animation if not already running
      if (!isAnimating) {
        isAnimating = true;
        animate();
      }
      function animate() {
        glassCtx.clearRect(0, 0, glassCanvas.width, glassCanvas.height);

        // Update and filter out dead shards
        shards = shards.filter((shard) => {
          const isAlive = shard.update();
          if (isAlive) {
            shard.draw();
          }
          return isAlive;
        });

        // Continue animation if there are still shards
        if (shards.length > 0) {
          requestAnimationFrame(animate);
        } else {
          isAnimating = false;
        }
      }

      // Handle click event
      const handleClick = (event) => {
        createShards(event.clientX, event.clientY);
      };

      window.addEventListener("click", handleClick);

      window.addEventListener("resize", () => {
        glassCanvas.width = window.innerWidth;
        glassCanvas.height = window.innerHeight;
      });

      return () => {
        window.removeEventListener("click", handleClick);
        window.removeEventListener("resize", null);
      };

      // Rest of the class remains the same
    }

    function createShards(x, y) {
      // Clear existing shards
      shards = [];

      // Create new shards at click position
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * pointer.radius;
        shards.push(new GlassShard(angle, distance, x, y));
      }

      // Start animation if not already running
      if (!isAnimating) {
        isAnimating = true;
        animate();
      }
    }

    function animate() {
      glassCtx.clearRect(0, 0, glassCanvas.width, glassCanvas.height);

      // Update and filter out dead shards
      shards = shards.filter((shard) => {
        const isAlive = shard.update();
        if (isAlive) {
          shard.draw();
        }
        return isAlive;
      });

      // Continue animation if there are still shards
      if (shards.length > 0) {
        requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    }

    // Handle click event
    const handleClick = (event) => {
      createShards(event.clientX, event.clientY);
    };

    window.addEventListener("click", handleClick);

    window.addEventListener("resize", () => {
      glassCanvas.width = window.innerWidth;
      glassCanvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", null);
    };
  }, []);

  return (
    <section
      id="home"
      className="flex items-center h-screen bg-[rgb(22 24 22/1)]"
    >
      <canvas
        ref={glassRef}
        className="absolute top-0 left-0 w-full h-full z-10"
      ></canvas>
      <div className="flex flex-col justify-center items-center z-20">
        <div className="text-center">
          <BannerPhraseSwapper />
          <BannerIntroductionText />
          {/* <div className="sm:flex block justify-center mt-5">
            <div className="px-4">
              <a
                href="/lpmonteiro/cv_latest.pdf"
                className="transition text-center flex w-full justify-center text-center group duration-200 px-6 py-3 cursor-pointer w-full rounded-full mr-4 bg-transparent hover:bg-gradient-to-br hover:from-blue-400 hover:to-red-600 bg-slate-200 text-white hover:text-white hover:opacity-80transition text-center flex justify-center text-center group duration-200 px-6 py-3 cursor-pointer sm:w-fit rounded-full mr-4 bg-slate-200 opacity-80"
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
          </div> */}
        </div>
      </div>
      <div className="absolute w-full bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-transparent to-transparent z-30">
        <div
          id=":R4afcq:"
          className="w-full h-[30vh] [mask-image:linear-gradient(to_top,#000000,#00000000)]"
        >
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-10"
          />
        </div>
      </div>
      <div className="absolute bottom-0 animate-bounce left-1/2 transform -translate-x-1/2 mb-8 z-20">
        <span className="flex text-white" aria-label="Scroll down indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevrons-down"
          >
            <path d="m7 6 5 5 5-5"></path>
            <path d="m7 13 5 5 5-5"></path>
          </svg>
          scroll down
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevrons-down"
          >
            <path d="m7 6 5 5 5-5"></path>
            <path d="m7 13 5 5 5-5"></path>
          </svg>
        </span>
      </div>
    </section>
  );
}
