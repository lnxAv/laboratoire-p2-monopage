const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// getSavedEmail() : returns the saved email in localStorage
function getSavedEmail() {
  const email = JSON.parse(window.localStorage.getItem("email"));
  console.log(window.localStorage);
  return email;
}

// putEmail(email) : saves the email in localStorage
function putEmail(email) {
  let newEmails = JSON.parse(window.localStorage.getItem("email"));
  if (!newEmails) {
    newEmails = [email];
    window.localStorage.setItem("email", JSON.stringify([email]));
  } else {
    newEmails.push(email);
    window.localStorage.setItem("email", JSON.stringify(newEmails));
  }

  return newEmails;
}

// getLogInEmail() : returns the email saved in localStorage for login
function getLogInEmail() {
  const email = JSON.parse(window.localStorage.getItem("emailLogin"));
  return email;
}

// putLogInEmail(email) : saves the email in localStorage for login
function putLogInEmail(email) {
  const savedEmail = getSavedEmail();
  if (!savedEmail) return false;
  if (savedEmail.includes(email)) {
    window.localStorage.setItem("emailLogin", JSON.stringify(email));
    return true;
  } else {
    return false;
  }
}

// isLogged() : returns true if the user is logged in, false otherwise
function isLogged() {
  const email = getLogInEmail();
  if (email) {
    return true;
  } else {
    return false;
  }
}

// getUser() : returns the user object
function getUser() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  return user;
}

// putUser(user) : saves the user object
function putUser(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}
