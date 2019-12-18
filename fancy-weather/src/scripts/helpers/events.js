export default function fireEvent(name, payload = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail: payload }));
}
