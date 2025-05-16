
/**
 * @file inventoryService.js
 * @description  Manages a simple product inventory
 */

// In-memory storage for demonstration purposes
// In a real application, this would interact with a database
const inventory = [
    { id: 'prod-1', name: 'Laptop', stock: 10, price: 1200 },
    { id: 'prod-2', name: 'Mouse', stock: 50, price: 25 },
    { id: 'prod-3', name: 'Keyboard', stock: 5, price: 75 },
  ];
  
  /**
   * Finds a product in the inventory by its ID.
   * @param {string} productId The ID of the product to find.
   * @returns {object | undefined} The product object if found, otherwise undefined.
   */
  function getProductById(productId) {
    if (typeof productId !== 'string' || productId.trim() === '') {
      // Could throw an error, or return undefined/null depending on desired behavior
      // Let's return undefined for invalid ID format for this example
      return undefined;
    }
    return inventory.find(product => product.id === productId);
  }
  
  /**
   * Checks if a product is in stock and has sufficient quantity.
   * @param {string} productId The ID of the product.
   * @param {number} quantity The desired quantity.
   * @returns {boolean} True if in stock with sufficient quantity, false otherwise.
   * @throws {Error} If productId is invalid or product not found.
   */
  function isProductInStock(productId, quantity) {
    if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
       throw new Error('Quantity must be a positive integer.');
    }
  
    const product = getProductById(productId);
  
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
  
    return product.stock >= quantity;
  }
  
  /**
   * Decreases the stock of a product after a successful purchase.
   * (Dummy implementation - simulates updating stock)
   * @param {string} productId The ID of the product.
   * @param {number} quantity The quantity purchased.
   * @returns {object} The updated product object.
   * @throws {Error} If product not found, quantity is invalid, or insufficient stock.
   */
  function decreaseStock(productId, quantity) {
     if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
       throw new Error('Quantity must be a positive integer.');
    }
  
    const product = getProductById(productId);
  
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
  
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product ${productId}. Available: ${product.stock}, Requested: ${quantity}.`);
    }
  
    // Simulate updating stock (in-memory only)
    product.stock -= quantity;
  
    // In a real app, this would involve a database update
    console.log(`Simulating stock update for ${productId}: new stock is ${product.stock}`);
  
    return product; // Return the updated product
  }
  
  /**
   * Calculates the total price for a list of items from the inventory.
   * @param {Array<{productId: string, quantity: number}>} items An array of items with product ID and quantity.
   * @returns {number} The total price.
   * @throws {Error} If items is not an array, a product is not found, or quantity is invalid/out of stock.
   */
  function calculateItemsTotal(items) {
      if (!Array.isArray(items)) {
          throw new TypeError('Input must be an array of items.');
      }
  
      let total = 0;
      for (const item of items) {
          if (!item || typeof item.productId !== 'string' || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
               throw new Error('Invalid item format in list.');
          }
  
          const product = getProductById(item.productId);
          if (!product) {
              throw new Error(`Product with ID ${item.productId} not found in inventory.`);
          }
  
          // We might want to check stock here too, depending on workflow
          // For this example, let's assume stock check happens elsewhere (e.g., before calling this)
          // Or modify this to throw if stock is insufficient for the quantity requested
           if (product.stock < item.quantity) {
               throw new Error(`Insufficient stock for product ${item.productId} (requested quantity ${item.quantity}).`);
           }
  
  
          total += product.price * item.quantity;
      }
      return total;
  }
  
  
  module.exports = {
    getProductById,
    isProductInStock,
    decreaseStock,
    calculateItemsTotal,
    // Expose inventory for potential direct checks in tests if needed,
    // but testing via functions is preferred.
    // inventory // <-- Uncomment with caution, can lead to less isolated tests
  };