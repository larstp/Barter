/**
 * Creates a decorative background logo element
 * @returns {HTMLElement} Background logo container
 */
export function createLogoBackground() {
  const container = document.createElement('div');
  container.className =
    'fixed inset-0 z-0 overflow-hidden pointer-events-none select-none';
  container.setAttribute('aria-hidden', 'true');

  const logoImg = document.createElement('img');
  logoImg.src = '../../public/img/logos/logo-65x65.svg';
  logoImg.alt = '';
  logoImg.style.opacity = '0.1';
  logoImg.style.userSelect = 'none';
  logoImg.className =
    'absolute w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 md:max-w-2xl lg:max-w-4xl rotate-12 select-none';

  container.appendChild(logoImg);

  return container;
}
