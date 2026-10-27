const template = document.createElement("template");
template.innerHTML = `
  <style>

    .display-none {display: none !important}
    .display-block {display: block !important}

    .click-to-copy__btn {
      padding: 0.25rem;
      cursor: pointer;
    }

    .click-to-copy__label {
      font-size: 0.75rem;
      line-height: 80%;
      font-weight: 600;
      cursor: inherit;
    }

    .click-to-copy__icon {
      cursor: inherit;
      .icon-default {display: block}
      .icon-confirm {display: none}
    }

    .click-to-copy__innerwrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      cursor: inherit;
    }

    .click-to-copy__content {
      display: none;
    }
  </style>

  <button class="click-to-copy__btn" part="button" type="button" tabindex="0">
    <div class="click-to-copy__innerwrapper" part="inner-wrapper">
      <span class="click-to-copy__label" part="label">
        <slot name="label"></slot>
      </span>
      <span class="click-to-copy__icon" part="icon">
        <slot name="icon-default" class="icon-default" part="icon-default"></slot>
        <slot name="icon-confirm" class="icon-confirm" part="icon-confirm"></slot>
      </span>
    </div>
  </button>
  <div class="click-to-copy__content">
    <slot name="content"></slot>
  </div>
`;

class ClickToCopy extends HTMLElement {
  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  get confirm() {
    const defaultDuration = 2000;
    const confirmMethod = this.getAttribute("confirm").trim();
    const confirmDuration = Number(
      this.getAttribute("confirm-duration") ?? defaultDuration,
    );

    return {
      confirmMethod: confirmMethod === "auto" ? "auto" : null,
      confirmDuration: Number.isNaN(confirmDuration)
        ? defaultDuration
        : confirmDuration,
    };
  }

  getSlotContent(slotName) {
    const slot = this.#shadow.querySelector(`slot[name="${slotName}"]`);
    if (!slot) return "";

    const assigned = slot.assignedNodes({ flatten: true });
    return assigned
      .map((node) => node.innerHTML)
      .join("")
      .trim();
  }

  connectedCallback() {
    if (this.#shadow.childNodes.length) {
      return;
    }

    // Clone the template content into the shadow root
    this.#shadow.appendChild(template.content.cloneNode(true));

    // if no label text remove the label span
    const labelEl = this.#shadow.querySelector(".click-to-copy__label");
    if (labelEl) {
      const label = this.getSlotContent("label");
      if (label === "")
        if (labelEl.parentNode) {
          labelEl.parentNode.removeChild(labelEl);
        }
    }

    // if no icons remove the icon span
    const iconEl = this.#shadow.querySelector(".click-to-copy__icon");
    if (iconEl) {
      const iconDefault = this.getSlotContent("icon-default");
      const iconConfirm = this.getSlotContent("icon-confirm");

      if (!iconDefault && !iconConfirm)
        if (iconEl.parentNode) {
          iconEl.parentNode.removeChild(iconEl);
        }
    }

    const btn = this.#shadow.querySelector(".click-to-copy__btn");
    if (btn) {
      btn.addEventListener("click", this.onClick.bind(this));
    }
  }

  disconnectedCallback() {}

  async onClick(e) {
    e.preventDefault();

    const value = this.getSlotContent("content");
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);

    this.dispatchEvent(
      new CustomEvent("copied", {
        bubbles: true,
        composed: true,
        detail: {
          value,
          timestamp: Date.now(),
        },
      }),
    );

    await this.animateConfirm();
  }

  async animateConfirm() {
    const confirm = this.confirm;
    if (confirm.confirmMethod !== "auto") return Promise.resolve(false);
    const iconParent = this.#shadow.querySelector(".click-to-copy__icon");
    const iconDefault = iconParent.querySelector(".icon-default");
    const iconConfirm = iconParent.querySelector(".icon-confirm");

    return new Promise((res) => {
      iconDefault.classList.add("display-none");
      iconConfirm.classList.add("display-block");
      setTimeout(() => {
        iconDefault.classList.remove("display-none");
        iconConfirm.classList.remove("display-block");
        return res(true);
      }, confirm.confirmDuration);
    });
  }

  static get observedAttributes() {
    return ["label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "label" || oldValue === newValue) {
      return;
    }
    this.label = newValue;
  }
}

customElements.define("click-to-copy", ClickToCopy);
