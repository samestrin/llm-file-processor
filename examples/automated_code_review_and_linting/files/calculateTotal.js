function calculateTotal(items) {
    var total = 0;
    for (i = 0; i < items.length; i++) {
      total += items[i].price
    }
    console.log("Total:", total)
    return total;
  }
  
  const shoppingCart = [{name: 'Laptop', price: 1200}, {name: 'Mouse', price: 25}];
  calculateTotal(shoppingCart);