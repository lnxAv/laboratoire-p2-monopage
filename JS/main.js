window.onscroll = function () {
  updateSticky();
};

var header = document.getElementById("header");
var sticky = header.offsetTop;

// updateSticky() : updates the sticky class
function updateSticky() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

// goToMenu() : go to href index.html
const goToMenu = () => {
  window.location.href = "index.html";
};

// goToNewMember() : go to href newMembers.html
const goToNewMember = () => {
  window.location.href = "newMembers.html";
};

//  goToSaisie() : go to href saisie.html
const goToSaisie = () => {
  window.location.href = "saisie.html";
};
