/**
 * Adds a Show/Hide control to a password input.
 * @param {HTMLInputElement} input - The password input to enhance.
 * @returns {HTMLButtonElement} The visibility toggle button.
 */
export function addPasswordToggle(input) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative';
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  input.style.paddingRight = '4.5rem';

  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'absolute px-2 py-1 text-sm font-semibold -translate-y-1/2 rounded right-3 top-1/2 text-blue-slate-700 hover:bg-cool-steel-100 dark:text-white dark:hover:bg-blue-slate-700';
  button.textContent = 'Show';
  button.setAttribute('aria-label', 'Show password');

  button.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.textContent = isPassword ? 'Hide' : 'Show';
    button.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    );
  });

  wrapper.appendChild(button);
  return button;
}
