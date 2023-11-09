
const addEl = (
  type,
  parent,
  atr1,
  atr1Name,
  atr2,
  atr2Name,
  atr3,
  atr3Name
) => {
  let el = document.createElement(type);
  if (atr1 != undefined) el.setAttribute(atr1, atr1Name);
  if (atr2 != undefined) el.setAttribute(atr2, atr2Name);
  if (atr3 != undefined) el.setAttribute(atr3, atr3Name);
  if (parent != undefined) parent.appendChild(el);
  return el;
};

const formular = () => {
  return `<div id = "popupContainer" class="modal">
  <div id = "formContainer">
    <form id="formular">
      <div id="title" class="formItem">
        Order Details
      </div>
      <div class="formItem">
        <label for="name"></label>
        <input type="text" id="name" class="input" name="name" placeholder="Name">
      </div>
      <div class="formItem">
        <label for="email"></label>
        <input type="text" id="email" class="input" name="email" placeholder="Email">
      </div>
      <div class="formItem">
        <label for="city"></label>
        <input type="text" id="city" class="input" name="city" placeholder="City">
      </div>
      <div class="formItem">
        <label for="street"></label>
        <input type="text" id="street" class="input" name="street" placeholder="Street">
      </div>
      <div id="errorMessage" ></div>
      <button id="submitBttn" class="btn btn-success" type="submit" form="formular">Complete Order</button>
    </form>
  </div>

</div>`
}

const baseSumary = () => {
  return `<div class="modal-dialog orderForm" id = "orderDetailsContainer">
  <div class="modal-content receipt">
    <div class="modal-header">
      <h4 class="modal-title">Order List</h4>
    </div>
    <div class="modal-body">
    </div>
    </div>
  </div>
</div>`
}

let allergenIdToName = (allergensInPizza) => {
  let namesToRet = "";
  for (let i = 0; i < allergensInPizza.length; i++) {
    for (let j = 0; j < allergensJSON.length; j++) {
      if (allergensInPizza[i] == allergensJSON[j].id) {
        namesToRet += `${allergensJSON[j].name}, `
      }
    }
  }
  return namesToRet.slice(0, -2);
}

let allergenIdToDivClasses = (allergensInPizza) => {
  let toRet = ""
  let allergenNamesArr = allergenIdToName(allergensInPizza).split(",");
  allergenNamesArr.forEach(allergen => {
    toRet += `${allergen} `
  })
  return toRet;
}

let createAllergensCheckers = (allergen) => {
  const root = document.getElementById("root");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `${allergen.name}Filter`;
  checkbox.className = "checkboxx"
  checkbox.value = `${allergen.name}`;

  const label = document.createElement("label");
  label.for = `${allergen.name}Filter`;
  label.className = "allergen"
  // label.textContent = `${allergen.name}`;

  allAllergens.appendChild(label);
  label.appendChild(checkbox);
  label.innerHTML += `${allergen.name}`

}


let allAllergens
let pizzaJSON, allergensJSON

const loadAPI = async () => {
  addEl("div", root, "class", "allergens")
  allAllergens = document.querySelector(".allergens")

  let pizzaList = await fetch(`http://127.0.0.1:9001/api/pizza`);
  let allergensList = await fetch(`http://127.0.0.1:9001/api/allergen`);
  pizzaJSON = await pizzaList.json();
  allergensJSON = await allergensList.json();

  allergensJSON.forEach(allergen => {
    createAllergensCheckers(allergen);
    const checkbox = document.querySelector(`#${allergen.name}Filter`)

    checkbox.addEventListener("change", () => {
      let checkedArr = [];
      const allCheckboxes = document.querySelectorAll(".checkboxx")
      const allPizzas = document.querySelectorAll(".pizza")
      allCheckboxes.forEach(checkboxx => {
        if (checkboxx.checked) {
          checkedArr.push(checkboxx.value)
        }
      })

      allPizzas.forEach(pizza => {
        pizza.classList.remove('hidden')
        checkedArr.forEach(checked => {
          if (pizza.classList.contains(checked)) {
            pizza.classList.add('hidden');
          }
        })
      })

      console.log("end");
    })
  });

  addEl("div", root, "id", "pizzaJSON")

  pizzaJSON.forEach(pizza => {
    const allPizzaDiv = document.querySelector("#pizzaJSON")

    addEl("div", allPizzaDiv, "id", `Pizza${pizza.id}`, "class", `pizza ${allergenIdToDivClasses(pizza.allergens)}`)
    const thatPizza = document.querySelector(`#Pizza${pizza.id}`)

    addEl("img", thatPizza, "src", `${pizza.image}`)

    addEl("div", thatPizza, "id", `pizzaName${pizza.id}`, "class", "pizzaName");
    const pizzaName = document.querySelector(`#pizzaName${pizza.id}`);
    pizzaName.textContent = `${pizza.name}`

    addEl("div", thatPizza, "id", `pizzaIngredients${pizza.id}`, "class", "pizzaIngredients");
    const pizzaIngredients = document.querySelector(`#pizzaIngredients${pizza.id}`);
    pizzaIngredients.textContent = `${pizza.ingredients.join(", ")}`

    addEl("div", thatPizza, "id", `pizzaPrice${pizza.id}`, "class", "pizzaPrice");
    const pizzaPrice = document.querySelector(`#pizzaPrice${pizza.id}`);
    pizzaPrice.textContent = `${pizza.price} RON`

    const amount = addEl("input", thatPizza, "id", `amount${pizza.id}`,"class", "amountInput");
    amount.placeholder = "0";

    const addButton = addEl("button", thatPizza, "data-pizza-id", `${pizza.id}`, "class", "add orderBttn");
    addButton.textContent = "Add to order";
    addButton.addEventListener("click", handleAddToOrder);

    const removeButton = addEl("button", thatPizza, "data-pizza-id", `${pizza.id}`, "class", "remove orderBttn");
    removeButton.textContent = "Remove";
    removeButton.style.display = "none";
    removeButton.addEventListener("click", handleRemoveFromOrder);
  });

  const filterBtn = document.querySelector(".filter")
  const allPizzaDiv = document.getElementById("pizzaJSON")
  const pizzas = document.querySelector(".pizza")
  console.log(pizzas)

  filterBtn.addEventListener("click", (e) => {
    console.log(allAllergens.style.visibility)
    if (allAllergens.style.visibility == "visible") {
      allAllergens.style.transition = "height 0s"
      allAllergens.style.visibility = "hidden"
      allAllergens.style.height = "5vh"
      allPizzaDiv.style.marginLeft = "50px"

    } else {
      allAllergens.style.transition = "height 3s"
      allAllergens.style.visibility = "visible"
      allAllergens.style.height = "100vh"
      allPizzaDiv.style.marginLeft = "300px"
    }
  })
  root.insertAdjacentHTML("beforeend", `<div class= "popup"></div>`)
  let popup = document.querySelector(".popup")
  popup.insertAdjacentHTML("beforeend", formular())
  popup.insertAdjacentHTML("beforeend", baseSumary())

  let cancelBtn = addEl("button", popup, "class", "cancelBtn")
  cancelBtn.innerHTML = "x"
  cancelBtn.addEventListener("click", () => {
    popup.style.visibility = "hidden"
  })

  document.querySelector(".cart").addEventListener("click", () => {
    if (cart.length === 0)
      return;
    if (popup.style.visibility === "visible") {
      popup.style.visibility = "hidden"
    } else {
      popup.style.visibility = "visible"
    }
  })

  const form = document.getElementById("formular");
  form.addEventListener("submit", submitOrder);

}

const loadEvent = () => {
  loadAPI();
};

window.addEventListener("load", loadEvent);

let cart = [];
const handleAddToOrder = (event) => {
  const pizzaId = event.target.getAttribute("data-pizza-id");
  const amount = document.getElementById(`amount${pizzaId}`);

  if (Math.floor(amount.value) <= 0 || isNaN(amount.value)) {
    return;
  }

  cart.push({
    id: pizzaId,
    amount: Math.floor(amount.value),
  })

  event.target.style.display = 'none';
  document.querySelector(`.remove[data-pizza-id='${pizzaId}']`).style.display = "";
  amount.disabled = true;

  const sumaryArea = document.querySelector("#orderDetailsContainer .modal-body")
  sumaryArea.innerHTML = "";
  sumaryArea.innerHTML = buildSumary();
}

const handleRemoveFromOrder = (event) => {
  const pizzaId = event.target.getAttribute("data-pizza-id");
  cart = cart.filter(pizza => pizza.id !== pizzaId);

  event.target.style.display = 'none';
  document.querySelector(`.add[data-pizza-id='${pizzaId}']`).style.display = "";
  const amount = document.getElementById(`amount${pizzaId}`)
  amount.disabled = false;
  amount.value = "";

  const sumaryArea = document.querySelector("#orderDetailsContainer .modal-body")
  sumaryArea.innerHTML = "";
  sumaryArea.innerHTML = buildSumary();
}

const submitOrder = (event) => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const city = document.getElementById("city");
  const street = document.getElementById("street");

  if (name.value === '' || email.value === '' || city.value === '' || street.value === '') {
    event.preventDefault();
    return false;
  }

  const dateNow = new Date();

  const order = {
    pizzas: cart,
    date: {
      year: dateNow.getFullYear(),
      month: dateNow.getMonth(),
      day: dateNow.getDay(),
      hour: dateNow.getHours(),
      minute: dateNow.getMinutes(),
    },
    customer: {
      name: name.value,
      email: email.value,
      address: {
        city: city.value,
        street: street.value,
      }
    }
  }

  fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order)
  });

  event.preventDefault();
  location.reload();
}

const buildSumary = () => {
  let subtotal = 0;
  let sumary = `
    <div class="modal-body text-start text-black p-4">
      <div id="orderList">
      </div>
      <p class="mb-0" style="color: #35558a;">Payment summary</p>
      <hr class="mt-2 mb-4"
        style="height: 0; width: 500px; background-color: transparent; opacity: .75; border-top: 2px dashed #9e9e9e;">
  `;

  cart.forEach(cartItem => {
    const pizza = pizzaJSON.find(pizza => pizza.id == cartItem.id);
    const price = cartItem.amount*pizza.price;
    sumary += `
      <div class="d-flex justify-content-between">
        <p class="small mb-0">${cartItem.amount} X ${pizza.name}</p>
        <p class="small mb-0">${price} RON</p>
      </div>
    `;
    subtotal += price;
  });
  sumary += `
      <div class="d-flex justify-content-between">
        <p class="fw-bold mb-0">Subtotal</p>
        <p id="subtotal" class="text-muted mb-0">${subtotal} RON</p>
      </div>

      <div class="d-flex justify-content-between">
        <p class="small mb-0">Delivery</p>
        <p class="small mb-0">30 RON</p>
      </div>

      <div class="d-flex justify-content-between pb-1">
        <p class="small">Tax</p>
        <p class="small">40 RON</p>
      </div>

      <div class="d-flex justify-content-between">
        <p class="fw-bold">Total</p>
        <p id="total" class="fw-bold" style="color: #35558a;">${subtotal + 70} RON</p>
      </div>
  `

  return sumary;
}