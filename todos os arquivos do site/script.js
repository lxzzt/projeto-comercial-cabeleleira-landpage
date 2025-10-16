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
