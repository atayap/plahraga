document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- MOBILE MENU ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            body.classList.toggle("menu-open");
        });

        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            body.classList.remove("menu-open");
        }));
    }

    // --- COOKIE CONSENT ---
    const cookieConsentBanner = document.createElement('div');
    cookieConsentBanner.className = 'cookie-consent-banner';
    cookieConsentBanner.innerHTML = `
        <p>Situs ini menggunakan cookie untuk fungsionalitas dan analitik. Dengan menerima, Anda membantu kami meningkatkan layanan. Lihat <a href="privacy-policy.html">kebijakan privasi</a> kami.</p>
        <div class="cookie-consent-actions">
            <button class="btn btn-secondary" id="cookie-decline-btn">Tolak</button>
            <button class="btn btn-primary" id="cookie-accept-btn">Terima</button>
        </div>
    `;

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    // Check if consent has been given
    if (!getCookie('plahraga_cookie_consent')) {
        body.appendChild(cookieConsentBanner);
        
        // Use a small timeout to allow the element to be in the DOM before triggering the transition
        setTimeout(() => {
            cookieConsentBanner.classList.add('active');
        }, 100);

        const handleConsent = (consentValue) => {
            setCookie('plahraga_cookie_consent', consentValue, 365); // Set cookie for 1 year
            cookieConsentBanner.classList.remove('active');
            // Optional: remove the banner from DOM after transition
            setTimeout(() => {
                cookieConsentBanner.remove();
            }, 500);
        };

        const acceptBtn = document.getElementById('cookie-accept-btn');
        const declineBtn = document.getElementById('cookie-decline-btn');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => handleConsent('declined'));
        }
    }

    // --- LOGO FADER ---
    const logo1 = document.getElementById('logo1');
    const logo2 = document.getElementById('logo2');

    if (logo1 && logo2) {
        setInterval(() => {
            if (logo1.classList.contains('active')) {
                logo1.classList.remove('active');
                logo2.classList.add('active');
            } else {
                logo1.classList.add('active');
                logo2.classList.remove('active');
            }
        }, 3000); // Ganti setiap 3 detik
    }

    // --- MOBILE SEARCH TOGGLE ---
    const searchIcon = document.getElementById('mobile-search-icon');
    const searchDropdown = document.querySelector('.mobile-search-dropdown');

    if (searchIcon && searchDropdown) {
        searchIcon.addEventListener('click', () => {
            searchDropdown.classList.toggle('active');
        });
    }

    // --- STICKY HEADER ---
    window.addEventListener("scroll", function() {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            if (window.scrollY > 50) { // Mengurangi jarak scroll agar efek lebih cepat terlihat
                navbar.style.boxShadow = "var(--shadow)";
            } else {
                navbar.style.boxShadow = "none";
            }
        } else {
            // Tidak perlu error, karena di beberapa halaman (login/register) memang tidak ada navbar.
        }
    });
});

// --- BANNER SLIDESHOW ---
window.initializeBanner = async function(db, collection, query, getDocs) {
    const bannerContainer = document.querySelector('.banner-container');
    const dotsContainer = document.querySelector('.dots-container');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (!bannerContainer) return;

    try {
        const bannersCol = collection(db, 'banners');
        const bannerSnapshot = await getDocs(query(bannersCol));

        if (bannerSnapshot.empty) {
            bannerContainer.innerHTML = '<p style="text-align: center; color: var(--text-color);">Tidak ada banner saat ini.</p>';
            if (dotsContainer) dotsContainer.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            return;
        }

        let slidesHTML = '';
        let dotsHTML = '';
        bannerSnapshot.docs.forEach((doc, index) => {
            const banner = doc.data();
            slidesHTML += `
                <div class="banner-slide">
                    <img src="${banner.imageUrl}" alt="${banner.title}">
                    <div class="banner-text">
                        <h2>${banner.title}</h2>
                        <p>${banner.description}</p>
                        ${banner.link ? `<a href="${banner.link}" target="_blank" class="btn-primary">Pelajari Selengkapnya</a>` : ''}
                    </div>
                </div>`;
            dotsHTML += `<span class="dot" data-slide-to="${index}"></span>`;
        });

        bannerContainer.innerHTML = slidesHTML;
        if (dotsContainer) dotsContainer.innerHTML = dotsHTML;

        const slides = document.querySelectorAll('.banner-slide');
        const dots = document.querySelectorAll('.dot');
        let slideIndex = 0;
        let slideInterval;

        function showSlide(n) {
            slideIndex = (n + slides.length) % slides.length;

            slides.forEach(slide => slide.style.display = 'none');
            if(dots.length > 0) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[slideIndex].classList.add('active');
            }
            slides[slideIndex].style.display = 'block';
        }

        function nextSlide() {
            showSlide(slideIndex + 1);
        }

        function startAutoplay() {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                stopAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                showSlide(slideIndex - 1);
                stopAutoplay();
            });
        }

        if (dots.length > 0) {
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const slideNumber = parseInt(e.target.getAttribute('data-slide-to'));
                    showSlide(slideNumber);
                    stopAutoplay();
                });
            });
        }
        
        bannerContainer.addEventListener('mouseenter', stopAutoplay);
        bannerContainer.addEventListener('mouseleave', startAutoplay);

        showSlide(0);
        startAutoplay();

    } catch (error) {
        console.error("Error loading banners:", error);
        bannerContainer.innerHTML = '<p style="text-align: center; color: red;">Gagal memuat banner.</p>';
    }
};

// Reusable function to generate star rating HTML
export function generateRatingHTML(rating) {
    // If rating is not provided or is 0, display a message
    if (!rating || rating === 0) {
        return '<div class="product-rating"><span class="rating-value">Belum ada rating</span></div>';
    }

    // Return a single star icon followed by the rating value
    return `
        <div class="product-rating">
            <div class="stars"><i class="fas fa-star"></i></div>
            <span class="rating-value">${rating.toFixed(1)}</span>
        </div>
    `;
}