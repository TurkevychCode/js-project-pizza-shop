import {getData} from "./getData.js";
import {addToBasket} from "./basket.js";

let onTotalCounterChange = null;

(async function () {
    const typeNames = ['тонка', 'традиційна'];
    const categories = ['Всі', 'Мясні', 'Вегетиріанські', 'Гриль', 'Гострі', 'Закриті'];
    const sortType = ['популярності', 'ціні', 'алфавіту'];

    let totalCounter = 0;
    let totalPrice = 0;
    let currentCategoryIndex = null;
    let currentSortType = null;

    const product = await getData();
    const pizzaContainer = $('.main__container-content');
    const $categoriesBlock = $('.categories__pizza-categories');
    const $sortBlock = $('.sort-block__select');

    ///////////////////////// Отримую масив sortType та додаю його на сторінку
    ///////////////////////// та вішаю функцію на change яка добавляє клас active
    sortType.map(sortName => {
        const $sortOption = (`<option value="${sortName}">${sortName}</option>`);
        $sortBlock.append($sortOption);
    })
    $sortBlock.on('change', function() {
        currentSortType = $(this).val();
        pizzas();
    });
    ///////////////////////// Отримую масив categories додаю його на сторінку
    ///////////////////////// та вішаю функцію на click яка добавляє клас active
    categories.map((category, index) => {
        const $categoriesList = $(`<li class="pizza-categories__type">${category}</li>`);
        $categoriesBlock.append($categoriesList);

        $categoriesList.on('click', function () {
            $(this).addClass('active').siblings().removeClass('active');
            currentCategoryIndex = index;
            pizzas()
        });
    });

    /////////////////////// функція яка генерує карточки з піцою
    function pizzas() {
        pizzaContainer.empty();

        //////////////////// створюю новий масив та добавляю перевірку
        //////////////////// у разі якщо юзер обрав сортувати піци по ціні алфавіту або полулярнсті
        //////////////////// якщо ні то повертаю всі піци
        let sortedProducts = [];
        if (currentSortType === 'популярності') {
            sortedProducts = product.sort((a, b) => b.rating - a.rating);
        } else if (currentSortType === 'ціні') {
            sortedProducts = product.sort((a, b) => a.price - b.price);
        } else if (currentSortType === 'алфавіту') {
            sortedProducts = product.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            sortedProducts = product;
        }

        ///////////////////////// блок піци який відображається на сторінці
        sortedProducts.map(pizza => {
            /////////////////////////виконую перевірку на категорії у випадку
            ///////////////////////// якщо index категорії null тоді відображаються всі піци
            ///////////////////////// також якщо categories[index] дорівнює 'Всі' також відобразяться всі піци
            ///////////////////////// якщо ні перша ні друга умова не підпадає перевіряємо
            ///////////////////////// які піци відповідають індексу категорії і відображаємо її
            if (currentCategoryIndex === null || categories[currentCategoryIndex] === 'Всі'
                || pizza.category === currentCategoryIndex) {
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

                ///////////////////////// отримую масив typeNames добавляю їх на сторінку
                ///////////////////////// та вішаю функцію на click яка добавляє клас active
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
                ///////////////////////// тут з серверу я отримую розмріри піци та добавляю їх на сторінку
                ///////////////////////// також вішаю функцію click яка добавляє клас active
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
                //////////////////////////
                if (localStorage.getItem('totalCounter') && localStorage.getItem('totalPrice')) {
                    totalCounter = parseInt(localStorage.getItem('totalCounter'));
                    totalPrice = parseInt(localStorage.getItem('totalPrice'));

                    $('.button__count').text(`${totalCounter} шт`);
                    $('.button__price').text(`${totalPrice} $`);
                }
                ////////////////////////// кнопка якій я вішаю функцію при click
                ////////////////////////// 1. яка дістає значення з лічильника кнопки та при кліку збільшує на 1
                ////////////////////////// 2. збільшує загальний лічильник на 1
                ////////////////////////// 3. збільшує тотальну ціну на вартість піци
                ////////////////////////// 4. по дефолту кнопка display none але при клілку викликається метод show()
                ////////////////////////// 5. зберігаю totalCounter та totalPrice в локальне сховище localstorage
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
                    ////////////////////////// добавляю піцу в кошик
                    addToBasket(pizza)
                })
                ///////////////////////// тут відбувається вкладення блоків в самій карточці з піцою
                $pizzaBlockPrice.append($pizzaPrice, $pizzaButton);
                $blockTypeSize.append($pizzaTypes);
                $blockTypeSize.append($pizzaSizes);
                $pizzaBlock.append($pizzaImg, $pizzaTitle, $blockTypeSize, $pizzaBlockPrice);
                pizzaContainer.append($pizzaBlock);
            }
        })
    }
    pizzas()
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