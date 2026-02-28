import { register } from '../api/auth.js';
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
 * Creates the register form
 * @returns {void}
 *
 * @description
 * Creates a registration form with name, email and password fields.
 * Handles form submission and redirects to login on success.
 */
function createRegisterForm() {
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
  form.setAttribute('aria-label', 'Registration form');

  const header = document.createElement('h1');
  header.className =
    'mb-2 text-3xl font-light text-center text-blue-slate-900 font-display';
  header.textContent = 'Create your Barter account';
  form.appendChild(header);

  const subheader = document.createElement('p');
  subheader.className = 'mb-4 text-sm text-center text-cool-steel-600';
  subheader.textContent = 'Get 1000 credits to start bartering!';
  form.appendChild(subheader);

  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'flex flex-col gap-4 register-fields';

  const nameLabel = document.createElement('label');
  nameLabel.className = 'block mb-2 text-sm font-semibold text-cool-steel-800';
  nameLabel.textContent = 'Username';
  nameLabel.setAttribute('for', 'name');
  fieldsContainer.appendChild(nameLabel);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'name';
  nameInput.name = 'name';
  nameInput.className =
    'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  nameInput.placeholder = 'johndoe';
  nameInput.required = true;
  nameInput.setAttribute('aria-label', 'Username');
  nameInput.setAttribute('pattern', '^[a-zA-Z0-9_]+$');
  nameInput.title =
    'Username can only contain letters, numbers, and underscores';
  fieldsContainer.appendChild(nameInput);

  // -------------------------------------------------------------- Username validation feedback test
  nameInput.addEventListener('blur', () => {
    const value = nameInput.value.trim();
    const isValid = /^[a-zA-Z0-9_]+$/.test(value);
    if (value && isValid) {
      nameInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-celadon-500 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-celadon-600 focus:ring-2 focus:ring-celadon-200';
      nameInput.setAttribute('aria-invalid', 'false');
    } else if (value) {
      nameInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-petal-frost-500 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-petal-frost-600 focus:ring-2 focus:ring-petal-frost-200';
      nameInput.setAttribute('aria-invalid', 'true');
    } else {
      nameInput.className =
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
      nameInput.removeAttribute('aria-invalid');
    }
  });

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

  // -------------------------------------------------- Email validation feedback test
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
        'w-full p-4 text-base transition-all duration-300 bg-white border-2 rounded-lg border-cool-steel-200 text-blue-slate-900 placeholder:text-cool-steel-400 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
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
  passwordInput.title = 'Password must be at least 8 characters';
  passwordInput.setAttribute('aria-label', 'Password');
  fieldsContainer.appendChild(passwordInput);

  // ---------------------------------------Password validation feedback test 2 (works now i hope)
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

  const passwordHint = document.createElement('p');
  passwordHint.className = '-mt-2 text-xs text-cool-steel-700';
  passwordHint.textContent = 'Minimum 8 characters';
  fieldsContainer.appendChild(passwordHint);

  form.appendChild(fieldsContainer);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className =
    'w-full p-4 bg-blue-slate-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  submitButton.textContent = 'Create account';
  form.appendChild(submitButton);

  const loginText = document.createElement('p');
  loginText.className = 'text-sm text-center text-cool-steel-600';

  const textNode = document.createTextNode('Already have an account? ');
  loginText.appendChild(textNode);

  const loginLink = document.createElement('a');
  loginLink.href = './login.html';
  loginLink.className =
    'font-semibold no-underline transition-colors duration-300 text-blue-slate-600 hover:text-blue-slate-700 hover:underline';
  loginLink.textContent = 'Log in here';
  loginText.appendChild(loginLink);

  form.appendChild(loginText);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!name || !email || !password) {
      const fieldsContainer = form.querySelector('.register-fields');
      showErrorAfter(fieldsContainer, 'Please fill in all fields', 'register');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      const fieldsContainer = form.querySelector('.register-fields');
      showErrorAfter(
        fieldsContainer,
        'Username can only contain letters, numbers, and underscores',
        'register'
      );
      return;
    }

    if (!email.endsWith('@stud.noroff.no')) {
      const fieldsContainer = form.querySelector('.register-fields');
      showErrorAfter(
        fieldsContainer,
        'Email must be a valid @stud.noroff.no address',
        'register'
      );
      return;
    }

    if (password.length < 8) {
      const fieldsContainer = form.querySelector('.register-fields');
      showErrorAfter(
        fieldsContainer,
        'Password must be at least 8 characters long',
        'register'
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';

    const loader = createLoader('Setting up your account...');
    fieldsContainer.insertAdjacentElement('afterend', loader);

    try {
      await register(name, email, password);

      loader.remove();

      const successDiv = document.createElement('div');
      successDiv.className =
        'p-4 text-sm text-center border rounded-lg bg-blue-slate-50 border-blue-slate-300 text-blue-slate-700';
      successDiv.textContent =
        'Account created successfully! Redirecting to login...';
      successDiv.setAttribute('role', 'status');
      fieldsContainer.insertAdjacentElement('afterend', successDiv);

      setTimeout(() => {
        window.location.href = './login.html';
      }, 2000);
    } catch (error) {
      loader.remove();

      const fieldsContainer = form.querySelector('.register-fields');
      showErrorAfter(
        fieldsContainer,
        error.message || 'Registration failed. Please try again.',
        'register'
      );

      submitButton.disabled = false;
      submitButton.textContent = 'Create account';
    }
  });

  container.appendChild(form);
  main.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
  createRegisterForm();
});
