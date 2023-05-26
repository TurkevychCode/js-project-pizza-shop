import {setTotalCounterChangeCallback} from "./main.js";

(function () {
    setTotalCounterChangeCallback((totalCounter, totalPrice) => {
        const $count = $('.button__count');
        const $price = $('.button__price');
        $count.text(`${totalCounter} шт`);
        $price.text(`${totalPrice} $`);
    });
})();
