import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

class App {
  private lenis!: Lenis;
  private cursorRafId: number = 0;
  private loader: HTMLElement | null;
  private loaderNumber: HTMLElement | null;
  private loaderProgress: HTMLElement | null;
  private loaderText: HTMLElement | null;
  private loaderBar: HTMLElement | null;

  constructor() {
    this.loader = document.getElementById('loader');
    this.loaderNumber = this.loader?.querySelector('.loader__number') ?? null;
    this.loaderProgress = this.loader?.querySelector('.loader__progress') ?? null;
    this.loaderText = this.loader?.querySelector('.loader__text') ?? null;
    this.loaderBar = this.loader?.querySelector('.loader__bar') ?? null;

    // Initialize current page URL tracking immediately
    this.currentPageUrl = window.location.pathname;

    this.init();
  }

  private init() {
    if (this.loader) {
      this.initLoader();
    } else {
      this.onLoaderComplete();
    }
  }

  private initLoader() {
    if (!this.loader) return;

    // Ensure loader is visible before animation starts
    document.body.classList.remove('is-loading');
    this.loader.style.opacity = '1';
    this.loader.classList.remove('is-hidden');

    // Set up countdown variables
    const totalDuration = 3.0; // seconds for full loader animation
    // Initialize displayed number
    if (this.loaderNumber) this.loaderNumber.textContent = '1';
    const countObj = { value: 1 };

    // Start GSAP timeline with a brief initial pause to ensure the "1" is visible
    const tl = gsap.timeline({
      onUpdate: () => {
        if (this.loaderNumber) {
          this.loaderNumber.textContent = Math.round(countObj.value).toString();
        }
      },
      onComplete: () => {
        this.onLoaderComplete();
      }
    });

    // Initial short pause (0.2s) before counting begins
    tl.to({}, { duration: 0.2 });

    // Animate the number from 1 to 100 over the total duration
    tl.to(countObj, { value: 100, duration: totalDuration, ease: 'none' });

    // Progress bar animation (synchronised with number)
    tl.to(this.loaderProgress, { width: '100%', duration: totalDuration, ease: 'none' }, 0);

    // Show "FEATURE PRESENTATION" text
    tl.to(this.loaderText, { opacity: 1, duration: 0.3 }, '-=0.5');

    // Hold for a beat
    tl.to({}, { duration: 0.5 });

    // Fade out loader
    tl.to(this.loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        this.loader?.classList.add('is-hidden');
      }
    });
  }

  private onLoaderComplete() {
    this.initSmoothScroll();
    this.initSplitText();
    this.initRevealAnimations();
    this.initParallax();
    this.initNav();
    this.initCursor();
    this.initAudio();
    this.initShowreel();
    this.initBtsSlider();
    this.initPageTransitions();
    this.initVideoLightbox();
    this.initParallaxHover();
    this.initScrollbarTrack();
  }

  private initSmoothScroll() {
    this.lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(500, 33);

    // Ensure ScrollTrigger recalculates after Lenis measures the page
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  private initSplitText() {
    const splitElements = document.querySelectorAll('[data-split]');
    splitElements.forEach((el) => {
      // Skip hero title — it has nested spans that SplitType would duplicate
      if (el.closest('.hero')) return;
      const type = el.getAttribute('data-split');
      if (type === 'chars' || type === 'lines' || type === 'words') {
        new SplitType(el as HTMLElement, {
          types: [type as 'chars' | 'lines' | 'words']
        });
      }
    });
  }

  private initRevealAnimations() {
    // Section labels
    (gsap.utils.toArray('.section-label') as HTMLElement[]).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out'
      });
    });

    // Titles with split text
    (gsap.utils.toArray('[data-split="chars"]') as HTMLElement[]).forEach((el) => {
      const isHero = el.closest('.hero');
      const chars = el.querySelectorAll('.char');
      if (!isHero && chars.length === 0) return;
      if (isHero) {
        // Hero content container — reveal before title animates
        const heroContent = el.closest('.hero__content') as HTMLElement;
        if (heroContent) {
          gsap.set(heroContent, { opacity: 1, delay: 0.2 });
        }
        // Hero title — animate lines from below with clip reveal
        const lines = el.querySelectorAll('.hero__title-line');
        if (lines.length > 0) {
          gsap.fromTo(lines,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.15,
              ease: 'power3.out',
              delay: 0.3
            }
          );
        } else {
          // Fallback — animate the whole element
          gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              delay: 0.3
            }
          );
        }
        // Staggered reveal for subtitle and scroll indicator
        const subtitle = heroContent?.querySelector('.hero__subtitle');
        const scrollIndicator = heroContent?.querySelector('.hero__scroll-indicator');
        if (subtitle) {
          gsap.fromTo(subtitle,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
          );
        }
        if (scrollIndicator) {
          gsap.fromTo(scrollIndicator,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
          );
        }
      } else {
        gsap.fromTo(chars,
          { y: '100%', opacity: 0 },
          {
            scrollTrigger: {
              trigger: el as HTMLElement,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power3.out'
          }
        );
      }
    });

    // Lines
    (gsap.utils.toArray('[data-split="lines"]') as HTMLElement[]).forEach((el) => {
      const lines = el.querySelectorAll('.line');
      if (lines.length === 0) return;
      gsap.fromTo(lines,
        { y: '100%', opacity: 0 },
        {
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
    });

    // Film cards
    gsap.utils.toArray('.film-card').forEach((card, i) => {
      gsap.from(card as HTMLElement, {
        scrollTrigger: {
          trigger: card as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power4.out'
      });
    });

    // Awards items
    gsap.utils.toArray('.awards__item').forEach((item, i) => {
      gsap.from(item as HTMLElement, {
        scrollTrigger: {
          trigger: item as HTMLElement,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });

    // Client logos
    gsap.utils.toArray('.clients__logo').forEach((logo, i) => {
      gsap.from(logo as HTMLElement, {
        scrollTrigger: {
          trigger: logo as HTMLElement,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.05,
        ease: 'power3.out'
      });
    });

    // Why page stats
    gsap.utils.toArray('.about-why__feature, .about-why__stat').forEach((item, i) => {
      gsap.from(item as HTMLElement, {
        scrollTrigger: {
          trigger: '.about-why__grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 36,
        rotateX: 4,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out'
      });
    });
  }

  private initParallax() {
    // Hero parallax
    const heroVideo = document.querySelector('.hero__video-wrap');
    if (heroVideo) {
      gsap.to(heroVideo, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: '20%',
        scale: 1.1,
        ease: 'none'
      });
    }

    // Hero content fade
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      gsap.to(heroContent, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'center center',
          end: 'bottom top',
          scrub: 1
        },
        opacity: 0,
        y: -50,
        ease: 'none'
      });
    }

    // Count-up animation for Why section numbers
    gsap.utils.toArray('.about-why__number[data-target]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            }
          });
        }
      });
    });
  }

  private initNav() {
    const navToggle = document.getElementById('navToggle');
    const menu = document.getElementById('menu');
    let isOpen = false;

    if (!navToggle || !menu) return;

    navToggle.addEventListener('click', () => {
      isOpen = !isOpen;
      navToggle.classList.toggle('is-active', isOpen);
      menu.classList.toggle('is-open', isOpen);

      if (isOpen) {
        this.lenis?.stop();
        document.body.style.overflow = 'hidden';
      } else {
        this.lenis?.start();
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    menu.querySelectorAll('.menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        isOpen = false;
        navToggle.classList.remove('is-active');
        menu.classList.remove('is-open');
        this.lenis?.start();
        document.body.style.overflow = '';
      });
    });
  }

  private initCursor() {
    let cursor = document.getElementById('cursor');
    // Inject cursor markup if missing
    if (!cursor) {
      const cursorHTML = `
        <div class="cursor" id="cursor">
          <div class="cursor__dot"></div>
          <div class="cursor__ring"></div>
          <div class="cursor__label">VIEW</div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', cursorHTML);
      cursor = document.getElementById('cursor');
    }
    if (!cursor || window.innerWidth < 768) return;

    // Hide cursor until first mouse move
    cursor.style.opacity = '0';
    let hasMoved = false;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = -100;
    let cursorY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        cursor!.style.opacity = '';
      }
    });

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor!.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      this.cursorRafId = requestAnimationFrame(animate);
    };
    animate();

    // Hover states
    const setupHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor]');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const cursorType = el.getAttribute('data-cursor');
          if (cursorType === 'PLAY') {
            cursor!.classList.add('is-play');
            cursor!.classList.remove('is-hovering');
            const label = cursor!.querySelector('.cursor__label');
            if (label) label.textContent = 'PLAY';
          } else if (cursorType === 'OPEN') {
            cursor!.classList.add('is-hovering');
            cursor!.classList.remove('is-play');
            const label = cursor!.querySelector('.cursor__label');
            if (label) label.textContent = 'OPEN';
          } else {
            cursor!.classList.add('is-hovering');
            cursor!.classList.remove('is-play');
            const label = cursor!.querySelector('.cursor__label');
            if (label) label.textContent = 'VIEW';
          }
        });

        el.addEventListener('mouseleave', () => {
          cursor!.classList.remove('is-hovering', 'is-play');
        });
      });
    };

    setupHoverListeners();
  }

  private initAudio() {
    const audioToggle = document.getElementById('audioToggle');
    if (!audioToggle) return;

    let isMuted = true;
    audioToggle.classList.add('is-muted');

    audioToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      audioToggle.classList.toggle('is-muted', isMuted);
    });
  }

  private initShowreel() {
    const player = document.getElementById('showreelPlayer');
    if (!player) return;

    // @ts-ignore
    if (typeof Plyr !== 'undefined') {
      // @ts-ignore
      new Plyr('#showreelPlayer', {
        controls: ['play-large', 'play', 'progress', 'mute', 'volume', 'fullscreen'],
        hideControls: true,
        autoplay: false,
        muted: true,
        volume: 0
      });
    }
  }

  private initBtsSlider() {
    const track = document.getElementById('btsTrack');
    const viewport = document.getElementById('btsViewport');
    const prevBtn = document.getElementById('btsPrev');
    const nextBtn = document.getElementById('btsNext');
    const dotsContainer = document.getElementById('btsDots');
    if (!track || !viewport || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.bts__slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let isAnimating = false;

    // Generate dots dynamically
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `bts__dot${i === 0 ? ' is-active' : ''}`;
      dot.setAttribute('data-index', String(i));
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.bts__dot');

    const updateDots = () => {
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentSlide));
    };

    const goToSlide = (index: number) => {
      if (index < 0 || index >= totalSlides || index === currentSlide || isAnimating) return;
      isAnimating = true;
      const viewportWidth = viewport.clientWidth;
      const targetX = -index * viewportWidth;
      gsap.to(track, {
        x: targetX,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          currentSlide = index;
          updateDots();
          isAnimating = false;
        }
      });
    };

    nextBtn.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
    });
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) goToSlide(currentSlide - 1);
    });

    // Handle resize — snap to current position without animation
    let resizeTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        gsap.set(track, { x: -currentSlide * viewport.clientWidth });
      }, 100);
    });

    // Ensure initial transform state
    gsap.set(track, { x: 0 });
  }

  private initPageTransitions() {
    // Fade-in on page load — skip if hero exists (hero animation handles it)
    if (!document.querySelector('.hero')) {
      requestAnimationFrame(() => {
        getComputedStyle(document.body).opacity;
        document.body.classList.remove('is-loading');
      });
    }

    // --- AJAX PAGE NAVIGATION (replaces full page reload) ---
    this.initAjaxNavigation();
  }

  // ============================================
  // FEATURE 1 & 2: AJAX NAVIGATION + PAGE TRANSITIONS
  // ============================================

  private isAjaxNavigating = false;
  private currentPageUrl = ''; // Track the current AJAX page URL

  private initAjaxNavigation() {

    // Use event delegation on document to avoid memory leaks
    document.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      // Skip menu links — they already close the menu first
      if (link.closest('.menu')) return;
      // Skip video lightbox triggers
      if (link.closest('.film-card[data-vimeo]')) return;
      // Skip if already navigating
      if (this.isAjaxNavigating) return;

      e.preventDefault();
      this.navigateTo(href, link);
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (this.isAjaxNavigating) return;

      const newUrl = window.location.pathname;
      // Only navigate if the URL actually changed
      if (newUrl !== this.currentPageUrl) {
        this.navigateTo(newUrl, null, true);
      }
    });
  }

  private async navigateTo(url: string, clickedEl: HTMLElement | null, isPopState = false) {
    if (this.isAjaxNavigating) return;
    // Don't navigate to the same page
    if (url === this.currentPageUrl && !isPopState) return;

    this.isAjaxNavigating = true;

    // Stop Lenis during transition
    this.lenis?.stop();
    cancelAnimationFrame(this.cursorRafId);

    // 1. Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'ajax-transition';
    overlay.innerHTML = '<div class="ajax-transition__bar ajax-transition__bar--top"></div><div class="ajax-transition__bar ajax-transition__bar--bottom"></div>';
    document.body.appendChild(overlay);

    // 2. Create morph clone from clicked element (feature 2)
    let morphClone: HTMLElement | null = null;
    if (clickedEl) {
      const img = clickedEl.querySelector('img') || clickedEl.closest('.hero__video-wrap') || clickedEl.closest('.hero');
      if (img) {
        morphClone = document.createElement('div');
        morphClone.className = 'ajax-morph';
        const rect = img.getBoundingClientRect();
        // Only create morph if element is visible on screen
        if (rect.width > 0 && rect.height > 0) {
          Object.assign(morphClone.style, {
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            backgroundImage: window.getComputedStyle(img).backgroundImage || `url(${(img as HTMLImageElement).src || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: '10000',
            borderRadius: '0',
            overflow: 'hidden'
          });
          document.body.appendChild(morphClone);
        }
      }
    }

    // 3. Animate transition bars in
    await new Promise<void>((resolve) => {
      const tl = gsap.timeline({ onComplete: () => resolve() });
      tl.to(overlay.querySelector('.ajax-transition__bar--top'), {
        y: '0%', duration: 0.5, ease: 'power3.inOut'
      }, 0);
      tl.to(overlay.querySelector('.ajax-transition__bar--bottom'), {
        y: '0%', duration: 0.5, ease: 'power3.inOut'
      }, 0);
      // Fade out current content
      tl.to('#main', {
        opacity: 0, y: -30, duration: 0.3, ease: 'power2.in'
      }, 0);
      // Morph the clone to fill screen
      if (morphClone) {
        tl.to(morphClone, {
          top: 0, left: 0, width: '100vw', height: '100vh',
          duration: 0.5, ease: 'power3.inOut'
        }, 0);
      }
    });

    // 4. Fetch new page content
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();

      // Parse the response HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract new main content
      const newMain = doc.querySelector('#main');
      const newTitle = doc.querySelector('title')?.textContent || document.title;

      if (!newMain) {
        // Fallback: full navigation if structure doesn't match
        window.location.href = url;
        return;
      }

      // Update URL and track current page
      if (!isPopState) {
        history.pushState({ ajaxPage: true }, newTitle, url);
      }
      this.currentPageUrl = url;

      // Update title
      document.title = newTitle;

      // 5. Replace main content
      const mainEl = document.getElementById('main');
      if (mainEl) {
        mainEl.innerHTML = newMain.innerHTML;
      }

      // 6. Remove morph clone
      if (morphClone) {
        gsap.to(morphClone, {
          opacity: 0, duration: 0.3, delay: 0.2,
          onComplete: () => morphClone?.remove()
        });
      }

      // 7. Animate transition bars out
      await new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: () => resolve() });
        tl.to(overlay.querySelector('.ajax-transition__bar--top'), {
          y: '-100%', duration: 0.5, ease: 'power3.inOut', delay: 0.1
        }, 0);
        tl.to(overlay.querySelector('.ajax-transition__bar--bottom'), {
          y: '100%', duration: 0.5, ease: 'power3.inOut', delay: 0.1
        }, 0);
      });

      // Clean up overlay
      overlay.remove();

      // 8. Re-initialize everything on new page
      ScrollTrigger.getAll().forEach(t => t.kill());
      this.reinitializePage();

    } catch (err) {
      console.error('AJAX navigation failed:', err);
      // Clean up overlay on error
      overlay?.remove();
      morphClone?.remove();
      this.isAjaxNavigating = false;
      this.lenis?.start();
      // Update currentPageUrl before fallback
      this.currentPageUrl = url;
      // Fallback to full page load
      window.location.href = url;
    }
  }

  private reinitializePage() {
    // Scroll to top
    window.scrollTo(0, 0);

    // Re-init Lenis
    this.lenis?.start();
    this.lenis?.scrollTo(0, { immediate: true });

    // Re-init all page features
    this.initSplitText();
    this.initRevealAnimations();
    this.initParallax();
    this.initNav();
    this.initCursor();
    this.initShowreel();
    this.initBtsSlider();
    this.initVideoLightbox();
    this.initParallaxHover();

    // Reset navigation state
    this.isAjaxNavigating = false;

    // Fade in new content
    requestAnimationFrame(() => {
      document.body.classList.remove('is-leaving');
      gsap.fromTo('#main', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  private initVideoLightbox() {
    const lightbox = document.getElementById('videoLightbox') as HTMLElement;
    const lightboxClose = document.getElementById('videoLightboxClose') as HTMLElement;
    const lightboxPlayer = document.getElementById('videoLightboxPlayer') as HTMLElement;
    if (!lightbox || !lightboxPlayer) return;

    // Open lightbox on film card click
    document.querySelectorAll('.film-card[data-vimeo]').forEach((card) => {
      card.addEventListener('click', () => {
        const vimeoId = card.getAttribute('data-vimeo');
        if (!vimeoId) return;

        lightboxPlayer.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxPlayer.innerHTML = '';
      }, 400);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox when clicking the backdrop
    lightbox.addEventListener('click', () => {
      closeLightbox();
    });

    // Prevent lightbox close when clicking inside the video player
    lightboxPlayer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ============================================
  // FEATURE 3: CUSTOM SCROLLBAR TRACK
  // ============================================

  private initScrollbarTrack() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    // Create scrollbar track element
    const track = document.createElement('div');
    track.className = 'custom-scrollbar';
    track.innerHTML = '<div class="custom-scrollbar__thumb"></div>';
    document.body.appendChild(track);

    const thumb = track.querySelector('.custom-scrollbar__thumb') as HTMLElement;
    if (!thumb) return;

    const updateThumb = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      if (docHeight <= viewHeight) {
        track.style.opacity = '0';
        return;
      }
      track.style.opacity = '';
      const ratio = viewHeight / docHeight;
      const thumbHeight = Math.max(40, ratio * viewHeight);
      thumb.style.height = thumbHeight + 'px';

      // Calculate scroll position
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = docHeight - viewHeight;
      const scrollRatio = maxScroll > 0 ? scrollY / maxScroll : 0;
      const maxThumbTop = viewHeight - thumbHeight;
      thumb.style.top = (scrollRatio * maxThumbTop) + 'px';
    };

    // Update on scroll
    const onScroll = () => requestAnimationFrame(updateThumb);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(updateThumb));
    updateThumb();
  }

  // ============================================
  // FEATURE 5: PARALLAX HOVER ON FILM CARDS
  // ============================================

  private initParallaxHover() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.film-card');
    cards.forEach((card) => {
      const img = card.querySelector('.film-card__image');
      if (!img) return;

      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(img, {
          x: x * 15,
          y: y * 15,
          rotateY: x * 5,
          rotateX: -y * 5,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(img, {
          x: 0, y: 0, rotateY: 0, rotateX: 0,
          duration: 0.6, ease: 'power3.out'
        });
      });
    });
  }


}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
