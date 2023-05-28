import {getTotalCounter, getTotalPrice} from "./main.js";

function updateBasketInfo() {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const totalPrice = getTotalPrice();
    const totalCounter = getTotalCounter();
    $('.price__text').text(` ${totalPrice} $`);
    $('.count__text').text(` ${totalCounter} шт`);
    renderBasketPizza(basket);
}

export function addToBasket(pizza) {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const existingPizza = basket.find((item) => item.id === pizza.id)

    if (existingPizza) {
        existingPizza.quantity++
    } else {
        pizza.quantity = 1;
        basket.push(pizza);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
}

function deleteAllPizzas() {
    localStorage.removeItem('basket');
    localStorage.removeItem('totalCounter');
    localStorage.removeItem('totalPrice');
}

$('.header__clear-basket').on('click', function () {
    deleteAllPizzas()
    updateBasketInfo()
    location.reload()
})

function deletePizzaFromBasket(index) {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const pizza = basket[index]
    basket.splice(index, 1);
    localStorage.setItem('basket', JSON.stringify(basket));
    const totalCounter = getTotalCounter();
    const pizzaQuantity = pizza.quantity;
    localStorage.setItem('totalCounter', totalCounter - pizzaQuantity);

    const totalPrice = getTotalPrice();
    const pizzaPrice = pizza.price * pizza.quantity;
    localStorage.setItem('totalPrice', totalPrice - pizzaPrice);
    updateBasketInfo()
}

function renderBasketPizza(basket) {
    const $basketContainer = $('.block__content-basket');
    basket.forEach((pizza, index) => {
        const $basketBlock = $('<div class="content-basket__block-basket"></div>');
        const $basketBlockForImgAndTitle = $('<div class="block-basket__blockForImgAndTitle"></div>');
        const $basketImage = $(`<img class="blockForImgAndTitle__img" src="${pizza.image}" alt="Pizza Image">`);
        const $basketTitle = $(`<h3 class="blockForImgAndTitle__title">${pizza.title}</h3>`);
        const $basketQuantity = $(`<p class="block-basket__countPizza">${pizza.quantity} шт</p>`);
        const $basketPrice = $(`<p class="block-basket__price">${pizza.price} $</p>`);
        const $basketDeleteButton = $('<div class="block-basket__deleteButton">X</div>');

        $basketDeleteButton.on('click', function () {
            deletePizzaFromBasket(index)
            location.reload()
        })

        $basketBlockForImgAndTitle.append($basketImage, $basketTitle)
        $basketBlock.append($basketBlockForImgAndTitle, $basketQuantity, $basketPrice, $basketDeleteButton);
        $basketContainer.append($basketBlock);
    });
}
const basket = JSON.parse(localStorage.getItem('basket')) || [];
updateBasketInfo();