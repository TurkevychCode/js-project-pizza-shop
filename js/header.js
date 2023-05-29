import {setTotalCounterChangeCallback} from "./main.js";
// отримую колбек функцію за задаю значення потрібним мені блокам
(function () {
    setTotalCounterChangeCallback((totalCounter, totalPrice) => {
        const $count = $('.button__count');
        const $price = $('.button__price');
        $count.text(`${totalCounter} шт`);
        $price.text(`${totalPrice} $`);
    });
})();
