gsap.registerPlugin(ScrollTrigger);
const sections = gsap.utils.toArray(".page-section");
const navIcons = document.querySelectorAll(".nav img");
const separatorLines = document.querySelectorAll(".separacao-icones");
gsap.set(navIcons[0], { opacity: 1 });
sections.forEach((section, index) => {
    if (navIcons[index]) {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                gsap.to(navIcons[index], { opacity: 1, duration: 0.3 });
            },
            onLeaveBack: () => {
                if (index > 0) {
                    gsap.to(navIcons[index], { opacity: 0.5, duration: 0.3 });
                }
            },
            id: `Icon-Activation-${index}`
        });
    }
    const separatorLine = separatorLines[index];
    
    if (separatorLine) {
        ScrollTrigger.create({
            trigger: sections[index + 1],
            start: "top bottom", 
            end: "top center",   
            scrub: true,         
            animation: gsap.to(separatorLine, { 
                opacity: 1, 
                ease: "none"
            }),
            id: `Line-Animation-${index}`
        });
        ScrollTrigger.create({
            trigger: section,
            end: "bottom center", 
            onLeaveBack: () => {
                gsap.to(separatorLine, { opacity: 0.5, duration: 0.3 });
            },
            id: `Line-Deactivation-${index}`
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
  const slides = document.querySelector(".slides");
  const slideItems = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  let currentIndex = 0;
  let startX = 0;
  let endX = 0;

  // Criar bolinhas
  slideItems.forEach((_, index) => {
    const dot = document.createElement("button");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("button");

  // Função para trocar slides
  function goToSlide(index) {
    currentIndex = index;
    slides.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // Swipe (arrastar com o dedo)
  slides.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slides.addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
  });

  slides.addEventListener("touchend", () => {
    if (startX - endX > 50) { // arrastar para esquerda
      currentIndex = (currentIndex + 1) % slideItems.length;
    } else if (endX - startX > 50) { // arrastar para direita
      currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
    }
    goToSlide(currentIndex);
  });
});
