import { createListing } from '../api/listings.js';
import { initializePage } from '../utils/main.js';
import { getUser } from '../utils/storage.js';
import { createBackButton } from '../components/backButton.js';

// Check if user is logged in
const user = getUser();
if (!user) {
  window.location.href = '/src/pages/login.html';
} else {
  initializePage();
  renderCreateListingForm();
}

/**
 * Renders the create listing form
 */
function renderCreateListingForm() {
  const main = document.querySelector('main');
  if (!main) return;

  const container = document.createElement('div');
  container.className = 'max-w-[800px] mx-auto px-[10%] py-8 md:px-4';

  const backButton = createBackButton();
  backButton.className += ' mb-6';
  container.appendChild(backButton);

  const heading = document.createElement('h1');
  heading.className =
    'mb-8 text-3xl font-semibold text-blue-slate-900 font-display';
  heading.textContent = 'Create New Auction';
  container.appendChild(heading);

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-6';

  const titleGroup = createFormGroup(
    'title',
    'Title',
    'input',
    'Enter auction title',
    true
  );
  form.appendChild(titleGroup);

  // -----------------------------------------------------------------Description field (optional)
  const descriptionGroup = createFormGroup(
    'description',
    'Description',
    'textarea',
    'Describe your item...',
    false
  );
  form.appendChild(descriptionGroup);

  // ------------------------------------------------------------------------End date field (required)
  const endDateGroup = createEndDateField();
  form.appendChild(endDateGroup);

  const tagsSection = createTagsSection();
  form.appendChild(tagsSection);

  const mediaSection = createMediaSection();
  form.appendChild(mediaSection);

  const errorContainer = document.createElement('div');
  errorContainer.id = 'form-error';
  errorContainer.className = 'hidden';
  form.appendChild(errorContainer);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className =
    'w-full px-6 py-3 mt-4 font-semibold text-white transition-all rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  submitButton.textContent = 'Create Auction';
  form.appendChild(submitButton);

  form.addEventListener('submit', handleFormSubmit);

  container.appendChild(form);
  main.appendChild(container);
}

/**
 * Creates a form group with label and input
 */
function createFormGroup(id, label, type, placeholder, required) {
  const group = document.createElement('div');
  group.className = 'flex flex-col gap-2';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.className = 'text-sm font-semibold text-blue-slate-900';
  labelEl.textContent = label + (required ? ' *' : '');
  group.appendChild(labelEl);

  let input;
  if (type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 5;
  } else {
    input = document.createElement('input');
    input.type = type;
  }

  input.id = id;
  input.name = id;
  input.placeholder = placeholder;
  input.required = required;
  input.className =
    'p-3 border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';

  group.appendChild(input);
  return group;
}

/**
 * Creates the end date field with validation
 */
function createEndDateField() {
  const group = document.createElement('div');
  group.className = 'flex flex-col gap-2';

  const label = document.createElement('label');
  label.htmlFor = 'endsAt';
  label.className = 'text-sm font-semibold text-blue-slate-900';
  label.textContent = 'End Date & Time *';
  group.appendChild(label);

  const input = document.createElement('input');
  input.type = 'datetime-local';
  input.id = 'endsAt';
  input.name = 'endsAt';
  input.required = true;
  input.className =
    'p-3 border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';

  // ----------------------------------------------------------------- Set min to current tidspunkt
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  input.min = now.toISOString().slice(0, 16);

  const hint = document.createElement('span');
  hint.className = 'text-xs text-cool-steel-600';
  hint.textContent = 'Auction must end in the future';
  group.appendChild(input);
  group.appendChild(hint);

  return group;
}

/**
 * Creates the tags section with add/remove functionality
 */
function createTagsSection() {
  const section = document.createElement('div');
  section.className = 'flex flex-col gap-2';

  const label = document.createElement('label');
  label.className = 'text-sm font-semibold text-blue-slate-900';
  label.textContent = 'Tags (Optional)';
  section.appendChild(label);

  const inputContainer = document.createElement('div');
  inputContainer.className = 'flex gap-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'tag-input';
  input.placeholder = 'Enter a tag';
  input.className =
    'flex-1 p-3 border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  inputContainer.appendChild(input);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className =
    'px-4 py-3 font-semibold text-white transition-all rounded-lg bg-blue-slate-600 hover:bg-blue-slate-700';
  addButton.textContent = 'Add';
  addButton.addEventListener('click', () => addTag(input));
  inputContainer.appendChild(addButton);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    }
  });

  section.appendChild(inputContainer);

  const tagsDisplay = document.createElement('div');
  tagsDisplay.id = 'tags-display';
  tagsDisplay.className = 'flex flex-wrap gap-2 mt-2';
  section.appendChild(tagsDisplay);

  return section;
}

/**
 * Adds a tag to the display
 */
function addTag(input) {
  const tagValue = input.value.trim();
  if (!tagValue) return;

  const tagsDisplay = document.getElementById('tags-display');
  const existingTags = Array.from(tagsDisplay.children).map(
    (tag) => tag.dataset.value
  );

  if (existingTags.includes(tagValue)) {
    return;
  }

  const tag = document.createElement('div');
  tag.className =
    'flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-slate-100 text-blue-slate-700';
  tag.dataset.value = tagValue;

  const tagText = document.createElement('span');
  tagText.textContent = tagValue;
  tag.appendChild(tagText);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className =
    'transition-colors text-blue-slate-700 hover:text-blue-slate-900';
  removeButton.textContent = '×';
  removeButton.addEventListener('click', () => tag.remove());
  tag.appendChild(removeButton);

  tagsDisplay.appendChild(tag);
  input.value = '';
}

/**
 * -------Creates the media section with add/remove functionality hopefully :D
 */
function createMediaSection() {
  const section = document.createElement('div');
  section.className = 'flex flex-col gap-2';

  const label = document.createElement('label');
  label.className = 'text-sm font-semibold text-blue-slate-900';
  label.textContent = 'Images (Optional)';
  section.appendChild(label);

  const mediaList = document.createElement('div');
  mediaList.id = 'media-list';
  mediaList.className = 'flex flex-col gap-3';
  section.appendChild(mediaList);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className =
    'px-4 py-2 font-semibold transition-all border rounded-lg text-blue-slate-700 border-blue-slate-300 hover:bg-blue-slate-50';
  addButton.textContent = '+ Add Image';
  addButton.addEventListener('click', () => addMediaField(mediaList));
  section.appendChild(addButton);

  //  --------------------------------------------------- Add one media field by default (TEST!)
  addMediaField(mediaList);

  return section;
}

/**
 * Adds a media input field
 * @param {HTMLElement} mediaList - The media list container (optional, will lookup if not provided)
 */
function addMediaField(mediaList) {
  if (!mediaList) {
    mediaList = document.getElementById('media-list');
  }

  const mediaItem = document.createElement('div');
  mediaItem.className =
    'flex flex-col gap-2 p-4 border rounded-lg border-cool-steel-200 bg-cool-steel-50';

  const urlInput = document.createElement('input');
  urlInput.type = 'url';
  urlInput.placeholder = 'Image URL (https://...)';
  urlInput.className =
    'p-2 bg-white border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  mediaItem.appendChild(urlInput);

  const altInput = document.createElement('input');
  altInput.type = 'text';
  altInput.placeholder = 'Alt text (optional)';
  altInput.className =
    'p-2 bg-white border rounded-lg border-cool-steel-300 text-blue-slate-900 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
  mediaItem.appendChild(altInput);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className =
    'px-3 py-1 text-sm font-semibold transition-all rounded-lg text-petal-frost-700 hover:bg-petal-frost-100';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => mediaItem.remove());
  mediaItem.appendChild(removeButton);

  mediaList.appendChild(mediaItem);
}

/**
 * Handles form submission
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const errorContainer = document.getElementById('form-error');

  errorContainer.className = 'hidden';
  errorContainer.textContent = '';

  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const endsAt = form.endsAt.value;

  const tagsDisplay = document.getElementById('tags-display');
  const tags = Array.from(tagsDisplay.children).map((tag) => tag.dataset.value);

  const mediaList = document.getElementById('media-list');
  const mediaItems = Array.from(mediaList.children);
  const media = mediaItems
    .map((item) => {
      const urlInput = item.querySelector('input[type="url"]');
      const altInput = item.querySelector('input[type="text"]');
      const url = urlInput?.value.trim();
      const alt = altInput?.value.trim();

      if (url) {
        return { url, alt: alt || '' };
      }
      return null;
    })
    .filter((item) => item !== null);

  const endDate = new Date(endsAt);
  if (endDate <= new Date()) {
    showError('End date must be in the future');
    return;
  }

  const listingData = {
    title,
    endsAt: endDate.toISOString(),
  };

  if (description) {
    listingData.description = description;
  }

  if (tags.length > 0) {
    listingData.tags = tags;
  }

  if (media.length > 0) {
    listingData.media = media;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Creating...';

    const response = await createListing(listingData);

    // --------------------------------------------------------------------  Redirect to the newly created listing
    if (response.data?.id) {
      window.location.href = `/src/pages/listing-detail.html?id=${response.data.id}`;
    } else {
      window.location.href = '/src/pages/listings.html';
    }
  } catch (error) {
    console.error('Error creating listing:', error);
    showError(error.message || 'Failed to create auction. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = 'Create Auction';
  }
}

/**
 * Shows an error message
 */
function showError(message) {
  const errorContainer = document.getElementById('form-error');
  errorContainer.className =
    'p-3 text-sm border rounded-lg text-petal-frost-700 border-petal-frost-300 bg-petal-frost-50';
  errorContainer.textContent = message;
}
