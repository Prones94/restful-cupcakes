// Ensure CupcakeAPI class is available in this file

class CupcakeAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Fetch all cupcakes
  async fetchAllCupcakes() {
    const response = await axios.get(`${this.baseURL}/cupcakes`);
    return response.data.cupcakes;
  }

  // Update a specific cupcake
  async updateCupcake(id, data) {
    const response = await axios.patch(`${this.baseURL}/cupcakes/${id}`, data);
    return response.data.cupcake;
  }
}

// Initialize CupcakeAPI with the correct base URL
const cupcakeAPI = new CupcakeAPI('/api');

// JavaScript for the update-cupcake.html page
$(document).ready(async function () {
  // Get the cupcake ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const cupcakeId = urlParams.get('id');

  if (!cupcakeId) {
    alert('No cupcake ID provided.');
    return;
  }

  // Fetch the cupcake data
  const cupcake = await cupcakeAPI.fetchAllCupcakes().then(cupcakes =>
    cupcakes.find(c => c.id == cupcakeId)
  );

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
  $('#update-cupcake-form').on('submit', async function (evt) {
    evt.preventDefault();

    const flavor = $('#update-flavor').val();
    const size = $('#update-size').val();
    const rating = $('#update-rating').val();
    const image = $('#update-image').val();

    // Send the update request
    await cupcakeAPI.updateCupcake(cupcakeId, { flavor, size, rating, image });

    // Redirect back to the cupcake list after updating
    window.location.href = '/';
  });
});
