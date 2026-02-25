// had help from claude here regarding correct image import. its a bit more complex than i expected when taking linked images from api

/**
 * Creates an image carousel component
 * @param {Array} mediaArray - Array of media objects with url and alt properties
 * @param {string} fallbackTitle - Fallback title for alt text
 * @returns {HTMLDivElement} The carousel container
 *
 * @description
 * Creates a responsive image carousel with:
 * - Left/right navigation arrows
 * - Dot indicators for each image
 * - Keyboard navigation (arrow keys)
 * - Automatic fallback to placeholder if no images
 */
export function createImageCarousel(mediaArray, fallbackTitle = 'Image') {
  const container = document.createElement('div');
  container.className = 'relative flex flex-col gap-4';

  const validMedia = mediaArray?.filter((item) => item?.url) || [];

  // -------------------------------------------------------- placeholder
  if (validMedia.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className =
      'flex items-center justify-center w-full rounded-lg h-96 bg-cool-steel-100';
    const placeholderText = document.createElement('span');
    placeholderText.className = 'text-cool-steel-400';
    placeholderText.textContent = 'No image available';
    placeholder.appendChild(placeholderText);
    container.appendChild(placeholder);
    return container;
  }

  let currentIndex = 0;

  // Main image container
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'relative w-full overflow-hidden rounded-lg group';

  const mainImage = document.createElement('img');
  mainImage.src = validMedia[0].url;
  mainImage.alt = validMedia[0].alt || fallbackTitle;
  mainImage.className =
    'object-cover w-full transition-opacity duration-300 rounded-lg bg-cool-steel-100 aspect-square';
  imageWrapper.appendChild(mainImage);

  // Navigation arrows (only show if more than 1 image)
  if (validMedia.length > 1) {
    //------------------------------------------------------------------------- Left
    const leftArrow = document.createElement('button');
    leftArrow.type = 'button';
    leftArrow.className =
      'absolute p-2 transition-all -translate-y-1/2 rounded-full shadow-lg opacity-0 left-2 top-1/2 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-slate-500 group-hover:opacity-100';
    leftArrow.setAttribute('aria-label', 'Previous image');
    leftArrow.innerHTML =
      '<svg class="w-6 h-6 text-blue-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';

    // ------------------------------------------------------Right
    const rightArrow = document.createElement('button');
    rightArrow.type = 'button';
    rightArrow.className =
      'absolute p-2 transition-all -translate-y-1/2 rounded-full shadow-lg opacity-0 right-2 top-1/2 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-slate-500 group-hover:opacity-100';
    rightArrow.setAttribute('aria-label', 'Next image');
    rightArrow.innerHTML =
      '<svg class="w-6 h-6 text-blue-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';

    // -------------------------------------------------------- counter
    const counter = document.createElement('div');
    counter.className =
      'absolute px-3 py-1 text-sm font-medium text-white rounded-full top-2 right-2 bg-black/50 backdrop-blur-sm';
    counter.textContent = `1 / ${validMedia.length}`;

    imageWrapper.appendChild(leftArrow);
    imageWrapper.appendChild(rightArrow);
    imageWrapper.appendChild(counter);

    // Navigation
    // NB: had help from friend on this part. I wanted to implement smooth fade transition between images, and it turned out to be a bit more complex than i expected. The main challenge was to ensure that the new image is fully loaded before fading in, to avoid showing a blank space during the transition. To achieve this, I used a combination of CSS transitions and JavaScript event listeners to manage the image loading and opacity changes.
    function updateImage() {
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = validMedia[currentIndex].url;
        mainImage.alt = validMedia[currentIndex].alt || fallbackTitle;
        counter.textContent = `${currentIndex + 1} / ${validMedia.length}`;
        mainImage.style.opacity = '1';
        updateDots();
      }, 150);
    }

    function goToNext() {
      currentIndex = (currentIndex + 1) % validMedia.length;
      updateImage();
    }

    function goToPrevious() {
      currentIndex = (currentIndex - 1 + validMedia.length) % validMedia.length;
      updateImage();
    }

    leftArrow.addEventListener('click', goToPrevious);
    rightArrow.addEventListener('click', goToNext);

    //---------------------------------------------------------- Keyboard navigation (test)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    });

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'flex justify-center gap-2 mt-2';

    function updateDots() {
      dotsContainer.innerHTML = '';
      validMedia.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `w-2 h-2 rounded-full transition-all ${
          index === currentIndex
            ? 'bg-blue-slate-600 w-6'
            : 'bg-cool-steel-300 hover:bg-cool-steel-400'
        }`;
        dot.setAttribute('aria-label', `Go to image ${index + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateImage();
        });
        dotsContainer.appendChild(dot);
      });
    }

    updateDots();
    container.appendChild(imageWrapper);
    container.appendChild(dotsContainer);
  } else {
    container.appendChild(imageWrapper);
  }

  return container;
}
