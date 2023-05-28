import {getData} from "./getData.js";
import {addToBasket} from "./basket.js";

const typeNames = ['тонка', 'традиційна'];
const categories = ['Всі', 'Мясні', 'Вегетиріанські', 'Гриль', 'Гострі', 'Закриті'];
const sortType = ['популярності', 'ціні', 'алфавіту'];

let totalCounter = 0;
let totalPrice = 0;
let onTotalCounterChange = null;
let currentCategoryIndex = null;
let currentSortType = null;

(async function () {
    const product = await getData();
    const pizzaContainer = $('.main__container-content');
    const $categoriesBlock = $('.categories__pizza-categories');
    const $sortBlock = $('.sort-block__select');

    sortType.map(sortName => {
        const $sortOption = (`<option value="${sortName}">${sortName}</option>`);
        $sortBlock.append($sortOption);
    })
    $sortBlock.on('change', function() {
        currentSortType = $(this).val(); // Оновити обраний тип сортування
        sortCategory();
    });
    categories.map((category, index) => {
        const $categoriesList = $(`<li class="pizza-categories__type">${category}</li>`);
        $categoriesBlock.append($categoriesList);

        $categoriesList.on('click', function () {
            $(this).addClass('active').siblings().removeClass('active');
            currentCategoryIndex = index;
            sortCategory()
        });
    });

    function sortCategory() {
        pizzaContainer.empty();

        let sortedProducts = [];

        if (currentSortType === 'популярності') {
            sortedProducts = product.sort((a, b) => b.rating - a.rating);
        } else if (currentSortType === 'ціні') {
            sortedProducts = product.sort((a, b) => a.price - b.price);
        } else if (currentSortType === 'алфавіту') {
            sortedProducts = product.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            sortedProducts = product; // Залишити без змін, якщо не обрано жодного типу сортування
        }

        sortedProducts.map(pizza => {
            if (currentCategoryIndex === null || categories[currentCategoryIndex] === 'Всі' || pizza.category === currentCategoryIndex) {
                const $pizzaBlock = $('<div class="container-content__pizza-block"></div>');
                const $blockTypeSize = $('<div class="pizza-block__block-typeSize"></div>')
                const $pizzaImg = $(`<img class="pizza-block__image" src="${pizza.image}" alt="img">`);
                const $pizzaTitle = $(`<h2 class="pizza-block__title">${pizza.title}</h2>`);
                const $pizzaTypes = $('<ul class="block-typeSize__type"></ul>');
                const $pizzaSizes = $('<ul class="block-typeSize__size"></ul>');
                const $pizzaBlockPrice = $('<div class="pizza-block__block-btnPrice"></div>')
                const $pizzaPrice = $(`<p class="block-btnPrice__price">від ${pizza.price} $</p>`);
                const $pizzaButtonCounter = $(`<span class="button_counter">0</span>`)
                const $pizzaButton = $(`<button class="block-btnPrice__button">Добавити</button>`)

                typeNames.forEach((typeName, index) => {
                    const $pizzaType = $(`<li class="type__settings">${typeName}</li>`);
                    if (index === 0 || typeName === pizza.types[0]) {
                        $pizzaType.addClass('active');
                    }
                    $pizzaType.on('click', function () {
                        $(this).addClass('active').siblings().removeClass('active');
                    });
                    $pizzaTypes.append($pizzaType);
                });
                pizza.sizes.forEach((sizeNumber, index) => {
                    const $pizzaSize = $(`<li class="size__settings">${sizeNumber} см.</li>`)
                    if (index === 0) {
                        $pizzaSize.addClass('active')
                    }
                    $pizzaSize.on('click', function () {
                        $(this).addClass('active').siblings().removeClass('active');
                    })
                    $pizzaSizes.append($pizzaSize)
                });
                if (localStorage.getItem('totalCounter') && localStorage.getItem('totalPrice')) {
                    totalCounter = parseInt(localStorage.getItem('totalCounter'));
                    totalPrice = parseInt(localStorage.getItem('totalPrice'));

                    $('.button__count').text(`${totalCounter} шт`);
                    $('.button__price').text(`${totalPrice} $`);
                }
                $pizzaButton.on('click', function () {
                    const count = parseInt($pizzaButtonCounter.text());
                    $pizzaButtonCounter.text(count + 1);
                    totalCounter++;
                    totalPrice += pizza.price;
                    $pizzaButtonCounter.show();

                    $pizzaButton.text(`Добавити ${$pizzaButtonCounter.text()}`);

                    localStorage.setItem('totalCounter', totalCounter);
                    localStorage.setItem('totalPrice', `${totalPrice} $`);

                    // Викликаю функцію зворотного виклику з оновленим значенням totalCounter
                    if (onTotalCounterChange) {
                        onTotalCounterChange(totalCounter, totalPrice);
                    }
                    addToBasket(pizza)
                })

                $pizzaBlockPrice.append($pizzaPrice, $pizzaButton);
                $blockTypeSize.append($pizzaTypes);
                $blockTypeSize.append($pizzaSizes);
                $pizzaBlock.append($pizzaImg, $pizzaTitle, $blockTypeSize, $pizzaBlockPrice);
                pizzaContainer.append($pizzaBlock);

                if (currentCategoryIndex === null || pizza.category === currentCategoryIndex) {
                    pizzaContainer.append($pizzaBlock);
                }
            }
        })
    }
    sortCategory()
})();

export function setTotalCounterChangeCallback(callback) {
    onTotalCounterChange = callback;
}
export function getTotalCounter() {
    return parseInt(localStorage.getItem('totalCounter')) || 0;
}

export function getTotalPrice() {
    return parseInt(localStorage.getItem('totalPrice')) || 0;
}