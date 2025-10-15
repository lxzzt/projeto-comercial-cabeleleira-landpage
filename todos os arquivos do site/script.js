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
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
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
// === SLIDER DE AVALIAÇÕES (TOUCH + POINTER + DOTS) ===
document.addEventListener("DOMContentLoaded", () => {
  const sliderWrap = document.getElementById("quadro-modelo");
  const reviewSlider = sliderWrap.querySelector(".review-slider");
  const reviews = Array.from(reviewSlider.querySelectorAll(".review"));
  const dotsContainer = sliderWrap.querySelector(".review-dots");

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isPointerDown = false;
  let autoSlideTimer = null;
  const idleDefault = 5000; // 5s
  const idleAfterInteraction = 10000; // 10s

  // cria bolinhas
  reviews.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Mostrar avaliação ${i + 1}`);
    btn.addEventListener("click", () => {
      index = i;
      updatePosition();
      restartAutoSlide(idleAfterInteraction);
    });
    dotsContainer.appendChild(btn);
  });
  const dots = Array.from(dotsContainer.children);

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function updatePosition() {
    // usa percent baseado no index; cada slide tem exatamente 100% do container
    reviewSlider.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function next() {
    index = (index + 1) % reviews.length;
    updatePosition();
  }

  function prev() {
    index = (index - 1 + reviews.length) % reviews.length;
    updatePosition();
  }

  function restartAutoSlide(timeout = idleDefault) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(next, timeout);
  }

  // POINTER (mouse e touch via pointer events)
  reviewSlider.addEventListener("pointerdown", (e) => {
    isPointerDown = true;
    startX = e.clientX;
    currentX = startX;
    reviewSlider.style.transition = "none"; // desliga transição enquanto arrasta
    reviewSlider.setPointerCapture(e.pointerId);
    clearInterval(autoSlideTimer); // pausa auto enquanto o usuário interage
  });

  reviewSlider.addEventListener("pointermove", (e) => {
    if (!isPointerDown) return;
    currentX = e.clientX;
    const delta = currentX - startX;
    // aplica um deslocamento temporário visual (parcial), sem alterar index
    const percentDelta = (delta / sliderWrap.clientWidth) * 100;
    reviewSlider.style.transform = `translateX(calc(-${index * 100}% + ${percentDelta}%))`;
  });

  function endPointer(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    reviewSlider.style.transition = ""; // restaura transição
    const delta = currentX - startX;
    const threshold = sliderWrap.clientWidth * 0.12; // 12% da largura
    if (delta < -threshold) {
      next();
    } else if (delta > threshold) {
      prev();
    } else {
      updatePosition(); // volta para a posição atual
    }
    restartAutoSlide(idleAfterInteraction);
  }

  reviewSlider.addEventListener("pointerup", endPointer);
  reviewSlider.addEventListener("pointercancel", endPointer);
  reviewSlider.addEventListener("pointerleave", (e) => {
    // se o ponteiro sair e não estiver pressionado, ignora
    if (isPointerDown) endPointer(e);
  });

  // teclado (esquerda/direita)
  sliderWrap.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prev(); restartAutoSlide(idleAfterInteraction); }
    if (e.key === "ArrowRight") { next(); restartAutoSlide(idleAfterInteraction); }
  });

  // garante que ao redimensionar a janela o transform continue correto (evita "meias" por recalculo)
  window.addEventListener("resize", () => {
    // força recalcular transform (percent funciona, mas reforçamos)
    updatePosition();
  });

  // inicia tudo
  updatePosition();
  restartAutoSlide(idleDefault);

  // acessibilidade: torne o container focável para receber teclado
  sliderWrap.setAttribute("tabindex", "0");
});
