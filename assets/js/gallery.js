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
        let flipper = this.card_front[flipperNumber].parentNode;

        let flipperTransform = flipper.style.transform;

        if (flipperTransform.length === 0) flipper.style.transform = 'rotateY(180deg)';
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

        if (this.card_back[flipperNumber].getAttribute('src') === _randomSrc) this.changeSrcFront(flipperNumber);
        else this.card_front[flipperNumber].setAttribute('src', _randomSrc);
    }

    /**
     * Изменение пути картинки для back-card
     * @param flipperNumber
     */
    changeSrcBack(flipperNumber) {
        let _randomSrc = this.randomSrc;

        if (this.card_front[flipperNumber].getAttribute('src') === _randomSrc) this.changeSrcBack(flipperNumber);
        else this.card_back[flipperNumber].setAttribute('src', _randomSrc);
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