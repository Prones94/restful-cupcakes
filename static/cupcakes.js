import { CupcakeAPI } from './api.js'

// Initialize the CupcakeAPI with the correct base URL
const cupcakeAPI = new CupcakeAPI('/api');

// Function to generate HTML for each cupcake
function generateCupcakeHTML(cupcake) {
  return `
      <li data-id="${cupcake.id}">
          ${cupcake.flavor} (${cupcake.size}) - Rating: ${cupcake.rating}
          <img src="${cupcake.image}" alt="Cupcake Image" width="100">
          <button class="delete-cupcake">Delete</button>
          <a href="/cupcakes/update?id=${cupcake.id}">
          <button class="update-cupcake">Update</button>
        </a>
      </li>
  `;
}

// Function to display all cupcakes on the page
async function displayAllCupcakes() {
  const cupcakes = await cupcakeAPI.fetchAllCupcakes();  // Use the instance method
  console.log(cupcakes);
  $('#cupcake-list').empty();  // Clear the list before appending
  for (let cupcake of cupcakes) {
    $('#cupcake-list').append(generateCupcakeHTML(cupcake));
  }
}

// Function to handle form submission and adding a new cupcake
async function handleFormSubmit(evt) {
  evt.preventDefault();

  // Get form data
  const flavor = $('#flavor').val();
  const size = $('#size').val();
  const rating = $('#rating').val();
  const image = $('#image').val() || 'https://tinyurl.com/demo-cupcake';

  // Create a new cupcake through the API using the instance method
  const newCupcake = await cupcakeAPI.createCupcake({ flavor, size, rating, image });  // Use the instance method

  // Add the new cupcake to the page
  $('#cupcake-list').append(generateCupcakeHTML(newCupcake));

  // Reset the form
  $('#new-cupcake-form').trigger('reset');
}

function showUpdateForm(cupcake) {
  return `
    <form class="update-cupcake-form">
      <input type="hidden" name="cupcake-id" value="${cupcake.id}">
      <label for="update-flavor">Flavor:</label>
      <input type="text" id="update-flavor-${cupcake.id}" name="flavor" value="${cupcake.flavor}">
      <label for="update-size">Size:</label>
      <input type="text" id="update-size-${cupcake.id}" name="size" value="${cupcake.size}">
      <label for="update-rating">Rating:</label>
      <input type="number" id="update-rating-${cupcake.id}" name="rating" step="0.1" value="${cupcake.rating}">
      <label for="update-image">Image URL:</label>
      <input type="text" id="update-image-${cupcake.id}" name="image" value="${cupcake.image}">
      <button type="submit">Submit Update</button>
    </form>
  `;
}

// Function to handle the "Update" button click and display the form
async function handleUpdateButtonClick(evt) {
  console.log('Update button clicked');
  const $cupcake = $(evt.target).closest('li');
  const cupcakeId = $cupcake.data('id');

  // Fetch current cupcake details
  const cupcakes = await cupcakeAPI.fetchAllCupcakes();  // Use the instance method
  const cupcake = cupcakes.find(c => c.id === cupcakeId);

  // Show the update form for the selected cupcake
  $cupcake.append(showUpdateForm(cupcake));

  // Handle form submission for updating the cupcake
  $cupcake.on('submit', '.update-cupcake-form', async function (evt) {
    evt.preventDefault();

    const flavor = $(`#update-flavor-${cupcake.id}`).val();
    const size = $(`#update-size-${cupcake.id}`).val();
    const rating = $(`#update-rating-${cupcake.id}`).val();
    const image = $(`#update-image-${cupcake.id}`).val();

    // Send the update request to the API
    const updatedCupcake = await cupcakeAPI.updateCupcake(cupcakeId, {  // Use the instance method
      flavor,
      size,
      rating,
      image
    });

    // Replace the old cupcake HTML with the updated details
    $cupcake.html(generateCupcakeHTML(updatedCupcake));
  });
}

// Function to handle deleting a cupcake
async function handleDeleteCupcake(evt) {
  const $cupcake = $(evt.target).closest('li');
  const cupcakeId = $cupcake.data('id');

  // Delete the cupcake using the instance method
  const message = await cupcakeAPI.deleteCupcake(cupcakeId);  // Use the instance method
  console.log(message);  // 'Deleted'

  // Remove cupcake from the DOM
  $cupcake.remove();
}

// On document ready
$(document).ready(function () {
  // Display all cupcakes on page load
  displayAllCupcakes();

  // Handle form submission to add a new cupcake
  $('#new-cupcake-form').on('submit', handleFormSubmit);

  // Handle deleting a cupcake
  $('#cupcake-list').on('click', '.delete-cupcake', handleDeleteCupcake);

  // Handle updating a cupcake
  $('#cupcake-list').on('click', '.update-cupcake', handleUpdateButtonClick);
});
