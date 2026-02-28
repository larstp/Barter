import { login } from '../api/auth.js';
import { getUser } from '../utils/storage.js';
import { createLoader } from '../components/loader.js';
import { initializePage } from '../utils/main.js';
import { showErrorAfter } from '../components/errorDisplay.js';

initializePage({ includeLogoBackground: true });

/**
 * Checks if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
  return getUser() !== null;
}

/**
 * Creates the login form
 * @returns {void}
 *
 * @description
 * Creates a login form with email and password fields.
 * Handles form submission and redirects to home on success.
 */
function createLoginForm() {
  const main = document.querySelector('main');

  if (!main) {
    console.error('Main element not found');
    return;
  }

  if (isLoggedIn()) {
    window.location.href = '../../index.html';
    return;
  }

  const container = document.createElement('div');
  container.className =
    'relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8 pt-24 md:pb-8';

  const form = document.createElement('form');
  form.className = 'flex flex-col w-full max-w-md gap-6';
  form.setAttribute('aria-label', 'Login form');

  const header = document.createElement('h1');
  header.className =
    'mb-4 text-3xl font-light text-center text-blue-slate-900 font-display';
  header.textContent = 'Log in to Barter';
  form.appendChild(header);

  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'flex flex-col gap-4 login-fields';

  const emailLabel = document.createElement('label');
  emailLabel.className = 'block mb-2 text-sm font-semibold text-cool-steel-800';
  emailLabel.textContent = 'Email';
  emailLabel.setAttribute('for', 'email');
  fieldsContainer.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.name = 'email';
  emailInput.className =
    'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  emailInput.placeholder = 'example@stud.noroff.no';
  emailInput.required = true;
  emailInput.setAttribute('aria-label', 'Email address');
  emailInput.setAttribute('pattern', '.*@stud\\.noroff\\.no$');
  emailInput.title = 'Email must end with @stud.noroff.no';
  fieldsContainer.appendChild(emailInput);

  // ----------------------------------------------------------------  Email validation feedback test
  emailInput.addEventListener('blur', () => {
    const value = emailInput.value.trim();
    if (value && value.endsWith('@stud.noroff.no')) {
      emailInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-celadon-500 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-celadon-600 focus:ring-2 focus:ring-celadon-200';
      emailInput.setAttribute('aria-invalid', 'false');
    } else if (value) {
      emailInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-petal-frost-500 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-petal-frost-600 focus:ring-2 focus:ring-petal-frost-200';
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      emailInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200'; // i like tailwind but the long ones are very hard to read
      emailInput.removeAttribute('aria-invalid');
    }
  });

  const passwordLabel = document.createElement('label');
  passwordLabel.className =
    'block mb-2 text-sm font-semibold text-cool-steel-800';
  passwordLabel.textContent = 'Password';
  passwordLabel.setAttribute('for', 'password');
  fieldsContainer.appendChild(passwordLabel);

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.name = 'password';
  passwordInput.className =
    'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  passwordInput.placeholder = '••••••••';
  passwordInput.required = true;
  passwordInput.minLength = 8;
  passwordInput.title = 'Enter your password';
  passwordInput.setAttribute('aria-label', 'Password');
  fieldsContainer.appendChild(passwordInput);

  // --------------------------------------------------------------- Password validation feedback test
  passwordInput.addEventListener('blur', () => {
    const value = passwordInput.value;
    if (value && value.length >= 8) {
      passwordInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-celadon-500 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-celadon-600 focus:ring-2 focus:ring-celadon-200';
      passwordInput.setAttribute('aria-invalid', 'false');
    } else if (value) {
      passwordInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-petal-frost-500 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-petal-frost-600 focus:ring-2 focus:ring-petal-frost-200';
      passwordInput.setAttribute('aria-invalid', 'true');
    } else {
      passwordInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
      passwordInput.removeAttribute('aria-invalid');
    }
  });

  form.appendChild(fieldsContainer);

  const rememberContainer = document.createElement('div');
  rememberContainer.className = 'flex items-center gap-2';

  const rememberCheckbox = document.createElement('input');
  rememberCheckbox.type = 'checkbox';
  rememberCheckbox.id = 'remember';
  rememberCheckbox.name = 'remember';
  rememberCheckbox.checked = true; // Default to checked is probably best, might change
  rememberCheckbox.className =
    'w-4 h-4 bg-white border-2 rounded cursor-pointer text-blue-slate-600 border-cool-steel-300 focus:ring-2 focus:ring-blue-slate-200';

  const rememberLabel = document.createElement('label');
  rememberLabel.setAttribute('for', 'remember');
  rememberLabel.className = 'text-sm cursor-pointer text-cool-steel-700';
  rememberLabel.textContent = 'Remember me';

  rememberContainer.appendChild(rememberCheckbox);
  rememberContainer.appendChild(rememberLabel);
  form.appendChild(rememberContainer);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className =
    'w-full p-4 bg-blue-slate-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  submitButton.textContent = 'Log in';
  form.appendChild(submitButton);

  const registerText = document.createElement('p');
  registerText.className = 'text-sm text-center text-cool-steel-600';

  const textNode = document.createTextNode("Don't have an account? ");
  registerText.appendChild(textNode);

  const registerLink = document.createElement('a');
  registerLink.href = './register.html';
  registerLink.className =
    'font-semibold no-underline transition-colors duration-300 text-blue-slate-600 hover:text-blue-slate-700 hover:underline';
  registerLink.textContent = 'Click here to register';
  registerText.appendChild(registerLink);

  form.appendChild(registerText);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    if (!email || !password) {
      const fieldsContainer = form.querySelector('.login-fields');
      showErrorAfter(fieldsContainer, 'Please fill in all fields', 'login');
      return;
    }

    if (!email.endsWith('@stud.noroff.no')) {
      const fieldsContainer = form.querySelector('.login-fields');
      showErrorAfter(
        fieldsContainer,
        'Email must be a valid @stud.noroff.no address',
        'login'
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    const loader = createLoader('Logging you in...');
    fieldsContainer.insertAdjacentElement('afterend', loader);

    try {
      await login(email, password, remember);

      loader.remove();

      const successDiv = document.createElement('div');
      successDiv.className =
        'p-4 text-sm text-center border rounded-lg bg-celadon-50 border-celadon-300 text-celadon-700';
      successDiv.textContent = 'Login successful! Redirecting...';
      successDiv.setAttribute('role', 'status');
      fieldsContainer.insertAdjacentElement('afterend', successDiv);

      setTimeout(() => {
        // ----------------------------------------------------Check for redirect parameter in URL test
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          window.location.href = '../../index.html';
        }
      }, 1000);
    } catch (error) {
      loader.remove();

      const fieldsContainer = form.querySelector('.login-fields');
      showErrorAfter(
        fieldsContainer,
        error.message || 'Login failed. Please try again.',
        'login'
      );

      submitButton.disabled = false;
      submitButton.textContent = 'Log in';
    }
  });

  container.appendChild(form);
  main.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
  createLoginForm();
});
