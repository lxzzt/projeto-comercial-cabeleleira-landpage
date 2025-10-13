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