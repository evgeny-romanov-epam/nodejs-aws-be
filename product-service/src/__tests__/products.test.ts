import {getProductById, getProducts} from '../products'

test('getProducts returns array', async () => {
    const products = await getProducts();
    expect(products).not.toBeNull();
});

test('getProductById throws an error on missing product id', async () => {
    try {
        await getProductById(null);
    } catch (e) {
        expect(e).toEqual("Empty productId");
    }
});

test('getProductById throws an error on empty product id', async () => {
    try {
        await getProductById('');
    } catch (e) {
        expect(e).toEqual("Empty productId");
    }
});

test('getProductById throws an error on missing product', async () => {
    try {
        await getProductById('123');
    } catch (e) {
        expect(e).toEqual("Product with id 123 not found");
    }
});

test('getProductById returns product', async () => {
    const product = await getProductById('193324540');
    expect(product).not.toBeNull();
    expect(product.title).toEqual('The Sandman. Песочный человек')
});