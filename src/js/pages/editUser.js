import { initializePage } from '../utils/main.js';
import { getProfile, updateProfile } from '../api/profile.js';
import { getUser, saveUser } from '../utils/storage.js';
import { createLoader } from '../components/loader.js';

initializePage({ includeLogoBackground: true });

/**
 * Displays the edit profile form
 * @returns {Promise<void>}
 */
async function displayEditProfile() {
  try {
    const main = document.querySelector('main');

    if (!main) {
      console.error('Main element not found');
      return;
    }

    const currentUser = getUser();

    if (!currentUser) {
      window.location.href =
        '/src/pages/login.html?redirect=/src/pages/editUser.html';
      return;
    }

    const loader = createLoader('Loading profile...');
    main.appendChild(loader);

    const profileData = await getProfile(currentUser.name);
    const profile = profileData.data;

    loader.remove();

    if (!profile) {
      showError(main, 'Profile not found');
      return;
    }

    const container = document.createElement('div');
    container.className = 'max-w-[600px] my-8 mx-auto px-4 py-0';

    const header = document.createElement('h1');
    header.className =
      'mb-8 text-3xl font-semibold text-center text-blue-slate-900';
    header.textContent = 'Edit Profile';
    container.appendChild(header);

    const form = document.createElement('form');
    form.className = 'flex flex-col gap-4';
    form.setAttribute('aria-label', 'Edit profile form');

    const bioLabel = document.createElement('label');
    bioLabel.className = 'block mb-2 text-sm font-semibold text-blue-slate-800';
    bioLabel.textContent = 'Bio';
    bioLabel.setAttribute('for', 'bio');
    form.appendChild(bioLabel);

    const bioTextarea = document.createElement('textarea');
    bioTextarea.id = 'bio';
    bioTextarea.name = 'bio';
    bioTextarea.className =
      'w-full p-4 bg-white border border-cool-steel-300 rounded-lg text-blue-slate-900 text-base transition-all duration-300 placeholder:text-cool-steel-500 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200 resize-y min-h-[100px]';
    bioTextarea.placeholder = 'Tell us about yourself...';
    bioTextarea.value = profile.bio || '';
    bioTextarea.setAttribute('aria-label', 'Bio');
    bioTextarea.rows = 4;
    form.appendChild(bioTextarea);

    const avatarLabel = document.createElement('label');
    avatarLabel.className =
      'block mb-2 text-sm font-semibold text-blue-slate-800';
    avatarLabel.textContent = 'Avatar URL (optional)';
    avatarLabel.setAttribute('for', 'avatar');
    form.appendChild(avatarLabel);

    const avatarInput = document.createElement('input');
    avatarInput.type = 'url';
    avatarInput.id = 'avatar';
    avatarInput.name = 'avatar';
    avatarInput.className =
      'w-full p-4 text-base transition-all duration-300 bg-white border rounded-lg border-cool-steel-300 text-blue-slate-900 placeholder:text-cool-steel-500 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
    avatarInput.placeholder = 'https://example.com/avatar.jpg';
    avatarInput.value = profile.avatar?.url || '';
    avatarInput.setAttribute('aria-label', 'Avatar URL');
    form.appendChild(avatarInput);

    const bannerLabel = document.createElement('label');
    bannerLabel.className =
      'block mb-2 text-sm font-semibold text-blue-slate-800';
    bannerLabel.textContent = 'Banner URL (optional)';
    bannerLabel.setAttribute('for', 'banner');
    form.appendChild(bannerLabel);

    const bannerInput = document.createElement('input');
    bannerInput.type = 'url';
    bannerInput.id = 'banner';
    bannerInput.name = 'banner';
    bannerInput.className =
      'w-full p-4 text-base transition-all duration-300 bg-white border rounded-lg border-cool-steel-300 text-blue-slate-900 placeholder:text-cool-steel-500 focus:outline-none focus:border-blue-slate-500 focus:ring-2 focus:ring-blue-slate-200';
    bannerInput.placeholder = 'https://example.com/banner.jpg';
    bannerInput.value = profile.banner?.url || '';
    bannerInput.setAttribute('aria-label', 'Banner URL');
    form.appendChild(bannerInput);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'flex gap-4 mt-4';

    const cancelButton = document.createElement('a');
    cancelButton.href = '/src/pages/user.html';
    cancelButton.className =
      'flex-1 p-4 bg-white text-blue-slate-800 border border-cool-steel-300 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center no-underline hover:bg-petal-frost-600 hover:text-white hover:border-petal-frost-600 hover:-translate-y-0.5 active:translate-y-0';
    cancelButton.textContent = 'Cancel';
    buttonsContainer.appendChild(cancelButton);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className =
      'flex-1 p-4 bg-blue-slate-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 inline-block text-center hover:bg-blue-slate-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    submitButton.textContent = 'Save Changes';
    buttonsContainer.appendChild(submitButton);

    form.appendChild(buttonsContainer);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const existingError = form.querySelector("[data-error='edit-profile']");
      if (existingError) {
        existingError.remove();
      }

      const bio = bioTextarea.value.trim();
      const avatarUrl = avatarInput.value.trim();
      const bannerUrl = bannerInput.value.trim();

      try {
        const updateLoader = createLoader('Updating profile...');
        form.appendChild(updateLoader);
        submitButton.disabled = true;

        const updateData = {};

        if (bio !== profile.bio) {
          updateData.bio = bio;
        }

        if (avatarUrl && avatarUrl !== profile.avatar?.url) {
          updateData.avatar = {
            url: avatarUrl,
            alt: `${currentUser.name}'s profile picture`,
          };
        } else if (!avatarUrl && profile.avatar?.url) {
          updateData.avatar = null;
        }

        if (bannerUrl && bannerUrl !== profile.banner?.url) {
          updateData.banner = {
            url: bannerUrl,
            alt: `${currentUser.name}'s banner`,
          };
        } else if (!bannerUrl && profile.banner?.url) {
          updateData.banner = null;
        }

        if (Object.keys(updateData).length > 0) {
          await updateProfile(currentUser.name, updateData);

          const updatedProfileResponse = await getProfile(currentUser.name);
          const updatedProfile = updatedProfileResponse.data;

          // -------------------------------------------------------- Merge with existing user data and save. Needs TESTING
          const remember = localStorage.getItem('token') ? true : false;
          const updatedUser = {
            ...currentUser,
            avatar: updatedProfile.avatar,
            banner: updatedProfile.banner,
            bio: updatedProfile.bio,
          };
          saveUser(updatedUser, remember);
        }

        updateLoader.remove();

        window.location.href = '/src/pages/user.html';
      } catch (error) {
        console.error('Error updating profile:', error);
        const updateLoader = form.querySelector('.loader-container');
        if (updateLoader) {
          updateLoader.remove();
        }
        submitButton.disabled = false;
        showFormError(form, 'Failed to update profile. Please try again.');
      }
    });

    container.appendChild(form);
    main.appendChild(container);
  } catch (error) {
    console.error('Error displaying edit profile:', error);
    const main = document.querySelector('main');
    if (main) {
      showError(main, 'Failed to load edit profile. Please try again.');
    }
  }
}

/**
 * Shows an error message in the main container
 * @param {HTMLElement} container - The container element
 * @param {string} message - The error message
 */
function showError(container, message) {
  const error = document.createElement('div');
  error.className = 'px-4 py-12 text-center text-red-600';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Shows an error message in the form
 * @param {HTMLElement} form - The form element
 * @param {string} message - The error message
 */
function showFormError(form, message) {
  const error = document.createElement('div');
  error.className =
    'p-4 mb-4 text-red-600 border border-red-200 rounded-lg bg-red-50';
  error.setAttribute('role', 'alert');
  error.setAttribute('data-error', 'edit-profile');
  error.textContent = message;
  form.insertBefore(error, form.firstChild);
}

displayEditProfile();
