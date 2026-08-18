// ======================================
// AUTO LOGIN
// ======================================

const currentUser = localStorage.getItem("currentUser");

if (currentUser) {
    window.location.href = "dashboard.html";
}

/* ==========================================
   GLOBAL DARK MODE
========================================== */


const savedSettings = JSON.parse(
    localStorage.getItem(`silentSOSSettings_${currentUser}`)
);

if (savedSettings && savedSettings.darkMode) {
    document.body.classList.add("dark-mode");
}

// Navbar Shadow on Scroll

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
        header.style.background = "rgba(255,255,255,0.98)";

    } else {

        header.style.boxShadow = "0 8px 25px rgba(0,0,0,.05)";
        header.style.background = "rgba(255,255,255,.95)";

    }

});



// ======================================
// Animated Counter
// ======================================

const counters = document.querySelectorAll(".stat-box h2");

const speed = 120;

const runCounter = () => {

    counters.forEach(counter => {

        const text = counter.innerText;

        const target = parseInt(text.replace(/\D/g, ""));

        let count = 0;

        const update = () => {

            const increment = Math.ceil(target / speed);

            count += increment;

            if (count < target) {

                if (text.includes("%")) {
                    counter.innerText = count + "%";
                }

                else if (text.includes("K")) {
                    counter.innerText = count + "K+";
                }

                else {
                    counter.innerText = count + "+";
                }

                requestAnimationFrame(update);

            }

            else {

                counter.innerText = text;

            }

        }

        update();

    });

};



// Run counter when stats section appears

const stats = document.querySelector(".stats");

let started = false;

window.addEventListener("scroll", () => {

    const sectionTop = stats.offsetTop - 300;

    if (!started && window.scrollY > sectionTop) {

        runCounter();

        started = true;

    }

});



// ======================================
// Smooth Button Click Effect
// ======================================

const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {

    btn.addEventListener("click", function(){

        this.style.transform = "scale(.95)";

        setTimeout(() => {

            this.style.transform = "";

        },150);

    });

});



// ======================================
// Hero Image Parallax
// ======================================

const heroImage = document.querySelector(".hero-image img");

window.addEventListener("mousemove",(e)=>{

    const x = (window.innerWidth / 2 - e.pageX) / 45;

    const y = (window.innerHeight / 2 - e.pageY) / 45;

    heroImage.style.transform =
    `translate(${x}px,${y}px)`;

});



// ======================================
// Console Message
// ======================================

console.log("Silent SOS Loaded Successfully");