// Catch all inputs and total price
let titleInput = <HTMLInputElement> document.getElementById("title"),
  priceInput = <HTMLInputElement> document.getElementById("price"),
  taxesInput = <HTMLInputElement> document.getElementById("taxes"),
  adsInput = <HTMLInputElement> document.getElementById("ads"),
  discoundInput = <HTMLInputElement> document.getElementById("discount"),
  totalPrice = <HTMLDivElement> document.getElementById("total"),
  countInput = <HTMLInputElement> document.getElementById("count"),
  categoryInput = <HTMLInputElement> document.getElementById("category"),
  submitButton = <HTMLButtonElement> document.getElementById("submit"),
  // tbody and btn delete all
  tbody = document.getElementById("mainBody") as HTMLElement,
  divDeleteAll = <HTMLDivElement> document.getElementById("deleteAll") ,
  btnDeleteAll = <HTMLDivElement> document.querySelector("#deleteAll button") ,
  // search input and btns
  searchInput = <HTMLInputElement> document.getElementById("search"),
  searchTitle = <HTMLDivElement> document.getElementById("searchTitle"),
  searchCategory = <HTMLDivElement> document.getElementById("searchCategory"),
  // Setting app
  inputsArrayTotal: Element[] = [priceInput,taxesInput,adsInput,discoundInput],
  inputsArrayAll: Element[] = [titleInput,priceInput,taxesInput,adsInput,discoundInput,countInput,categoryInput],
  dataProduct: mainProductObject[] = [];
  const Setting : {
    mood: string,
    searchMood: string,
    indexCurrentTr: number
  } = {
    mood : "create",
    searchMood: "title",
    indexCurrentTr: 0
  }

// The main interface for the products
interface mainProductObject {
  id?: number;
  title: string;
  price: string;
  taxes: string;
  ads: string;
  discound: string;
  total: string;
  count: string;
  category: string;
};
// If we have any products in local storage we will add it to the page
if (localStorage.getItem("product") && JSON.parse(localStorage.product)[0] != undefined) {
  dataProduct = JSON.parse(localStorage.product);
  showData(dataProduct)
}
// To get total price
inputsArrayTotal.forEach((input) => (input as HTMLElement).addEventListener("input", getTotal));
// When Press the "Enter" key focus to the next input
inputsArrayAll.forEach((input, index) =>  {
  if (index < (inputsArrayAll.length - 1)) {
      (input as HTMLElement).addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          (inputsArrayAll[index + 1] as HTMLInputElement).focus();
        }
      })
  }
})
// add event keydown in category
categoryInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    submitButton.click();
  }
})
// Function get total price
function getTotal(): void {
  if (priceInput.value) {
    let result: number = 
    (+priceInput.value + +taxesInput.value + +adsInput.value) - +discoundInput.value;
    totalPrice.innerHTML = `${result}`
    totalPrice.setAttribute("style", "background-color:#040")
  } else {
    totalPrice.innerHTML = `0`
    totalPrice.setAttribute("style", "background-color:#36438f")
  }
}
// Delete All Product
btnDeleteAll.onclick = () => {
  if (window.confirm("Are You Sure ?")) {
  tbody.innerHTML = ""
  dataProduct= []
  localStorage.clear()
  divDeleteAll.style.display = "none"
  }
}

// Add click event to the button create
submitButton.onclick = function (): void {
  if (titleInput.value != "") {
    if (priceInput.value != "") {
      // Make object from the main interface
      let product: mainProductObject = {
        title: titleInput.value,
        price: priceInput.value,
        taxes: taxesInput.value || "0",
        ads: adsInput.value || "0",
        discound: discoundInput.value || "0",
        total: totalPrice.innerHTML,
        count: countInput.value || "1",
        category: categoryInput.value || "unknown"
      }
      // Add object to array
      let countNow: number = parseInt(product.count)
      if (Setting.mood === "create") {
        if (countNow > 1) {
          for (let i = 0; i < countNow; i++) {
            dataProduct.push(product)
          }
        } else {
          dataProduct.push(product)
        }
      } else {
        dataProduct[Setting.indexCurrentTr] = product
        Setting.mood = "create"
        countInput.style.display = "block"
        submitButton.innerHTML = "Create"
      }
      // Add data to local storage
      addDataToLocalStorage()
      // Remove the value of all inputs
      clearData()
      totalPrice.innerHTML = `0`
      totalPrice.setAttribute("style", "background-color:#36438f")
      // Show data in the page
      showData(dataProduct)
    }
    else {
      priceInput.setAttribute("style", "animation: none")
      setTimeout (() => priceInput.style.animation = "shake 0.4s", 100)
    }
  }
  else {
    titleInput.setAttribute("style", "animation: none")
    setTimeout (() => titleInput.style.animation = "shake 0.4s", 100)
  }
}
// Function Remove the value of all inputs
function clearData(): void {
  titleInput.value = ""
  priceInput.value = ""
  taxesInput.value = ""
  adsInput.value = ""
  discoundInput.value = ""
  totalPrice.innerHTML = "0"
  countInput.value = ""
  categoryInput.value = ""
}
// Function Add data to local storage
function addDataToLocalStorage(): void {
  localStorage.setItem("product", JSON.stringify(dataProduct))
}

// Function Show data in the page
function showData(arr: mainProductObject[]): void {
  tbody.innerHTML = ""
  for (let i = 0; i < arr.length; i++) {
    // Creat Elements
    let tr = document.createElement("tr"),
      id = <HTMLElement> document.createElement("td"),
      title = <HTMLElement> document.createElement("td"),
      price = <HTMLElement> document.createElement("td"),
      taxes = <HTMLElement> document.createElement("td"),
      ads = <HTMLElement> document.createElement("td"),
      discound = <HTMLElement> document.createElement("td"),
      total = <HTMLElement> document.createElement("td"),
      category = <HTMLElement> document.createElement("td"),
      btnUpdate = <HTMLElement> document.createElement("td"),
      btndelete = <HTMLElement> document.createElement("td");
    // Add text to The Elements 
    id.innerHTML = `${i + 1}`
    title.append(document.createTextNode(arr[i].title));
    price.append(document.createTextNode(arr[i].price));
    taxes.append(document.createTextNode(arr[i].taxes));
    ads.append(document.createTextNode(arr[i].ads));
    discound.append(document.createTextNode(arr[i].discound));
    total.append(document.createTextNode(arr[i].total));
    category.append(document.createTextNode(arr[i].category));
    // Add Attributes to Buttons
    btnUpdate.innerHTML = "<button>update</button>"
    btndelete.innerHTML = "<button>delete</button>"
    btnUpdate.dataset.index = `${i}`
    btndelete.dataset.index  = `${i}`
    btnUpdate.id = `update`
    btndelete.id = `delete`
    // Add Events to Buttons
    btnUpdate.addEventListener("click", function () {
      updateData(parseInt(this.dataset.index as string))
    })
    btndelete.addEventListener("click", function () {
      dataProduct.splice(+(this.dataset.index as string), 1)
      this.parentElement?.remove()
      addDataToLocalStorage()
      if (dataProduct.length != 0) {
        divDeleteAll.style.display = "block"
      } else {
        divDeleteAll.style.display = "none"
      }
    })
    // Add data to page
    let allData: Element[] = [id,title,price,taxes,ads,discound,total,category,btnUpdate,btndelete]
    allData.forEach( ele => {
        tr.appendChild(ele)
    })
    tbody.append(tr)
  }
  divDeleteAll.style.display = "block"
}
// Update Data
function updateData(index: number) {
  titleInput.value = (dataProduct[index].title)
  priceInput.value = (dataProduct[index].price)
  taxesInput.value = (dataProduct[index].taxes)
  adsInput.value = (dataProduct[index].ads)
  discoundInput.value = (dataProduct[index].discound)
  categoryInput.value = (dataProduct[index].category)
  getTotal()
  countInput.style.display = "none"
  submitButton.innerHTML = "update"
  Setting.mood = "update"
  Setting.indexCurrentTr = index
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
// Search buttons
searchTitle.addEventListener("click", () => searchMood("title"))
searchCategory.addEventListener("click", () => searchMood("category"))
// Function Search
function searchMood(id: string) {
  (id === "title") ? Setting.searchMood = "title" : Setting.searchMood = "category";
  searchInput.placeholder = `Search By ${Setting.searchMood}`
  searchInput.focus()
  searchInput.value = ""
  Array.from(tbody.children, (ele) => ele.setAttribute("style", "display: table-row"))
}
// Add Event to Search Input
searchInput.addEventListener("input", function (): void {
  let searchValue = this.value.toLowerCase(),
    indexes: number[] = [];
  if (Setting.searchMood === "title") {
    for (let i = 0; i < dataProduct.length; i++) {
      if (dataProduct[i].title.toLowerCase().includes(searchValue)) {
        indexes.push(i)
      }
    }
  } 
  else {
    for (let i = 0; i < dataProduct.length; i++) {
      if (dataProduct[i].category.toLowerCase().includes(searchValue)) {
        indexes.push(i)
      }
    }
  }
  Array.from(tbody.children,(ele, index) => {
    if (index == indexes[0]) {
      ele.setAttribute("style", "display: table-row")
      indexes.shift()
    } else {
      ele.setAttribute("style", "display: none")
    }
  })
})