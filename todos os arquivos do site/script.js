document.addEventListener("DOMContentLoaded", () => {
  // todos os SVGs do indicador
  const rotors = document.querySelectorAll("svg g[id^='rotor-']");

  rotors.forEach((g) => {
    gsap.to(g, {
      rotation: 360,        // use -360 se quiser sentido horário
      duration: 20,         // velocidade (maior = mais lento)
      repeat: -1,
      ease: "none",
      svgOrigin: "100 100", // centro REAL do viewBox (cx, cy do círculo)
    });
  });
});
// ================================================
// === EFEITO DE TRANSIÇÃO CIRCULAR ENTRE SEÇÕES ===
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Seleciona todas as seções
  const sections = gsap.utils.toArray(".page-section");

  // Cria a timeline principal
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-area",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      pin: true,
    }
  });

  // Anima cada transição circular
  sections.forEach((section, i) => {
    if (i === 0) return; // pula a primeira (já visível)

    const prevSection = sections[i - 1];

    tl.fromTo(section, 
      { clipPath: "circle(0% at 50% 50%)" },
      { 
        clipPath: "circle(150% at 50% 50%)",
        ease: "power2.out",
        duration: 1.5
      },
      i // deslocamento relativo (cada seção entra em sequência)
    );

    // opcional: esmaece o texto da seção anterior
    tl.to(prevSection, { opacity: 0, duration: 0.6 }, i);
    tl.to(section, { opacity: 1, duration: 0.8 }, i);
  });
});
