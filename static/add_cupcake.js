$(document).ready(function() {
  $('#new-cupcake-form').on('submit', async function(evt) {
      evt.preventDefault();

      const flavor = $('#flavor').val();
      const size = $('#size').val();
      const rating = $('#rating').val();
      const image = $('#image').val() || 'https://tinyurl.com/demo-cupcake';

      // Create a new cupcake using the API
      const newCupcake = await CupcakeAPI.createCupcake({ flavor, size, rating, image });

      // Redirect back to the cupcake list
      window.location.href = '/';
  });
});
