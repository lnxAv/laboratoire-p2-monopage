const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function getSavedEmail() {
  const email = JSON.parse(localStorage.getItem("email"));
  return email;
}

function putEmail(email) {
  let newEmails = JSON.parse(localStorage.getItem("email"));
  if (!newEmails) {
    newEmails = [email];
    localStorage.setItem("email", JSON.stringify([email]));
  } else {
    newEmails.push(email);
    localStorage.setItem("email", JSON.stringify(newEmails));
  }

  return newEmails;
}

function getLogInEmail() {
  const email = localStorage.getItem("emailLogin");
  return email;
}

function putLogInEmail(email) {
  const savedEmail = getSavedEmail();
  if (!savedEmail) return false;
  if (savedEmail.includes(email)) {
    localStorage.setItem("emailLogin", email);
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
