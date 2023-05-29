import {getTotalCounter, getTotalPrice} from "./main.js";

// ця функція оновлює значення на сторінці
// 1 перевіряє чи передаються дані з localstorage якщо ні то передаємо пустий масив
// 2 дістаємо totalPrice та totalCounter з наших функцій які отримують дані з localstorage
// 3 оновлюю відповідні елементи на сторінці такі як price__text та count__text
// 4 викликається функція renderBasketPizza(basket) яка оновлює відображення списку піц у кошику))
function updateBasketInfo() {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const totalPrice = getTotalPrice();
    const totalCounter = getTotalCounter();
    $('.price__text').text(` ${totalPrice} $`);
    $('.count__text').text(` ${totalCounter} шт`);
    renderBasketPizza(basket);
}

// ця функція добавляє піци в кошик
// 1 вона отримує піци якщо піц немає то пустий масив
// 2 перевіряє чи є в кошику піца з таким самим id у випадку якщо піца вже присутня
// то existingPizza.quantity збільшуємо на одиницю якщо ні то добавляє піцу до кошика зі значенням quantity 1
// 3 далі зберігаємо оновлений кошик до localstorage
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

// ця функція видаляє карточки з піцою та тотальну ціну та лічильник з localstorage за допомогою removeItem
function deleteAllPizzas() {
    localStorage.removeItem('basket');
    localStorage.removeItem('totalCounter');
    localStorage.removeItem('totalPrice');
}
// тут я встановлюю на блок з класом header__clear-basket функцію на click яка викликає функцію
// deleteAllPizzas яка видаляє дані
// та функцію updateBasketInfo яка оновлює дані в кошику
$('.header__clear-basket').on('click', function () {
    deleteAllPizzas()
    updateBasketInfo()
    location.reload()
})

// в цій функції я отримую дані з localstorage якщо значень не існує присвоюю пустий масив
// далі отримуємо піцу яку потрібно видалити за індексом, за допомогою splice() видаляємо піцу з масиву
// далі через localstorage.setItem оновлюємо значення кошика
// потім отримую поточне значення totalCounter та отримую кількість піц які були видалення, видаляю кількість піци
// з загального лічильника totalCounter і зберігаю нове значення кошика за допомогою localstorage.setItem
// відповідно з ціною все те саме лише в pizzaPrice ми обчилюємо ціну з урахуванням того скільки піц було видалено
// в кінці викликаю функцію updateBasketInfo яка оновлює інформацію в кошику
function deletePizzaFromBasket(index) {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const pizza = basket[index];
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

// функція яка рендерить блок піц в кошику
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

        // вішаю функцію на click яка видаляє одну піцу з кошика
        $basketDeleteButton.on('click', function () {
            deletePizzaFromBasket(index)
            location.reload()
        })

        // вложення блоків в самій карточці піц
        $basketBlockForImgAndTitle.append($basketImage, $basketTitle)
        $basketBlock.append($basketBlockForImgAndTitle, $basketQuantity, $basketPrice, $basketDeleteButton);
        $basketContainer.append($basketBlock);
    });
}
updateBasketInfo();