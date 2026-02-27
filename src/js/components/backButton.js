/**
 * Creates a back button that navigates to the home page (not the previous page as before. became confusing)
 * @returns {HTMLButtonElement} The back button element
 */
export function createBackButton() {
  const backButton = document.createElement('button');
  backButton.className =
    'relative flex items-center justify-center w-5 h-5 p-0 transition-transform duration-200 ease-in-out cursor-pointer hover:scale-110 group';
  backButton.setAttribute('aria-label', 'Go back to home page');

  const backOutlineIcon = document.createElement('img');
  backOutlineIcon.src =
    '../../public/icons/flowbite_arrow-right-alt-outline.svg';
  backOutlineIcon.alt = '';
  backOutlineIcon.className = 'w-5 h-5 group-hover:hidden';
  backButton.appendChild(backOutlineIcon);

  const backSolidIcon = document.createElement('img');
  backSolidIcon.src = '../../public/icons/flowbite_arrow-right-alt-solid.svg';
  backSolidIcon.alt = '';
  backSolidIcon.className = 'absolute inset-0 hidden w-5 h-5 group-hover:block';
  backButton.appendChild(backSolidIcon);

  backButton.addEventListener('click', () => {
    window.location.href = '/index.html';
  });

  return backButton;
}
