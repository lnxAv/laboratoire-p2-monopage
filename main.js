window.onscroll = function () {
  myFunction();
};

var header = document.getElementById("header");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

const goToMenu = () => {
  window.location.href = "index.html";
};

const goToNewMember = () => {
  window.location.href = "newMember.html";
};

const goToSaisie = () => {
  window.location.href = "saisie.html";
};
