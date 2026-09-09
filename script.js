/*
 ==========================================
  KIM HYEON PORTFOLIO - CORE JAVASCRIPT
 ==========================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sidebar Tab Switching (Dashboard Layout Router)
    const menuLinks = document.querySelectorAll('.menu-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBackdrop = document.querySelector('.mobile-sidebar-backdrop');

    function setSidebarOpen(isOpen) {
        if (!sidebar) return;
        sidebar.classList.toggle('active', isOpen);
        if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active', isOpen);
    }

    function switchSection(targetId) {
        // Deactivate all menu links & sections
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });

        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.getAttribute('id') === targetId) {
                section.classList.add('active');
            }
        });

        // Scroll to top of the content area
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close sidebar on mobile after clicking
        setSidebarOpen(false);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchSection(targetId);
            // Update hash in URL quietly
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Handle initial routing based on URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchSection(initialHash);
    } else {
        switchSection('hero'); // Default to home dashboard
    }

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        }
    });


    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebar.classList.contains('active'));
        });

        // Close sidebar when clicking outside (backdrop tap included) on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== mobileMenuToggle) {
                setSidebarOpen(false);
            }
        });
    }


    // 3. Neural Network Canvas Animation (Refined)
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(60, Math.floor((width * height) / 22000));
        const connectionDistance = 120;
        const mouse = { x: null, y: null, radius: 140 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3; // Elegant slow velocity
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.4 + 0.15;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 0.35;
                        this.y -= (dy / dist) * force * 0.35;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }




    // 5. Interactive Project Tabs
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const tabButtons = card.querySelectorAll('.tab-btn');
        const tabContents = card.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                card.querySelector(`.tab-content[data-content="${targetTab}"]`).classList.add('active');
            });
        });
    });


    // 6. Image Preview Gallery Logic
    projectCards.forEach(card => {
        const mainImg = card.querySelector('.main-preview-frame img');
        const mainFrame = card.querySelector('.main-preview-frame');
        const thumbs = card.querySelectorAll('.thumb-item');

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const targetSrc = thumb.getAttribute('data-src');
                const targetAlt = thumb.querySelector('img').getAttribute('alt');

                if (mainImg) {
                    mainImg.setAttribute('src', targetSrc);
                    mainImg.setAttribute('alt', targetAlt);
                }

                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        if (mainFrame) {
            mainFrame.addEventListener('click', () => {
                const activeImg = mainFrame.querySelector('img');
                if (activeImg) {
                    openLightbox(activeImg.getAttribute('src'), activeImg.getAttribute('alt'), thumbs);
                }
            });
        }
    });


    // 7. Lightbox Modal Window Logic
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <div class="lightbox-content-wrap">
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
            <button class="lightbox-arrow prev"><i class="fas fa-chevron-left"></i></button>
            <img class="lightbox-img" src="" alt="">
            <div class="lightbox-caption"></div>
            <button class="lightbox-arrow next"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-arrow.prev');
    const lightboxNext = lightbox.querySelector('.lightbox-arrow.next');

    let currentGalleryThumbs = [];
    let currentImgIndex = 0;

    function openLightbox(src, alt, thumbsNodeList) {
        lightboxImg.setAttribute('src', src);
        lightboxImg.setAttribute('alt', alt);
        lightboxCaption.textContent = alt;

        currentGalleryThumbs = Array.from(thumbsNodeList);
        currentImgIndex = currentGalleryThumbs.findIndex(t => t.getAttribute('data-src') === src);
        if (currentImgIndex === -1) currentImgIndex = 0;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showPrevImg() {
        if (currentGalleryThumbs.length <= 1) return;
        currentImgIndex = (currentImgIndex - 1 + currentGalleryThumbs.length) % currentGalleryThumbs.length;
        const prevThumb = currentGalleryThumbs[currentImgIndex];
        const src = prevThumb.getAttribute('data-src');
        const alt = prevThumb.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', src);
        lightboxCaption.textContent = alt;
    }

    function showNextImg() {
        if (currentGalleryThumbs.length <= 1) return;
        currentImgIndex = (currentImgIndex + 1) % currentGalleryThumbs.length;
        const nextThumb = currentGalleryThumbs[currentImgIndex];
        const src = nextThumb.getAttribute('data-src');
        const alt = nextThumb.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', src);
        lightboxCaption.textContent = alt;
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImg);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImg);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImg();
            if (e.key === 'ArrowRight') showNextImg();
        }
    });

    // 8. Email Inquiry Button Clipboard Fallback & Toast Alert
    const emailInquiryBtn = document.getElementById('email-inquiry-btn');
    if (emailInquiryBtn) {
        emailInquiryBtn.addEventListener('click', (e) => {
            const email = 'candle_kh@naver.com';

            // Open the user's mail client with a pre-filled inquiry template
            const subject = encodeURIComponent('[프로젝트 문의]');
            const body = encodeURIComponent('안녕하세요, 프로젝트 문의드립니다.\n\n- 현재 시스템 스택:\n- 하고 싶은 것 / 지금 아픈 지점:\n- 희망 기간, 원격/상주 여부:\n');
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

            // Also copy the email address to clipboard as a fallback
            // (mail client may not be configured on this device)
            navigator.clipboard.writeText(email).then(() => {
                let toast = document.querySelector('.email-toast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.className = 'email-toast';
                    document.body.appendChild(toast);
                }
                toast.textContent = '메일 앱을 열었습니다 (이메일 주소도 복사됨: candle_kh@naver.com)';

                // Trigger reflow to restart transition if clicked repeatedly
                toast.classList.remove('show');
                void toast.offsetWidth;
                toast.classList.add('show');

                // Hide after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
            });
        });
    }

    // 9. Other Engagements Collapsible Toggle
    const otherEngagementsToggle = document.querySelector('.other-engagements-toggle');
    if (otherEngagementsToggle) {
        otherEngagementsToggle.addEventListener('click', () => {
            const body = otherEngagementsToggle.nextElementSibling;
            const isExpanded = otherEngagementsToggle.getAttribute('aria-expanded') === 'true';
            otherEngagementsToggle.setAttribute('aria-expanded', String(!isExpanded));
            body.hidden = isExpanded;
        });
    }
});
