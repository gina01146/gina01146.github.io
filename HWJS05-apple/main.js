let shopData = {}
let selectedModel, selectedColor, selectedStorage

window.onload = function () {
    //TODO: 取得商店列表並渲染成商店分類清單
    // use fetch()......
    fetch('./data/shop-category.json')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            renderingCategory(data)
            // 取得預設的商品並渲染出來(第一筆資料)
            return fetchMerchandise(data[0].dataUrl)
        })
        .then(shop => {
            shopData = shop
            renderingShop(shop)
        })
        .catch(e => {
            console.warn(e)
        })

}

/**
 * 取得商店商品資料
 * @param {String} url 
 * @returns {Promise} Merchandise
 */
function fetchMerchandise(url) {
    return fetch(url)
        .then(response => response.json())
}

/**
 * 渲染商店內分類列表
 * @param {Array} categoryArray 
 */
function renderingCategory(categoryArray) {

    // html的樣子
    // `<ul>
    //     <li class="nav-item">
    //         <button class="nav-link" aria-current="page">商品項目1</button>
    //     </li>
    //     <li class="nav-item">
    //         <button class="nav-link" aria-current="page">商品項目2</button>
    //     </li>
    //     <li class="nav-item">
    //         <button class="nav-link" aria-current="page">商品項目3</button>
    //     </li>
    // </ul>`

    const ul = document.getElementById('category_list')
    categoryArray.forEach(category => {
        const li = document.createElement('li')
        li.classList.add('nav-item')

        const button = document.createElement('button')
        button.classList.add('nav-link')
        button.setAttribute('aria-current', 'page')
        button.textContent = category.title
        //TODO: Click事件:點擊之後要切換商品內容
        //第一種方法
        // button.onclick = function(){
        //     fetchMerchandise(item.dataUrl)
        //         .then(data => {
        //             console.log(data);
        //         })
        // }
        //第二種方法
        button.onclick = async function () {
            try {
                const data = await fetchMerchandise(item.dataUrl)
                // console.log(data);
                renderingShop(data)

            } catch (error) {
                // console.warn(error);
                document.querySelector('.shop-content').classList.add('d-none')
            }
        } 
        li.append(button)
        ul.append(li)
        // categoryArray.forEach(item =>{
        //     ul.innerHTML += `<li class="nav-item">
        //     <a class="nav-link" aria-current="page" href="#">${item.title}</a>
        // </li>`
    })

}

/**
 * 渲染商店內商品
 * @param {*} shop 
 */
function renderingShop(merchandise) {
    //全域的商店商品資料
    shopData = merchandise
    // console.log(merchandise);
    //TODO: 計算最少需多少$，32筆資料取最小值
    const priceList = merchandise.specifications.map(spec => spec.price)
    const minPrice = Math.min(...priceList)
    // console.log(minPrice);

    //TODO: 產出標題區塊
    createTitleArea(merchandise.title, minPrice)

    //TODO: 產出主圖區塊
    const defaultImgs = Object.values(merchandise.images)[0]
    // console.log(defaultImgs);
    createCarousel(defaultImgs)

    //TODO: 商品客製化選擇組件
    let widgetHTML = ''
    merchandise.widgets.forEach(widget => {
        widgetHTML += createWidgetHTML(widget)
    })

    document.querySelector('.spec-widget').innerHTML = widgetHTML

    document.querySelector('.qna-area').classList.remove('d-none')
    document.querySelector('footer').classList.remove('d-none')
}

/**
 * 產出商品標題區塊
 * @param {String} title 
 * @param {Number} price 
 */
function createTitleArea(title, price) {
    const titleArea = document.querySelector('.title-area')
    //TODO: 加入h1及金額 NT$ xxx起
    titleArea.innerHTML = `
                <h1>
                    ${title}
                </h1>
                <div class="total-price">
                    NT$ ${price.toLocaleString()}起
                </div> `
}

/**
 * 產出主圖區塊Carousel
 * @param {String[]} images 
 */
function createCarousel(images) {
    const mainImgArea = document.querySelector('.main-img-area')
    //TODO:
    const carouselIndicatorsHTML = createCarouselIndicatorsHTML(images)
    //TODO:
    const carouselInnerHTML = createCarouselHTML(images)

    //TODO: 整體幻燈片HTML
    mainImgArea.innerHTML = `
    <div id="carouselExampleAutoplaying" class="carousel slide  sticky-top" data-bs-ride="carousel"></div>
    <div class="carousel-indicators">
        ${carouselIndicatorsHTML}
    </div>
    <div class="carousel-inner">
        ${carouselInnerHTML}
    </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    `
}

/**
 * 幻燈片指標區塊
 * @param {String[]} images 
 * @returns Indicators Area HTML
 */
function createCarouselIndicatorsHTML(images) {
    //     let html = `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0"
    //     class="active" aria-current="true" aria-label="Slide 1"></button>
    // <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1"
    //     aria-label="Slide 2"></button>
    // <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2"
    //     aria-label="Slide 3"></button>`
    let html = ''
    //TODO: 產生指標
    images.forEach((img, idx) => {
        html += `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="${idx}"
        class="${idx === 0 ? 'active' : ''}" ${idx === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${idx + 1}"></button>`
    })
    return html
}

/**
 * 幻燈片主圖區區塊
 * @param {String[]} images 
 * @returns Carousel Img Area HTML
 */
function createCarouselHTML(images) {
    //     let html = `<div class="carousel-item active">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>
    // <div class="carousel-item">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV1.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>
    // <div class="carousel-item">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV2.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>`
    let html = ''
    //TODO: 產生主圖
    images.forEach((img, idx) => {
        html += `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                    <img src="${img}" class="d-block w-100" alt="...">
                </div>`
    })
    return html
}

/**
 * 產出商品客製化規格區塊
 * @param {Object} widget 商品客製化區塊物件
 * @returns Widget區塊HTML
 */
function createWidgetHTML(widget) {

    //TODO: 取得該區塊所有的項目
    const items = getWidgetItem(widget.type)

    //TODO: 產出區塊內所有的item的innerHTML
    let itemHTML = ''
    // console.log(shopData);

    items.forEach(item => {
        if (widget.type === 'color') {
            const color = shopData.colors.find(c => c.colorCode === item)
            itemHTML += `<div class="col">
                            <div class="border border-secondary-subtle rounded-3 p-4 text-center" role="button" onclick="clickHandler(this, '${widget.type}')" data-color="${color.colorCode}">
                            <img class="w-25" src="${color.colorImg}"
                            alt="${color.colorName}">
                            </div>
                        </div>`

        } else if (widget.type === 'model') {
            const spec = shopData.specifications.filter(spec => spec.model === item)
            const minPrice = Math.min(...spec.map(s => s.price))
            itemHTML += `<div class="col">
                            <div class="border border-secondary-subtle rounded-3 p-4" role="button" onclick="clickHandler(this, '${widget.type}')" data-model="${item}">${item}</div>
                        </div>`
        } else if (widget.type === 'storage') {
            itemHTML += `<div class="col">
                            <div class="border border-secondary-subtle rounded-3 p-4 d-flex justify-content-between"
                                role="button" onclick="clickHandler(this, '${widget.type}')" data-storage="${item}">
                                <div class="storage-spec">${item}</div>
                                <div class="price"></div>
                            </div>
                        </div>`
        } else {
            itemHTML += ` <div class="col">
                            <div class="border border-secondary-subtle rounded-3 p-4" role="button" onclick="clickHandler(this, '${widget.type}')">
                                <div class="">>${item}</div>
                            </div>
                        </div>`
        }
    })

    //

    let html = `
    <section class="widget-item mb-4 mx-lg-3">
        <h2 class="fs-4">${widget.title} <span class="text-black-50">${widget.subTitle}</span></h2>
        ${widget.type === 'color' ? `<p><span class="picked-color fw-medium">顏色</span> </p>` : ''}
        <div class="row row-cols-${widget.col} gy-3">
            ${itemHTML}
        </div>
    </section>`


    return html
}

/**
 * 從商品的規格類型內取得選項
 * @param {string} type 規格類型
 * @returns Spec Items
 */
function getWidgetItem(type) {
    // console.log(shopData);
    // console.log(type);

    //TODO: 透過type取得不重複的spec items
    const items = shopData.specifications.map(spec => spec[type])
    console.log((items));

    return new Set(items)
}

/**
 * 商品客製化區塊點擊動態樣式
 * @param {DOMElement} element 
 */
function specSelectActiveHandler(element) {
    //TODO: 找到屬於那個DOM的區塊，沒點擊的變成原本樣式，點擊的就變成active樣式，灰變藍
    console.dir(element)
    // console.log(element.parentElement.parentElement);
    element.parentElement.parentElement.querySelectorAll('[role="button"]').forEach(el => {
        el.classList.remove('border-primary')
    })
    element.classList.remove('border-secondary-subtle')
    element.classList.add('border-primary')

}

/**
 * WidgetItem點擊事件
 * @param {DOMElement} element 
 * @param {String} type 客製化規格類型
 */
function clickHandler(element, type) {
    // console.log(element);
    // console.log(type);
    specSelectActiveHandler(element)

    const specWidget = document.querySelector('.spec-widget')
    if (type === 'color') {
        // console.log(element.dataset.color);
        const color = shopData.colors.find(c => c.colorCode === element.dataset.color)
        selectedColor = element.dataset.color
        //TODO: 設定選取得顏色

        //TODO: 新增顏色區塊文字
        specWidget.querySelector('.picked-color').textContent = `顏色 - ${color.colorName}`
        //TODO: 替換主圖幻燈片
        const imgs = shopData.images[color.colorCode]
        createCarousel(imgs)
    }

    if (type === 'model') {
        //console.log(element.dataset.model);
        //TODO: 設定選取的規格

        //TODO: 處理儲存裝置區價錢(點擊不同機型時，儲存裝置的錢需要重算)


    }

    if (type === 'storage') {
        //console.log(element.dataset.storage);
        selectedStorage = element.dataset.storage
        //TODO: 設定選取的儲存空間
    }

    createSummaryInfo()
}



/**
 * 商品資訊小計區塊
 */
function createSummaryInfo() {
    if (selectedModel && selectedColor && selectedStorage) {
        //TODO: 取得選到的 Spec

        //TODO: 顯示小計區塊、產品名稱、圖片、完整產品名稱、價錢

    }


}

/**
 * 重設小計區塊（載入時應該會需要）
 */
function resetSummaryArea() {
    selectedModel = ''
    selectedColor = ''
    selectedStorage = ''
    document.querySelector('.summary-area').classList.add('d-none')
}
