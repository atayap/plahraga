// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Dropdown menu for mobile is disabled to allow direct navigation.

// Add to cart functionality
document.querySelectorAll(".btn-add-cart").forEach(button => {
    button.addEventListener("click", function() {
        const productCard = this.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = productCard.querySelector(".current-price").textContent;
        
        // Simulate adding to cart
        this.textContent = "Ditambahkan!";
        this.style.backgroundColor = "#4CAF50";
        
        setTimeout(() => {
            this.textContent = "Tambah ke Keranjang";
            this.style.backgroundColor = "";
        }, 2000);
        
        // In a real application, you would add the product to a cart array or send to server
        console.log(`Added to cart: ${productName} - ${productPrice}`);
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: "smooth"
            });
        }
    });
});

// Sticky header on scroll
window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
        navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
        navbar.style.boxShadow = "none";
    }
});

// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    // THEME SWITCHER
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme');

    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    };

    if (currentTheme) {
        setTheme(currentTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
});

// Logo Fader
document.addEventListener('DOMContentLoaded', () => {
    const logo1 = document.getElementById('logo1');
    const logo2 = document.getElementById('logo2');

    setInterval(() => {
        if (logo1.classList.contains('active')) {
            logo1.classList.remove('active');
            logo2.classList.add('active');
        } else {
            logo1.classList.add('active');
            logo2.classList.remove('active');
        }
    }, 3000); // Ganti setiap 3 detik
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
        bannerSnapshot.forEach((doc, index) => {
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

// Mobile Search Toggle
document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('mobile-search-icon');
    const searchDropdown = document.querySelector('.mobile-search-dropdown');

    if (searchIcon && searchDropdown) {
        searchIcon.addEventListener('click', () => {
            searchDropdown.classList.toggle('active');
        });
    }
});