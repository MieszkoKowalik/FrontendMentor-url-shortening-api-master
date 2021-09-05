export default class Header {
  constructor() {
    this.header = document.querySelector(".header");
    this.kv = document.querySelector(".kv");
    this.isInitialized = false;
    this.initObserver();
  }

  initObserver() {
    const options = {
      root: null,
      threshold: 0.5,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (this.isInitialized) {
          if (!entry.isIntersecting) {
            this.header.classList.add("header--sticky");
            document.body.classList.add("header-scrolled-in");
          } else {
            this.header.classList.add("header--scroll-out");
            setTimeout(() => {
              this.header.classList.remove("header--scroll-out");
              this.header.classList.remove("header--sticky");
              document.body.classList.remove("header-scrolled-in");
            }, 300);
          }
        }
        this.isInitialized = true;
      });
    }, options);

    observer.observe(this.kv);
  }
}
