let shopData = {}
let selectedModel, selectedColor, selectedStorage

window.onload = function () {
    //取得商店列表（非同步）
    fetch('./data/shop-category.json')
        .then(response => response.json())
        .then(data => {
            renderingCategory(data)
            return fetchMerchandise(data[0].dataUrl)
        })
        .then(shop => {
            shopData = shop
            renderingShop(shopData)
        })
        .catch((e) => {
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
    categoryArray.forEach(category => {
        const li = document.createElement('li')
        li.classList.add('nav-item')

        const button = document.createElement('button')
        button.classList.add('nav-link')
        button.textContent = category.title
        button.onclick = async function () {
            document.querySelector('.shop-content').classList.remove('d-none')
            resetSummaryArea()
            try {
                shopData = await fetchMerchandise(category.dataUrl)
                renderingShop(shopData)
            } catch (error) {
                document.querySelector('.shop-content').classList.add('d-none')
            }

        }
        li.append(button)
        document.getElementById('category_list').append(li)
    })
}

/**
 * 重設小計區塊
 */
function resetSummaryArea() {
    selectedModel = ''
    selectedColor = ''
    selectedStorage = ''
    document.querySelector('.summary-area').classList.add('d-none')
}

/**
 * 渲染商店內商品
 * @param {*} shop 
 */
function renderingShop(merchandise) {
    // console.log(merchandise);

    //計算最少需多少$
    const priceList = merchandise.specifications.map(spec => spec.price)
    const minPrice = Math.min(...priceList)
    createTitleArea(merchandise.title, minPrice)
    const defaultImg = Object.values(merchandise.images)[0]
    createCarousel(defaultImg)

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
    titleArea.innerHTML = `
        <h1>
            ${title}
        </h1>
        <div class="total-price">
            NT$ ${price.toLocaleString()} 起
        </div>`
}

/**
 * 產出主圖區塊Carousel
 * @param {String[]} images 
 */
function createCarousel(images) {
    const mainImgArea = document.querySelector('.main-img-area')
    const carouselIndicatorsHTML = createCarouselIndicatorsHTML(images)
    const carouselInnerHTML = createCarouselHTML(images)

    mainImgArea.innerHTML = `
                <div id="carouselExampleAutoplaying" class="carousel slide  sticky-top" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        ${carouselIndicatorsHTML}
                    </div>
                    <div class="carousel-inner">
                        ${carouselInnerHTML}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>`
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
    images.forEach((img, idx) => {
        html += `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="${idx}"
        class="${idx === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${idx + 1}"></button>`
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
    const items = getWidgetItem(widget.type)
    let itemHTML = ''

    items.forEach(item => {
        if (widget.type === 'color') {
            const color = shopData.colors.find(c => c.colorCode === item)
            const imgSize = widget.col > 2 ? 50 : 25
            //let colorIcon = widget.col
            itemHTML += `<div class="col">
                        <div class="border border-secondary-subtle border-1 rounded-3 p-4 text-center" role="button" data-color="${color.colorCode}" onclick="clickHandler(this,'${widget.type}')">
                            <img class="w-${imgSize}" src="${color.colorImg}" alt="${color.colorName}">
                        </div>
                    </div>`
        } else if (widget.type === 'model') {
            const specs = shopData.specifications.filter(spec => spec.model === item)
            const minPrice = Math.min(...specs.map(s => s.price))
            itemHTML += `<div class="col">
                <div class="border border-secondary-subtle border-1 rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')" data-model="${item}">
                    <div>${item}</div>
                    <div>NT$ ${(minPrice).toLocaleString()} 起</div>
                </div>
            </div>`
        } else if (widget.type === 'storage') {
            itemHTML += `<div class="col">
                <div class="border border-secondary-subtle border-1 rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')" data-storage="${item}">
                    <div>${item}</div>
                    <div class="price"></div>
                </div>
            </div>`
        } else {
            itemHTML += `<div class="col">
                <div class="border border-secondary-subtle border-1 rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')">
                    <div>${item}</div>
                </div>
            </div>`
        }
    })

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
    return new Set(shopData.specifications.map(spec => spec[type]))
}

/**
 * 商品客製化區塊點擊動態樣式
 * @param {DOMElement} element 
 */
function specSelectActiveHandler(element) {
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
    
    specSelectActiveHandler(element)

    const specWidget = document.querySelector('.spec-widget')
    if (type === 'color') {
        const color = shopData.colors.find(c => c.colorCode === element.dataset.color)
        selectedColor = color.colorCode
        
        //新增顏色文字
        specWidget.querySelector('.picked-color').textContent = `顏色 - ${color.colorName}`

        //換主圖幻燈片
        const imgs = shopData.images[color.colorCode]
        createCarousel(imgs)

    }
    if (type === 'model') {
        selectedModel = element.dataset.model
        //處理儲存裝置區價錢
        const specs = shopData.specifications.filter(s => s.model === selectedModel)
        specWidget.querySelectorAll('[data-storage]').forEach(el => {
            const spec = specs.find(s => s.storage === el.dataset.storage)
            el.querySelector('.price').textContent = `NT$ ${spec.price.toLocaleString()}`
        })

    }
    if (type === 'storage') {
        selectedStorage = element.dataset.storage
    }
    createSummaryInfo()
}

/**
 * 商品資訊小計區塊
 */
function createSummaryInfo() {
    if (selectedModel && selectedColor && selectedStorage) {
        const spec = shopData.specifications.find(s => s.model === selectedModel && s.color === selectedColor && s.storage === selectedStorage)

        const summaryArea = document.querySelector('.summary-area')
        summaryArea.classList.remove('d-none')
        summaryArea.querySelector('.product-name').textContent = `${spec.model}`
        const summaryImg = summaryArea.querySelector('.summary-area-img img')
        const img = shopData.images[spec.color][1]
        summaryImg.src = img

        const color = shopData.colors.find(c => c.colorCode === spec.color)
        const productItem = summaryArea.querySelector('.product-item')
        productItem.querySelector('.title').textContent = `${spec.model} ${spec.storage} ${color.colorName}`
        productItem.querySelector('.price').textContent = `NT$ ${spec.price.toLocaleString()}`
    }


}


