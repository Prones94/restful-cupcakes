import { CupcakeAPI } from './api.js';

// Initialize the CupcakeAPI instance
const cupcakeAPI = new CupcakeAPI('/api');

// jQuery: Handle the form submission for adding a new cupcake
$(document).ready(function() {
  $('#new-cupcake-form').on('submit', async function(evt) {
    evt.preventDefault();  // Prevent the default form submission behavior

    // Get form data
    const flavor = $('#flavor').val();
    const size = $('#size').val();
    const rating = $('#rating').val();
    const image = $('#image').val() || 'https://tinyurl.com/demo-cupcake';  // Default image if none is provided

    // Use the API to create a new cupcake
    try {
      const newCupcake = await cupcakeAPI.createCupcake({ flavor, size, rating, image });

      // Redirect to the main cupcake list after successful creation
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating cupcake:', error);
    }
  });
});
