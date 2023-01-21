/** Matches last number (and maybe unit) before the price */
const RE_QUANTITY = /(\d+)([mlkg]*)[^\d]*\$/si;
const RE_PRICE = /\$(\d+(?:\.\d+)?)/si;

type Unit = 'each' | 'L' | 'kg';

function normaliseUnits(quantity: number, unit: string | undefined): [number, Unit] {
    switch (unit?.toLowerCase()) {
        case 'ml':
            return [quantity / 1000, 'L'];
        case 'l':
            return [quantity, 'L' as Unit];
        case 'g':
            return [quantity / 1000, 'kg' as Unit];
        case 'kg':
            return [quantity, 'kg'];
        default:
            return [quantity, 'each' as Unit];
    };
}

/**
 * Add unit prices to product listings.
 * Returns total number of products processed.
 */
export function addUnitPrices() {

    const products = document.querySelectorAll("a[href^='/product/']");
    for (const product of products) {
        if (product.querySelector('.unit-price')) {
            continue;
        }

        const text = product.textContent;
        if (!text) {
            continue;
        }

        let quantity: number;
        let unit: Unit;
        const quantityMatch = RE_QUANTITY.exec(text);
        if (quantityMatch) {
            [quantity, unit] = normaliseUnits(parseFloat(quantityMatch[1]), quantityMatch[2]);
        } else {
            continue;
        }
       
        let price: number;
        const priceMatch = RE_PRICE.exec(text);
        if (priceMatch) {
            price = parseFloat(priceMatch[1]);
        } else {
            continue;
        }

        const unitPrice = price / quantity;
        const unitPriceText = unitPrice.toFixed(2);

        const unitPriceElement = document.createElement('span');
        unitPriceElement.classList.add('unit-price');
        unitPriceElement.textContent = ` $${unitPriceText}/${unit}`;

        const priceElement = Array.from(product.querySelectorAll('div'))
            .find(el => !!el.textContent?.startsWith('$'));
        if (!priceElement) {
            continue;
        }
        priceElement?.appendChild(unitPriceElement)
    }

    return products.length;
}