import { setTotalCounterChangeCallback } from "./main.js";

(function () {
    setTotalCounterChangeCallback((totalCounter,totalPrice) => {
        console.log(totalCounter);// Отримуємо оновлене значення totalCounter після кожного кліку
        const $count = $('.button__count');
        const $price = $('.button__price');
        $count.text(totalCounter);
        $price.text(totalPrice);
    });
})();
