// This function checks if a user is an admin
function isAdmin(user) {
    if (user.role == 'admin') {
      return true;
    } else {
      return false;
    }
  }
  
  const user1 = {name: 'Alice', role: 'user'};
  const user2 = {name: 'Bob', role: 'admin'};
  
  console.log(isAdmin(user1))
  console.log(isAdmin(user2))
  
  var apiKey = "sk-12345"; // Example API Key - should probably be in env vars