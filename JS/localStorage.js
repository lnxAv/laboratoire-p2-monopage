const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function getSavedEmail() {
  const email = JSON.parse(window.localStorage.getItem("email"));
  console.log(window.localStorage);
  return email;
}

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

function getLogInEmail() {
  const email = JSON.parse(window.localStorage.getItem("emailLogin"));
  return email;
}

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

function isLogged() {
  const email = getLogInEmail();
  if (email) {
    return true;
  } else {
    return false;
  }
}

function getUser() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  return user;
}

function putUser(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}
