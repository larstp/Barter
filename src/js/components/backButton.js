/**
 * Creates a back button that navigates to the home page (not the previous page as before. became confusing)
 * @returns {HTMLButtonElement} The back button element
 */
export function createBackButton() {
  const backButton = document.createElement('button');
  backButton.className =
    'flex items-center justify-center p-0 transition-all duration-200 ease-in-out cursor-pointer hover:scale-110';
  backButton.setAttribute('aria-label', 'Go back to home page');

  const backIcon = document.createElement('img');
  backIcon.src = '../../public/icons/flowbite_arrow-right-alt-outline.svg';
  backIcon.alt = '';
  backIcon.className = 'w-5 h-5';
  backIcon.style.filter =
    'invert(18%) sepia(20%) saturate(2200%) hue-rotate(178deg) brightness(90%) contrast(95%)';
  backButton.appendChild(backIcon);

  backButton.addEventListener('click', () => {
    window.location.href = '/index.html';
  });

  return backButton;
}
