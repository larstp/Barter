/**
 * Reusable error display component
 * Provides consistent error messaging so we dont repeat too much
 */

/**
 * Shows an inline error message in a container
 * @param {HTMLElement} container - The container element to display the error in
 * @param {string} message - The error message
 * @param {Object} options - Options for displayingg
 * @param {string} options.position - 'prepend' or 'append' ('prepend' IS DEFAULT)
 * @param {string} options.id - Custom ID for the error element
 * @returns {HTMLElement} The error element
 */
export function showError(container, message, options = {}) {
  const { position = 'prepend', id = 'error-message' } = options;

  const existingError = container.querySelector(`[data-error-id="${id}"]`);
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className =
    'px-4 py-3 text-sm border rounded-lg bg-petal-frost-50 border-petal-frost-300 text-petal-frost-700';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('data-error-id', id);

  if (position === 'prepend') {
    container.prepend(errorDiv);
  } else {
    container.appendChild(errorDiv);
  }

  return errorDiv;
}

/**
 * Shows an error message after a specific element (useful for forms)
 * @param {HTMLElement} element - The element to insert the error after
 * @param {string} message - The error message
 * @param {string} id - Custom ID for the error element
 * @returns {HTMLElement} The error element
 */
export function showErrorAfter(element, message, id = 'form-error') {
  const existingError = element.parentElement?.querySelector(
    `[data-error-id="${id}"]`
  );
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className =
    'p-4 text-sm text-center border rounded-lg bg-petal-frost-50 border-petal-frost-300 text-petal-frost-700';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('data-error-id', id);

  element.insertAdjacentElement('afterend', errorDiv);

  return errorDiv;
}

/**
 * Shows an error message in a specific container by ID
 * Useful for pre-defined error containers in forms
 * @param {string} containerId - The ID of the container element
 * @param {string} message - The error message
 * @returns {HTMLElement|null} The container element, or null if not found
 */
export function showErrorInContainer(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Error container with ID "${containerId}" not found`);
    return null;
  }

  container.className =
    'p-3 text-sm border rounded-lg text-petal-frost-700 border-petal-frost-300 bg-petal-frost-50';
  container.textContent = message;
  container.setAttribute('role', 'alert');

  return container;
}

/**
 * Clears an error message from a container
 * @param {HTMLElement} container - The container element
 * @param {string} id - The error ID to remove
 */
export function clearError(container, id = 'error-message') {
  const errorElement = container.querySelector(`[data-error-id="${id}"]`);
  if (errorElement) {
    errorElement.remove();
  }
}

// This has to be here because of ONE annoying edge case

/**
 * Clears an error from a container by ID
 * @param {string} containerId - The ID of the container element
 */
export function clearErrorFromContainer(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.className = 'hidden';
    container.textContent = '';
    container.removeAttribute('role');
  }
}
