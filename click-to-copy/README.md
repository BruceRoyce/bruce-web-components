# `click-to-copy` Web Component

## Usage

## **Attributes**

### `confirm`

Can be `auto` (the components handles visual feedback) or `none` (you handle it in your code). Default is `none` when omitted.
In `auto` mode, the component swaps the confirmation icon with the default (normal) icon for the `confirmation-duration`
See `icon-default` and `icon-confirm` below.

### `confirm-duration`

If confirm is set to `auto` then `confirm-duration` (in millisecons) defines the length of time the confirmation icon will be displayed. Default is `2000ms` (2 second)

## **Slots**

### `<span slot="content">`

The content that will be copied to the clipboard on click. String

### `<span slot="label">`

The copy button label. String

### `<span slot="icon-default">`

The icon that goes on the button in the normal mode. HTML Node

### `<span slot="icon-confirm">`

The confirmation icon that the component displays if `confirm="auot"`. HTML Node

Example

```html
<click-to-copy id="copier" confirm="auto" confirm-duration="1000">
  <span slot="content">https://www.linkedin.com/in/bruceroyce</span>
  <span slot="label">LinkedIn</span>
  <span slot="icon-default">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="black"
    >
      <path
        d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
      />
    </svg>
  </span>
  <span slot="icon-confirm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="black"
    >
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
    </svg>
  </span>
</click-to-copy>
```

## styling

Each part is named:

- **`part(button)`:** selects the whole button
- **`part(label)`:** selects the label
- **`part(icon)`:** selects the icon wrapper
- **`part(icon-default)`:** selects the icon that is being displayed normally
- **`part(icon-confirm)`:** selects the icon that is being displayed during the confirmation period (only when `confirm="auto"`)

Example

```css
click-to-copy {
  &::part(button) {
    background-color: silver;
    border: 1px solid gray;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
  }
}
```

Some minimal default styling are applied.
