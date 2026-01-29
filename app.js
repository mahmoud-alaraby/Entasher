(function () {
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = current;
    }, { passive: true });
})();
/***********************
 * SLIDER NAV (global)
 ***********************/
document.querySelectorAll('[data-slider]').forEach(function (slider) {
    const track = slider.querySelector('.slider-track');
    if (!track) return;
    const btnPrev = slider.querySelector('[data-dir="prev"]');
    const btnNext = slider.querySelector('[data-dir="next"]');
    function getFirstVisibleCard() {
        return track.querySelector('.slide:not([hidden])') || track.querySelector('.slide');
    }
    function scrollByDir(dir) {
        const card = getFirstVisibleCard();
        if (!card) return;
        const amount = card.offsetWidth + 16;
        track.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
    }
    if (btnPrev) btnPrev.addEventListener('click', () => scrollByDir('prev'));
    if (btnNext) btnNext.addEventListener('click', () => scrollByDir('next'));
});
/***********************
 * STICKY FILTER DATA
 ***********************/
const data = {
    country: ["Egypt", "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Oman", "Bahrain"],
    service: [
        "Marketing & Business Services",
        "Corporate Giveaways",
        "Outdoor Advertising",
        "Events & Exhibitions",
        "Press & Media Coverage",
        "Corporate Training"
    ],
    industry: ["Real Estate", "Healthcare", "Retail", "FMCG", "Finance", "Education", "Government", "Technology"]
};
const portalList = document.getElementById('portalList');
const portalPointer = document.getElementById('portalPointer');
const statusText = document.getElementById('statusText');
const countryInput = document.getElementById('countryInput');
const serviceInput = document.getElementById('serviceInput');
const industryInput = document.getElementById('industryInput');
const clearBtn = document.getElementById('clearBtn');
const applyBtn = document.getElementById('applyBtn');
let currentInput = null;
function updateStatus() {
    const c = countryInput.value.trim() || "all countries";
    const s = serviceInput.value.trim() || "providers";
    const ind = industryInput.value.trim() || "any industry";
    statusText.innerHTML =
        "Showing top <span class=\"s-service\">" + s + "</span> in " +
        "<span class=\"s-country\">" + c + "</span> for " +
        "<span class=\"s-industry\">" + ind + "</span>.";
}
function openDropdown(fieldName, inputEl) {
    currentInput = inputEl;
    const values = data[fieldName] || [];
    const q = (inputEl.value || "").toLowerCase();
    portalList.innerHTML = "";
    const filtered = values.filter(v => !q || v.toLowerCase().includes(q));
    if (filtered.length === 0) {
        portalList.style.display = 'none';
        portalPointer.style.display = 'none';
        return;
    }
    filtered.forEach(v => {
        const item = document.createElement('div');
        item.className = 'portal-item';
        item.setAttribute('role', 'option');
        item.textContent = v;
        item.addEventListener('click', () => {
            inputEl.value = v;
            updateStatus();
            closeDropdown();
        });
        portalList.appendChild(item);
    });
    const rect = inputEl.getBoundingClientRect();
    portalList.style.display = 'block';
    portalList.style.top = rect.bottom + 10 + "px";
    portalList.style.left = rect.left + "px";
    portalPointer.style.display = 'block';
    portalPointer.style.top = rect.bottom + 2 + "px";
    portalPointer.style.left = rect.left + rect.width / 2 + "px";
}
function closeDropdown() {
    portalList.style.display = 'none';
    portalPointer.style.display = 'none';
    currentInput = null;
}
function repositionDropdown() {
    if (!currentInput || portalList.style.display === 'none') return;
    const rect = currentInput.getBoundingClientRect();
    portalList.style.top = rect.bottom + 10 + 'px';
    portalList.style.left = rect.left + 'px';
    portalPointer.style.top = rect.bottom + 2 + 'px';
    portalPointer.style.left = rect.left + rect.width / 2 + 'px';
}
window.addEventListener('scroll', repositionDropdown, { passive: true });
window.addEventListener('resize', repositionDropdown);
document.querySelectorAll('.field').forEach(field => {
    const name = field.dataset.field;
    const input = field.querySelector('input');
    input.addEventListener('focus', () => openDropdown(name, input));
    input.addEventListener('input', () => openDropdown(name, input));
});
document.addEventListener('click', e => {
    if (!portalList.contains(e.target) && !e.target.closest('.field')) closeDropdown();
});
clearBtn.addEventListener('click', () => {
    countryInput.value = "Egypt";
    serviceInput.value = "";
    industryInput.value = "";
    updateStatus();
    closeDropdown();
});
applyBtn.addEventListener('click', () => {
    updateStatus();
    closeDropdown();
    // Here you would typically trigger a search/filter action
    console.log('Apply filters:', {
        country: countryInput.value,
        service: serviceInput.value,
        industry: industryInput.value
    });
});
updateStatus();
/***********************
 * Hide sticky CTA + filters when scrolling down
 ***********************/
(function () {
    const bar = document.getElementById('stickyCta');
    const filterShell = document.getElementById('filterShell');
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        const diff = current - lastScrollY;
        if (diff > 10) { // down
            if (current > 120 && filterShell) filterShell.classList.add('is-hidden');
            if (current > 800 && bar) bar.classList.add('is-hidden');
        } else if (diff < -10) { // up
            if (filterShell) filterShell.classList.remove('is-hidden');
            if (bar) bar.classList.remove('is-hidden');
        }
        lastScrollY = current;
    }, { passive: true });
})();
/***********************
 * SMOOTH SCROLL FOR ANCHOR LINKS
 ***********************/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
/***********************
 * SERVICE SEARCH FILTER (Slider)
 ***********************/
(function () {
    const searchInput = document.getElementById('serviceSearch');
    const serviceCards = document.querySelectorAll('#categories .card.slide');
    const sliderTrack = document.getElementById('serviceSliderTrack');
    if (!searchInput || !serviceCards.length || !sliderTrack) return;
    function filterServices(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;
        serviceCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent || '';
            const subtitle = card.querySelector('.card-sub')?.textContent || '';
            const desc = card.querySelector('.card-desc')?.textContent || '';
            const searchText = (title + ' ' + subtitle + ' ' + desc).toLowerCase();
            if (!searchTerm || searchText.includes(searchTerm)) {
                card.style.display = 'flex';
                card.hidden = false;
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.hidden = true;
            }
        });
        // Show message if no results
        let noResultsMsg = document.getElementById('noResultsMsg');
        if (visibleCount === 0 && searchTerm) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('p');
                noResultsMsg.id = 'noResultsMsg';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.color = 'var(--muted)';
                noResultsMsg.style.marginTop = '20px';
                noResultsMsg.style.padding = '20px';
                noResultsMsg.style.background = 'var(--bg-light)';
                noResultsMsg.style.borderRadius = 'var(--radius-md)';
                document.querySelector('#categories .slider').after(noResultsMsg);
            }
            noResultsMsg.innerHTML = `No services found for "<strong>${query}</strong>". <a href="https://entasher.com/Tender/Create" style="color:var(--blue);font-weight:700;">Submit a custom request instead</a>.`;
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
    searchInput.addEventListener('input', (e) => {
        filterServices(e.target.value);
    });
    // Clear search on Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterServices('');
            searchInput.blur();
        }
    });
})();
// Ad Popup Modal Control
(function () {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'ad-popup-overlay';
    popupOverlay.id = 'adPopupOverlay';
    popupOverlay.innerHTML = `
      <div class="ad-popup-modal">
        <button class="ad-popup-close" aria-label="Close popup"></button>
        <div class="ad-popup-header">
          <span class="ad-popup-badge">Service Provider Advertisement</span>
          <h3>Connect With Premium Service Providers</h3>
          <p>Get matched with verified professionals ready to help your business grow.</p>
        </div>
        <div class="ad-popup-body">
          <div class="ad-popup-image">
            <div class="ad-placeholder" style="min-height:200px;">
              Ad Image (500x200 or similar)
            </div>
            <!-- Replace with actual ad image:
            <img src="[AD_IMAGE_URL]" alt="Service Provider Advertisement" />
            -->
          </div>
          <div class="ad-popup-content">
            <p><strong>Looking for expert service providers?</strong></p>
            <p>Join Entasher's network of verified partners and connect with businesses actively seeking your services. Get qualified leads delivered directly to you.</p>
          </div>
          <form class="ad-popup-form" id="adPopupForm">
            <input type="text" placeholder="Your Name" required aria-label="Your Name">
            <input type="email" placeholder="Email Address" required aria-label="Email Address">
            <input type="tel" placeholder="Phone Number (optional)" aria-label="Phone Number">
            <textarea placeholder="Tell us about your services (optional)" aria-label="Service Description"></textarea>
          </form>
        </div>
        <div class="ad-popup-footer">
          <button type="button" class="btn btn-outline" onclick="document.getElementById('adPopupOverlay').classList.remove('active')">Maybe Later</button>
          <button type="submit" form="adPopupForm" class="btn btn-primary">Get Started as Provider</button>
        </div>
      </div>
    `;
    document.body.appendChild(popupOverlay);
    const overlay = document.getElementById('adPopupOverlay');
    const closeBtn = overlay.querySelector('.ad-popup-close');
    const form = document.getElementById('adPopupForm');
    // Close popup
    function closePopup() {
        overlay.classList.remove('active');
        localStorage.setItem('adPopupClosed', Date.now().toString());
    }
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
    });
    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Here you would send the form data to your backend
        const formData = new FormData(form);
        console.log('Lead generated:', Object.fromEntries(formData));
        // Redirect to partner signup or show success message
        window.location.href = 'https://agency.entasher.com/createaccount';
    });
    // Show popup after delay (if not closed recently)
    function showPopup() {
        const lastClosed = localStorage.getItem('adPopupClosed');
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        // Show popup if never closed, or closed more than 24 hours ago
        if (!lastClosed || (now - parseInt(lastClosed)) > dayInMs) {
            setTimeout(() => {
                overlay.classList.add('active');
            }, 3000); // Show after 3 seconds
        }
    }
    // Show popup on page load
    showPopup();
    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closePopup();
        }
    });
})();