import ListElement from "./ListElement.js";

export default class LinkShortener {
  constructor() {
    this.form = document.querySelector(".link-shortener__form");
    this.input = this.form.querySelector("input");
    this.urlList = JSON.parse(localStorage.getItem("urlList"))
      ? JSON.parse(localStorage.getItem("urlList"))
      : [];
    this.initEventListeners();
    this.renderFromList();
  }

  initEventListeners() {
    this.form.addEventListener("submit", this.shortenLinkHandler.bind(this));
    this.input.addEventListener("input", () => {
      if (this.input.value) {
        this.form.classList.remove("link-shortener__form--error");
      }
    });
  }

  renderFromList() {
    if (this.urlList) {
      for (const element of this.urlList) {
        this.createNewElementContainer(element.id);
        const newListElement = new ListElement(
          element.id,
          element.originalUrl,
          element.shortUrl
        );
      }
    }
  }

  async shortenLinkHandler(e) {
    e.preventDefault();

    const url = this.input.value;
    if (url === null || url === "") {
      this.form.classList.add("link-shortener__form--error");
      return;
    }
    try {
      const urlId = Date.now();
      this.createNewElementContainer(urlId);
      const [originalUrl, shortenedUrl] = await this.fetchShortUrl.call(
        this,
        url,
        urlId
      );

      const newListElement = new ListElement(urlId, originalUrl, shortenedUrl);
      this.addToLocalStorage(newListElement);
    } catch (err) {
      console.error(err);
    }
  }

  async fetchShortUrl(url, urlId) {
    this.input.value = "";

    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await response.json();

    if (!response.ok) {
      this.errorHandler(data.error_code, urlId);
      throw new Error(data.error);
    }
    return [data.result.original_link, data.result.full_short_link2];
  }

  createNewElementContainer(id) {
    const list = document.querySelector(".link-shortener__list");
    const newListElement = document
      .querySelector(".link-shortener__item-template")
      .content.cloneNode(true);
    newListElement
      .querySelector(".link-shortener__item")
      .setAttribute("id", id);
    list.prepend(newListElement);
  }

  addToLocalStorage(element) {
    this.urlList.push(element);
    localStorage.setItem("urlList", JSON.stringify(this.urlList));
  }

  errorHandler(errorCode, id) {
    let message;
    switch (errorCode) {
      case 1:
        message = "No URL specified ('url' parameter is empty)";
        break;
      case 2:
        message = "Invalid URL submitted";
        break;
      case 3:
        message = "Rate limit reached. Wait a second and try again";
        break;
      case 4:
        message =
          "IP-Address has been blocked because of violating our terms of service";
        break;
      case 10:
        message = "Trying to shorten a disallowed Link";
        break;
      default:
        message = "An error occured, please try again later";
        break;
    }
    const ListElement = document.getElementById(id);
    ListElement.textContent = "";
    ListElement.innerHTML = `<span class="link-shortener__message link-shortener__message--error">${message}</span>`;
    setTimeout(() => {
      ListElement.remove();
    }, 6000);
  }
}
