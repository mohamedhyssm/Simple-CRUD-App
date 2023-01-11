"use strict";
let titleInput = document.getElementById("title"), priceInput = document.getElementById("price"), taxesInput = document.getElementById("taxes"), adsInput = document.getElementById("ads"), discoundInput = document.getElementById("discount"), totalPrice = document.getElementById("total"), countInput = document.getElementById("count"), categoryInput = document.getElementById("category"), submitButton = document.getElementById("submit"), tbody = document.getElementById("mainBody"), divDeleteAll = document.getElementById("deleteAll"), btnDeleteAll = document.querySelector("#deleteAll button"), searchInput = document.getElementById("search"), searchTitle = document.getElementById("searchTitle"), searchCategory = document.getElementById("searchCategory"), inputsArrayTotal = [priceInput, taxesInput, adsInput, discoundInput], inputsArrayAll = [titleInput, priceInput, taxesInput, adsInput, discoundInput, countInput, categoryInput], dataProduct = [];
const Setting = {
    mood: "create",
    searchMood: "title",
    indexCurrentTr: 0
};
;
if (localStorage.getItem("product") && JSON.parse(localStorage.product)[0] != undefined) {
    dataProduct = JSON.parse(localStorage.product);
    showData(dataProduct);
}
inputsArrayTotal.forEach((input) => input.addEventListener("input", getTotal));
inputsArrayAll.forEach((input, index) => {
    if (index < (inputsArrayAll.length - 1)) {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                inputsArrayAll[index + 1].focus();
            }
        });
    }
});
categoryInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        submitButton.click();
    }
});
function getTotal() {
    if (priceInput.value) {
        let result = (+priceInput.value + +taxesInput.value + +adsInput.value) - +discoundInput.value;
        totalPrice.innerHTML = `${result}`;
        totalPrice.setAttribute("style", "background-color:#040");
    }
    else {
        totalPrice.innerHTML = `0`;
        totalPrice.setAttribute("style", "background-color:#36438f");
    }
}
btnDeleteAll.onclick = () => {
    if (window.confirm("Are You Sure ?")) {
        tbody.innerHTML = "";
        dataProduct = [];
        localStorage.clear();
        divDeleteAll.style.display = "none";
    }
};
submitButton.onclick = function () {
    if (titleInput.value != "") {
        if (priceInput.value != "") {
            let product = {
                title: titleInput.value,
                price: priceInput.value,
                taxes: taxesInput.value || "0",
                ads: adsInput.value || "0",
                discound: discoundInput.value || "0",
                total: totalPrice.innerHTML,
                count: countInput.value || "1",
                category: categoryInput.value || "unknown"
            };
            let countNow = parseInt(product.count);
            if (Setting.mood === "create") {
                if (countNow > 1) {
                    for (let i = 0; i < countNow; i++) {
                        dataProduct.push(product);
                    }
                }
                else {
                    dataProduct.push(product);
                }
            }
            else {
                dataProduct[Setting.indexCurrentTr] = product;
                Setting.mood = "create";
                countInput.style.display = "block";
                submitButton.innerHTML = "Create";
            }
            addDataToLocalStorage();
            clearData();
            totalPrice.innerHTML = `0`;
            totalPrice.setAttribute("style", "background-color:#36438f");
            showData(dataProduct);
        }
        else {
            priceInput.setAttribute("style", "animation: none");
            setTimeout(() => priceInput.style.animation = "shake 0.4s", 100);
        }
    }
    else {
        titleInput.setAttribute("style", "animation: none");
        setTimeout(() => titleInput.style.animation = "shake 0.4s", 100);
    }
};
function clearData() {
    titleInput.value = "";
    priceInput.value = "";
    taxesInput.value = "";
    adsInput.value = "";
    discoundInput.value = "";
    totalPrice.innerHTML = "0";
    countInput.value = "";
    categoryInput.value = "";
}
function addDataToLocalStorage() {
    localStorage.setItem("product", JSON.stringify(dataProduct));
}
function showData(arr) {
    tbody.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        let tr = document.createElement("tr"), id = document.createElement("td"), title = document.createElement("td"), price = document.createElement("td"), taxes = document.createElement("td"), ads = document.createElement("td"), discound = document.createElement("td"), total = document.createElement("td"), category = document.createElement("td"), btnUpdate = document.createElement("td"), btndelete = document.createElement("td");
        id.innerHTML = `${i + 1}`;
        title.append(document.createTextNode(arr[i].title));
        price.append(document.createTextNode(arr[i].price));
        taxes.append(document.createTextNode(arr[i].taxes));
        ads.append(document.createTextNode(arr[i].ads));
        discound.append(document.createTextNode(arr[i].discound));
        total.append(document.createTextNode(arr[i].total));
        category.append(document.createTextNode(arr[i].category));
        btnUpdate.innerHTML = "<button>update</button>";
        btndelete.innerHTML = "<button>delete</button>";
        btnUpdate.dataset.index = `${i}`;
        btndelete.dataset.index = `${i}`;
        btnUpdate.id = `update`;
        btndelete.id = `delete`;
        btnUpdate.addEventListener("click", function () {
            updateData(parseInt(this.dataset.index));
        });
        btndelete.addEventListener("click", function () {
            var _a;
            dataProduct.splice(+this.dataset.index, 1);
            (_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
            addDataToLocalStorage();
            if (dataProduct.length != 0) {
                divDeleteAll.style.display = "block";
            }
            else {
                divDeleteAll.style.display = "none";
            }
        });
        let allData = [id, title, price, taxes, ads, discound, total, category, btnUpdate, btndelete];
        allData.forEach(ele => {
            tr.appendChild(ele);
        });
        tbody.append(tr);
    }
    divDeleteAll.style.display = "block";
}
function updateData(index) {
    titleInput.value = (dataProduct[index].title);
    priceInput.value = (dataProduct[index].price);
    taxesInput.value = (dataProduct[index].taxes);
    adsInput.value = (dataProduct[index].ads);
    discoundInput.value = (dataProduct[index].discound);
    categoryInput.value = (dataProduct[index].category);
    getTotal();
    countInput.style.display = "none";
    submitButton.innerHTML = "update";
    Setting.mood = "update";
    Setting.indexCurrentTr = index;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
searchTitle.addEventListener("click", () => searchMood("title"));
searchCategory.addEventListener("click", () => searchMood("category"));
function searchMood(id) {
    (id === "title") ? Setting.searchMood = "title" : Setting.searchMood = "category";
    searchInput.placeholder = `Search By ${Setting.searchMood}`;
    searchInput.focus();
    searchInput.value = "";
    Array.from(tbody.children, (ele) => ele.setAttribute("style", "display: table-row"));
}
searchInput.addEventListener("input", function () {
    let searchValue = this.value.toLowerCase(), indexes = [];
    if (Setting.searchMood === "title") {
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].title.toLowerCase().includes(searchValue)) {
                indexes.push(i);
            }
        }
    }
    else {
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].category.toLowerCase().includes(searchValue)) {
                indexes.push(i);
            }
        }
    }
    Array.from(tbody.children, (ele, index) => {
        if (index == indexes[0]) {
            ele.setAttribute("style", "display: table-row");
            indexes.shift();
        }
        else {
            ele.setAttribute("style", "display: none");
        }
    });
});
//# sourceMappingURL=main.js.map