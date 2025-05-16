// This function processes user data
function processUserData(user) {
    // Check if user is active
    if (user.status == "active") {
      console.log("Processing active user:", user.name); // Debug log
  
      // Assume user.preferences might be missing sometimes
      var theme = user.preferences.theme || 'default';
      console.log("User theme:", theme);
  
      sendEmailNotification(user.email, "Welcome back") // Missing semicolon
    }
    // What if status is not active?
  }
  
  function sendEmailNotification(email, subject) {
    // Dummy function
    console.log(`Sending email to ${email} with subject "${subject}"`);
  }
  
  processUserData({name: 'Charlie', status: 'active', preferences: {theme: 'dark'}});
  processUserData({name: 'David', status: 'inactive'}); // This call will cause an error inside the function
  
  var unusedVariable = 10; // Unused variable