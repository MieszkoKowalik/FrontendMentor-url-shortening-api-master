export default class Menu {
  constructor() {
    this.button = document.querySelector(".hamburger");
    this.menu = document.querySelector(".header__menu-list-container");
    this.isExpanded = false;
    this.overlay = document.querySelector(".overlay");
    this.initEventListeners();
  }

  initEventListeners() {
    this.button.addEventListener("click", this.toggleState.bind(this));
    this.overlay.addEventListener("click", this.toggleState.bind(this));
  }

  toggleState() {
    this.menu.classList.toggle("header__menu-list-container--active");
    this.button.classList.toggle("hamburger--active");
    this.button.setAttribute(
      "aria-expanded",
      (this.isExpanded = !this.isExpanded)
    );
    this.overlay.classList.toggle("overlay--active");
    document.body.classList.toggle("no-scroll");
  }
}
