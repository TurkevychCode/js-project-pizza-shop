import {getData} from "./getData.js";

(async function() {
    const product = await getData();
    const pizzaContainer = $('.main__container-content');
    const typeNames = ['тонка','традиційна'];
    product.map(pizza => {
        const $pizzaBlock = $('<div class="container-content__pizza-block"></div>');
        const $blockTypeSize = $('<div class="pizza-block__block-typeSize"></div>')
        const $pizzaImg = $(`<img class="pizza-block__image" src="${pizza.image}" alt="img">`);
        const $pizzaTitle = $(`<h2 class="pizza-block__title">${pizza.title}</h2>`);
        const $pizzaTypes = $(`<ul class="block-typeSize__type"></ul>`);

        typeNames.forEach((typeName, index) => {
            const isActive = typeName === pizza.types[0] || index === 0;
            const activeClass = isActive ? 'active' : '';
            const $pizzaType = $(`<li class="type__settings ${activeClass}">${typeName}</li>`);

            $pizzaType.on('click', function () {
                $(this).addClass('active').siblings().off('click').removeClass('active');
            });

            $pizzaTypes.append($pizzaType);
        });



        $blockTypeSize.append($pizzaTypes);
        $pizzaBlock.append($pizzaImg,$pizzaTitle,$blockTypeSize);
        pizzaContainer.append($pizzaBlock)
    })
})();