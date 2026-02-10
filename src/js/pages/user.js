import { getProfile } from '../api/profile.js';
import { getUser } from '../utils/storage.js';
import { initializePage } from '../utils/main.js';

// Check if user is logged in, if not - straight to jail (login screen)
const user = getUser();
if (!user) {
  window.location.href = '/src/pages/login.html';
} else {
  initializePage();
}
