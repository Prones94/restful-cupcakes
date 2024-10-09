import { CupcakeAPI } from './api.js';

// Initialize the CupcakeAPI instance
const cupcakeAPI = new CupcakeAPI('/api');

// jQuery: Handle updating a cupcake
$(document).ready(async function() {
  // Get the cupcake ID from the URL
  const urlParams = new URLSearchParams(window.location.search);  // Parse the query parameters
  const cupcakeId = urlParams.get('id');  // Retrieve the 'id' parameter

  if (!cupcakeId) {
    alert('No cupcake ID provided.');
    return;
  }

  // Fetch the cupcake data using the cupcake ID
  const cupcakes = await cupcakeAPI.fetchAllCupcakes();
  const cupcake = cupcakes.find(c => c.id == cupcakeId);

  if (!cupcake) {
    alert('Cupcake not found.');
    return;
  }

  // Pre-fill the form with the current cupcake data
  $('#update-flavor').val(cupcake.flavor);
  $('#update-size').val(cupcake.size);
  $('#update-rating').val(cupcake.rating);
  $('#update-image').val(cupcake.image);

  // Handle the form submission to update the cupcake
  $('#update-cupcake-form').on('submit', async function(evt) {
    evt.preventDefault();

    const flavor = $('#update-flavor').val();
    const size = $('#update-size').val();
    const rating = $('#update-rating').val();
    const image = $('#update-image').val();

    // Send the update request
    try {
      await cupcakeAPI.updateCupcake(cupcakeId, { flavor, size, rating, image });
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating cupcake:', error);
    }
  });
});
