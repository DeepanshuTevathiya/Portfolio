const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-header nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

const wordmarkText = document.querySelector('.wordmark-text');
const wordmarkCursor = document.querySelector('.typing-cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

async function typeWordmark() {
  const words = ['deepanshu', 'tevathiya'];
  const typeDelay = 105;
  const wordDelay = 260;
  const blinkDelay = 360;
  const eraseDelay = 65;
  const writtenPause = 2200;

  if (reduceMotion.matches) {
    wordmarkText.textContent = words.join(' ');
    wordmarkCursor.classList.add('is-static');
    return;
  }

  while (true) {
    wordmarkText.textContent = '';
    wordmarkCursor.classList.remove('is-hidden');
    for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
      const word = words[wordIndex];
      for (const character of word) {
        wordmarkText.textContent += character;
        await new Promise(resolve => setTimeout(resolve, typeDelay));
      }
      if (wordIndex < words.length - 1) {
        wordmarkText.textContent += ' ';
        await new Promise(resolve => setTimeout(resolve, wordDelay));
      }
    }

    for (let blink = 0; blink < 3; blink += 1) {
      wordmarkCursor.classList.add('is-hidden');
      await new Promise(resolve => setTimeout(resolve, blinkDelay));
      wordmarkCursor.classList.remove('is-hidden');
      await new Promise(resolve => setTimeout(resolve, blinkDelay));
    }

    await new Promise(resolve => setTimeout(resolve, writtenPause));
    wordmarkCursor.classList.add('is-hidden');
    for (let index = wordmarkText.textContent.length; index > 0; index -= 1) {
      wordmarkText.textContent = wordmarkText.textContent.slice(0, index - 1);
      await new Promise(resolve => setTimeout(resolve, eraseDelay));
    }
    await new Promise(resolve => setTimeout(resolve, wordDelay));
    wordmarkCursor.classList.remove('is-hidden');
  }
}

typeWordmark();

const themeButton = document.querySelector('.theme-toggle');
const storedTheme = localStorage.getItem('portfolio-theme');
if (storedTheme === 'light') document.body.classList.add('light');
function updateThemeButton() {
  const light = document.body.classList.contains('light');
  themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeButton.title = light ? 'Switch to dark theme' : 'Switch to light theme';
  themeButton.textContent = light ? '◐' : '☼';
}
updateThemeButton();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeButton();
});

const progress = document.querySelector('.scroll-progress');
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${available > 0 ? (window.scrollY / available) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.section-heading, .project, .about-grid, .focus-list > div, .achievement-grid > div, .timeline-item, .education-row, .credentials, .contact-inner').forEach((item, index) => {
  item.classList.add('reveal');
  item.style.setProperty('--reveal-delay', `${Math.min(index * 45, 220)}ms`);
  revealObserver.observe(item);
});
