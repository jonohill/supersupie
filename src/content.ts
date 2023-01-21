import { addUnitPrices } from "./unit-prices"

const observer = new MutationObserver(addUnitPrices);
observer.observe(document.body, { childList: true, subtree: true });
