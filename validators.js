// Just assuming this name is a single name with only letters
module.exports.validateName = (name) => /^[a-zA-Z]+$/.test(name);

// This regex verifies an email is properly formatted
module.exports.validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// If we want to, we can get really fancy here and check for different rules
// I'm just checking the password is long enough
module.exports.validatePassword = (password) => password.length >= 6;