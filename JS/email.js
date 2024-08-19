const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const getSavedEmail = () => {
  const email = JSON.parse(localStorage.getItem("email"));
  return email;
};

const putEmail = (email) => {
  let newEmails = JSON.parse(localStorage.getItem("email"));
  if (!newEmails) {
    newEmails = [email];
    localStorage.setItem("email", JSON.stringify([email]));
  } else {
    newEmails.push(email);
    localStorage.setItem("email", JSON.stringify(newEmails));
  }

  return newEmails;
};

const getLogInEmail = () => {
  const email = localStorage.getItem("emailLogin");
  return email;
};

const putLogInEmail = (email) => {
  const savedEmail = getSavedEmail();
  if (!savedEmail) return false;
  if (savedEmail.includes(email)) {
    localStorage.setItem("emailLogin", email);
    return true;
  } else {
    return false;
  }
};

const isLogged = () => {
  const email = getLogInEmail();
  if (email) {
    return true;
  } else {
    return false;
  }
};
