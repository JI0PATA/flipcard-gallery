let qs = selector => document.querySelector(selector),
    qsa = selector => document.querySelectorAll(selector);

class FlipGallery {
    constructor(container, src, options) {
        this._container = container;
        this._src = src;

        /**
         * Опции
         */
        this._interval = options.interval;
        this._transition = options.transition;

        this._prevRandomCard = null;
        this._prevRandomSrc = null;

        // Поиск всех карточек
        this.card_front = qsa(this._container + ' [data-flipcard=front]');
        this.card_back = qsa(this._container + ' [data-flipcard=back]');

        // Установка интервала
        this.setInterval();
    }

    /**
     * Получение случайной карты
     * @returns {number}
     */
    get randomCard() {
        let _randomCard = FlipGallery.random(0, this.card_front.length - 1);

        if (this._prevRandomCard === _randomCard) return this.randomCard;

        this._prevRandomCard = _randomCard;

        return _randomCard;
    }

    /**
     * Получение случайной исходной картинки
     * @returns {number}
     */
    get randomSrc() {
        return this._src[FlipGallery.random(0, this._src.length - 1)];
    }

    /**
     * Переворот карты
     * @param flipperNumber
     */
    flipCard(flipperNumber) {
        // Переход к родителю
        let flipper = this.card_front[flipperNumber].parentNode;

        // Получение значения transform родителя
        let flipperTransform = flipper.style.transform;

        // Если карточка ещё ни разу не крутилась,
        // то значение у родителя не будет значения transform
        // То добавляем начальное значение
        if (flipperTransform.length === 0) {
            flipper.style.transform = 'rotateY(180deg)';
        }
        // Иначе изменяем текущее значение
        else {
            flipper.style.transform = `rotateY(${FlipGallery.getNumber(flipperTransform) + 180}deg)`;
        }
        setTimeout(_ => {
            this.changeSrc(flipperNumber);
        }, this._transition);
    }

    /**
     * Изменение пути картинки
     * @param flipperNumber
     */
    changeSrc(flipperNumber) {
        let flipperTransformVal = FlipGallery.getNumber(this.card_front[flipperNumber].parentNode.style.transform);

        if (flipperTransformVal % 360 !== 0 && flipperTransformVal % 180 === 0) {
            // Смена картинки на data-flipcard=front
            this.changeSrcFront(flipperNumber);
        } else {
            // Смена картинки на data-flipcard=back
            this.changeSrcBack(flipperNumber);
        }
    }

    /**
     * Изменение пути картинки для front-card
     * @param flipperNumber
     */
    changeSrcFront(flipperNumber) {

        let _randomSrc = this.randomSrc;

        if (FlipGallery.getBackgroundUrl(this.card_back[flipperNumber].style.backgroundImage) === _randomSrc) this.changeSrcFront(flipperNumber);
        else this.card_front[flipperNumber].style.backgroundImage = _randomSrc;
    }

    /**
     * Изменение пути картинки для back-card
     * @param flipperNumber
     */
    changeSrcBack(flipperNumber) {
        let _randomSrc = this.randomSrc;

        if (FlipGallery.getBackgroundUrl(this.card_front[flipperNumber].style.backgroundImage) === _randomSrc) this.changeSrcBack(flipperNumber);
        else this.card_back[flipperNumber].style.backgroundImage = _randomSrc;
    }

    /**
     * Установка интервала смены картинок
     */
    setInterval() {
        this._iter = 0;

        this.loop();
    }

    /**
     * Бесконечный цикл смены flip-card
     */
    loop() {
        requestAnimationFrame(_ => {
            if (this._iter % this._interval === 0 && this._iter !== 0) {
                this.flipCard(this.randomCard);
            }

            this._iter++;
            this.loop();
        });
    }

    /**
     * Получение URL из background-image
     * @param string
     * @returns {string | * | void}
     */
    static getBackgroundUrl(string) {
        return string.replace('url("','').replace('")','')
    }


    /**
     * Парсинг числа из строки
     * @param string
     * @returns {number}
     */
    static getNumber(string) {
        let regexp = /[0-9]+/;

        return parseInt(string.match(regexp)[0]);
    }

    /**
     * Возвращает случайное значение из промежутка
     * @param min number минимальное значение
     * @param max number максимальное значение
     * @returns {number} возвращаемое значение
     */
    static random(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}