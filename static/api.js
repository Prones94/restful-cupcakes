export class CupcakeAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Method to fetch all cupcakes
  async fetchAllCupcakes() {
    const response = await axios.get(`${this.baseURL}/cupcakes`);
    return response.data.cupcakes;
  }

  // Method to create a new cupcake
  async createCupcake(data) {
    const response = await axios.post(`${this.baseURL}/cupcakes`, data);
    return response.data.cupcake;
  }

  // Method to update an existing cupcake
  async updateCupcake(id, data) {
    const response = await axios.patch(`${this.baseURL}/cupcakes/${id}`, data);
    return response.data.cupcake;
  }

  // Method to delete a cupcake
  async deleteCupcake(id) {
    const response = await axios.delete(`${this.baseURL}/cupcakes/${id}`);
    return response.data.message;
  }
}
