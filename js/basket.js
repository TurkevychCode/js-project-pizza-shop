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

function deletePizzaFromBasket(index) {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    basket.splice(index, 1);
    localStorage.setItem('basket', JSON.stringify(basket));
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
renderBasketPizza(basket);