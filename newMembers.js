const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const loadSavedEmail = () => {
    const email = JSON.parse(localStorage.getItem("email"));
    const savedEmail = document.getElementById("saved-email");
    if (email) {
        savedEmail.value = email;
    }
    else {
        savedEmail.value = [];
    }
};

loadSavedEmail();

const saveEmail = (email) => {
    let newEmails = JSON.parse(localStorage.getItem("email"));
    if(!newEmails) {
        newEmails = [email];
        localStorage.setItem("email", JSON.stringify([email]));
    }
    else {
        newEmails.push(email);
        localStorage.setItem("email", JSON.stringify(newEmails));
    }
    const  savedEmail = document.getElementById("saved-email");
    savedEmail.value = email;
    return email;
};

function validateForm(event) {
    event.preventDefault();
    event.stopPropagation();
    const email = document.getElementById("email");
    const emailValue = email.value;
    const savedEmailValue = document.getElementById("saved-email").value;
    const testRegex = EMAIL_REGEX.test(emailValue);
    const testSaved = savedEmailValue.includes(emailValue);
    if (testRegex && !testSaved) {
        saveEmail(emailValue);
        window.location.href = "/saisie.html";
        return true;
    } else {
        const emailMessage = document.getElementById("email-message");
        if(!testRegex) {
            emailMessage.classList.add("invalid");
            emailMessage.innerHTML = "Please enter a valid email";
        }else if(testSaved) {
            emailMessage.classList.add("invalid");
            emailMessage.innerHTML = "You already joined the club";
        }
    }
};