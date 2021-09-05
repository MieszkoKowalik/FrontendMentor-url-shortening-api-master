export default class ListElement {
  constructor(id, originalUrl, shortUrl) {
    this.id = id;
    this.originalUrl = originalUrl;
    this.shortUrl = shortUrl;
    this.render();
  }
  render() {
    const element = document.getElementById(this.id);
    element.textContent = "";
    element.classList.add("link-shortener__item--completed");
    const newContent = document
      .querySelector(".link-shortener__item-content-template")
      .content.cloneNode(true);
    newContent.querySelector(".link-shortener__url").innerHTML =
      this.originalUrl;
    const shortUrlElement = newContent.querySelector(
      ".link-shortener__url--short"
    );
    shortUrlElement.setAttribute("href", this.shortUrl);
    shortUrlElement.innerHTML = this.shortUrl;
    newContent
      .querySelector(".button")
      .addEventListener("click", this.copyLinkHandler);

    element.append(newContent);
  }

  async copyLinkHandler(e) {
    const selectedButton = e.target;
    const shortUrl = selectedButton.parentNode.querySelector(
      ".link-shortener__url--short"
    ).textContent;

    try {
      const copiedText = await navigator.clipboard.writeText(shortUrl);
      selectedButton.classList.add("button-item--active");
      selectedButton.disabled = true;
      setTimeout(() => {
        selectedButton.classList.remove("button-item--active");
        selectedButton.disabled = false;
      }, 1000);
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
}
