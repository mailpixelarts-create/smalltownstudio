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
    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(countInterval);
        this.onLoaderComplete();
      }
    });

    // Film leader countdown 8 → 1 synced to timeline duration
    let count = 8;
    const totalDuration = 2.4;
    const countInterval = setInterval(() => {
      count--;
      if (count >= 1 && this.loaderNumber) {
        this.loaderNumber.textContent = String(count);
      }
    }, (totalDuration / 8) * 1000);

    // Progress bar
    tl.to(this.loaderProgress, {
      width: '100%',
      duration: totalDuration,
      ease: 'none'
    });

    // Show "FEATURE PRESENTATION" text
    tl.to(this.loaderText, {
      opacity: 1,
      duration: 0.3
    }, '-=0.5');

    // Hold for a beat
    tl.to({}, { duration: 0.5 });

    // Fade out loader
    tl.to(this.loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        clearInterval(countInterval);
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
  }

  private initSmoothScroll() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Ensure ScrollTrigger recalculates after Lenis measures the page
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  private initSplitText() {
    const splitElements = document.querySelectorAll('[data-split]');
    splitElements.forEach((el) => {
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
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Titles with split text
    (gsap.utils.toArray('[data-split="chars"]') as HTMLElement[]).forEach((el) => {
      const isHero = el.closest('.hero');
      const chars = el.querySelectorAll('.char');
      if (!isHero && chars.length === 0) return;
      if (isHero) {
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
              delay: 0.3,
              onComplete: () => {
                document.body.classList.remove('is-loading');
              }
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
              delay: 0.3,
              onComplete: () => {
                document.body.classList.remove('is-loading');
              }
            }
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
        delay: (i % 2) * 0.15,
        ease: 'power3.out'
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
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });

    // BTS items
    gsap.utils.toArray('.bts__item').forEach((item, i) => {
      gsap.from(item as HTMLElement, {
        scrollTrigger: {
          trigger: item as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
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
        duration: 0.5,
        delay: i * 0.05,
        ease: 'power3.out'
      });
    });

    // BTS slider items — handled by CSS animation
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
    const cursor = document.getElementById('cursor');
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
        cursor.style.opacity = '';
      }
    });

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
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
            cursor.classList.add('is-play');
            cursor.classList.remove('is-hovering');
            const label = cursor.querySelector('.cursor__label');
            if (label) label.textContent = 'PLAY';
          } else if (cursorType === 'OPEN') {
            cursor.classList.add('is-hovering');
            cursor.classList.remove('is-play');
            const label = cursor.querySelector('.cursor__label');
            if (label) label.textContent = 'OPEN';
          } else {
            cursor.classList.add('is-hovering');
            cursor.classList.remove('is-play');
            const label = cursor.querySelector('.cursor__label');
            if (label) label.textContent = 'VIEW';
          }
        });

        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('is-hovering', 'is-play');
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
    const prevBtn = document.getElementById('btsPrev');
    const nextBtn = document.getElementById('btsNext');
    const dotsContainer = document.getElementById('btsDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.bts__dot');
    const totalPages = dots.length;
    let currentPage = 0;

    const updateDots = () => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentPage);
      });
    };

    const scrollToPage = (page: number) => {
      const scrollAmount = track.clientWidth / 3;
      track.scrollTo({ left: scrollAmount * page * 3, behavior: 'smooth' });
      currentPage = page;
      updateDots();
    };

    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        scrollToPage(currentPage + 1);
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentPage > 0) {
        scrollToPage(currentPage - 1);
      }
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index') || '0');
        scrollToPage(index);
      });
    });

    track.addEventListener('scroll', () => {
      const scrollAmount = track.clientWidth / 3;
      const page = Math.round(track.scrollLeft / (scrollAmount * 3));
      if (page !== currentPage && page >= 0 && page < totalPages) {
        currentPage = page;
        updateDots();
      }
    });
  }

  private initPageTransitions() {
    // Fade-in on page load — skip if hero exists (hero animation handles it)
    if (!document.querySelector('.hero')) {
      requestAnimationFrame(() => {
        getComputedStyle(document.body).opacity;
        document.body.classList.remove('is-loading');
      });
    }

    // Fade-out on internal link click (skip menu links — they have their own handler)
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      if (link.closest('.menu')) return;

      link.addEventListener('click', (e) => {
        if (document.body.classList.contains('is-leaving')) return;
        e.preventDefault();
        cancelAnimationFrame(this.cursorRafId);
        document.body.classList.add('is-leaving');
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      });
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
