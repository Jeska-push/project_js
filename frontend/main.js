(function () {
  const addClient = document.getElementById("addClient");
  const popupAddClientsClose = document.getElementById("popupAddClientsClose");
  const popupAddClients = document.getElementById("popupAddClients");
  const popupChangeClients = document.getElementById("popupChangeClients");
  const buttonBox = document.getElementById("buttonBox");
  const wrapper = document.querySelector(".wrapper");
  const inputSurname = document.getElementById("surname");
  const inputName = document.getElementById("name");
  const inputLastName = document.getElementById("lastname");
  const listClients = document.getElementById("list-clients");
  const optionContact = document.createElement("div");
  optionContact.setAttribute("id", "option-contact");
  optionContact.classList.add("option-contact");
  buttonBox.append(optionContact);
  let contactsList = [];
  let obj = {};
  let iD;
  const formAddClients = document.querySelector(".form");
  const formChangeClients = document.querySelector(".form1");
  console.log(formAddClients);
  let selectName = document.querySelector('[name="selectName"]');
  let b = 0;
  let id = 0;
  const titles = document.querySelectorAll(".title");

  document.addEventListener("DOMContentLoaded", async function (e) {
    loadTodoItems().then((clientsListServer) => {
      clientsListServer.forEach((clientsObj) => {
        if (clientsListServer.length > 0) {
          render({
            surname: clientsObj.surname.trim(),
            name: clientsObj.name.trim(),
            lastName: clientsObj.lastName.trim(),
            contacts: clientsObj.contacts,
            id: clientsObj.id,
            updatedAt: clientsObj.updatedAt,
            createdAt: clientsObj.createdAt,
          });
        }
      });
    });
  });

  function capitalizeFLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  // Получить всех клиентов
  async function loadTodoItems() {
    const response = await fetch("http://localhost:3000/api/clients/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    return data;
  }

  //Получить клиента по id
  async function loadTodoItemsId(id) {
    const response = await fetch("http://localhost:3000/api/clients/" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    return data;
  }

  //Удалить клиента по id
  async function deleteTodoItem(id) {
    let response = await fetch("http://localhost:3000/api/clients/" + id, {
      method: "DELETE",
    });
    let data = await response.json();
    return data;
  }

  //Показать элемент
  function show(el) {
    el.style.display = "flex";
    el.classList.add("flex");
  }

  //Скрыть элемент
  function hide(el) {
    el.style.display = "none";
    el.classList.remove("flex");
  }

  // Запрос на добавление нового клиента
  async function createTodoItem(client) {
    console.log(client);
    const response = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surname: client.surname.trim(),
        name: client.name.trim(),
        lastName: client.lastName.trim(),
        contacts: contactsList,
      }),
    });
    let data = await response.json();

    //Очищаем список
    listClients.replaceChildren();

    //Запрос на получение  с сервера обновленного списка клиентов
    loadTodoItems().then((clientsListServer) => {
      clientsListServer.forEach((clientsObj) => {
        if (clientsListServer.length > 0) {
          //Отрисовка списка клиентов в таблице
          render({
            surname: clientsObj.surname.trim(),
            name: clientsObj.name.trim(),
            lastName: clientsObj.lastName.trim(),
            contacts: {
              type: clientsObj.contacts.type,
              value: clientsObj.contacts.value,
            },
            id: clientsObj.id,
          });
        }
      });
    });
  }

  //Звездочка к placeholder
  inputSurname.addEventListener("input", function (e) {
    if (inputSurname.value !== "") {
      document.querySelector(".star-1").setAttribute("style", "display:none");
    } else {
      document.querySelector(".star-1").setAttribute("style", "display:block");
    }
  });
  inputName.addEventListener("input", function (e) {
    if (inputName.value !== "") {
      document.querySelector(".star-2").setAttribute("style", "display:none");
    } else {
      document.querySelector(".star-2").setAttribute("style", "display:block");
    }
  });

  //Прослушивание формы ДОБАВЛЕНИЯ клиента
  formAddClients.addEventListener("submit", async function (e) {
    document.getElementById("popupChangeClients").classList.remove("active");
    if (test(this) === false) {
      e.preventDefault();
    }

    if (test(this)) {
      const inputSurnameVal = capitalizeFLetter(inputSurname.value);
      const inputNameVal = capitalizeFLetter(inputName.value);
      const inputLastNameVal = capitalizeFLetter(inputLastName.value);

      let inputBoxes = document.querySelectorAll(".input-box");

      for (let i = 0; i < inputBoxes.length; i++) {
        let inputBox = inputBoxes[i];
        obj = {
          type: inputBox.children[0].value,
          value: inputBox.children[1].value,
        };
        contactsList.push(obj);
      }

      const client = {
        surname: inputSurnameVal.trim(),
        name: inputNameVal.trim(),
        lastName: inputLastNameVal.trim(),
        contacts: {
          type: contactsList.type,
          value: contactsList.value,
        },
      };

      await createTodoItem(client);
      formAddClients.reset();
    }
    return;
  });

  function addLayer() {
    wrapper.setAttribute("style", "opacity: 0.6; position: fixed;");
  }

  function removeLayer() {
    wrapper.setAttribute("style", "opacity: 0; position: static;");
  }

  //Слушатель на кнопку "Добавить клиента"
  addClient.addEventListener("click", function (e) {
    show(popupAddClients);
    addLayer();
    let inputBox = document.querySelectorAll(".input-box");
    inputBox.forEach((input) => {
      input.remove();
    });
    formAddClients.reset();
  });

  //Слушатель на крестик в окне "Добавить клиента"
  popupAddClientsClose.addEventListener("click", function (e) {
    hide(popupAddClients);
    removeLayer();
  });

  //Слушатель на кнопку "Добавить контакт" для нового клиента
  buttonAdd.addEventListener("click", function (e) {
    let inputContacts = Array.from(document.querySelectorAll(".input-box"));
    console.log(inputContacts);
    if (inputContacts.length === 0) {
      buttonBox.setAttribute("style", "padding-top: 25px");
    }
    createInputContactNew();
  });

  //Слушатель на кнопку "Добавить контакт"  при изменении данных клиента
  buttonChange.addEventListener("click", function (e) {
    createInputContactChange();
  });

  //Слушатели на кнопки "Отмена"

  const popupAddLink = document.querySelector(".popup__add-link");
  popupAddLink.addEventListener("click", function (e) {
    deletePopup("popupAddClients");
    removeLayer();
  });

  let popupDeleteLink = document.querySelector(".popup__delete-link");
  popupDeleteLink.addEventListener("click", function (e) {
    console.log(e.target);
    deletePopup("popupDeleteClient");
    removeLayer();
  });

  //Слушатель на select

  // Создание select
  function generateSelect(inputBox) {
    const generateSelect = `
    <select class="selectContacts"  name="selectName" >
      <option class="option" id="tel" value="Телефон">Tелефон</option>
      <option class="option" id="Email" value="Email">Email</option>
      <option class="option" id="fb" value="Facebook">Facebook</option>
      <option class="option" id="vk" value="ВКонтакте">ВКонтакте</option>
    </select>
  `;
    inputBox.insertAdjacentHTML("afterBegin", generateSelect);
  }

  //Создание нового дела

  function createInputContactNew() {
    inputContacts = document.getElementById("inputContacts");
    const inputBox = document.createElement("div");
    inputBox.classList.add("input-box");
    inputContacts.append(inputBox);
    const inputtel = document.createElement("input");
    inputtel.setAttribute("placeholder", "Введите данные контакта");
    inputtel.setAttribute("name", "Телефон");
    inputtel.classList.add("input-tel", "inp");

    inputBox.append(inputtel);
    let buttonAdd = document.getElementById("buttonAdd");
    generateSelect(inputBox);
    selectContacts = document.querySelectorAll(".selectContacts");

    let inputBoxes = document.querySelectorAll(".input-box");

    for (let i = 0; i < inputBoxes.length; i++) {
      let inputBox = inputBoxes[i];
      console.log(inputBox);

      inputBox.addEventListener("click", function (e) {
        if (e.target.classList.contains("selectContacts")) {
          e.target.parentNode.children[0].classList.toggle("change-arrow");
        }

        console.log(e.target);
        e.target.classList.remove("act");
        if (e.target.value === "Телефон") {
          let id = getId();
          let inputtel = e.target.parentNode.children[1];
          inputtel.value = "";
          inputtel.setAttribute("placeholder", "+7(918)875-87-38");
          e.target.setAttribute("data-id", id);
          inputtel.setAttribute("data-id", id);
          inputtel.setAttribute("name", "Телефон");
          inputtel.setAttribute("type", "tel");
          inputtel.classList.add("input-tel", "inp");
          e.target.classList.add("act");
        }

        if (e.target.value === "Email") {
          let id = getId();
          const inputEmail = e.target.parentNode.children[1];
          inputEmail.value = "";
          e.target.setAttribute("data-id", id);
          inputEmail.setAttribute("data-id", id);
          inputEmail.setAttribute("type", "Email");
          inputEmail.setAttribute("name", "Email");
          inputEmail.setAttribute("placeholder", "Введите email");
          inputEmail.classList.add("input-tel", "inp");
          e.target.classList.add("act");
        }

        if (e.target.value === "Facebook") {
          let id = getId();
          let inputfb = e.target.parentNode.children[1];
          inputfb.value = "";
          e.target.setAttribute("data-id", id);
          inputfb.setAttribute("data-id", id);
          inputfb.setAttribute("name", "Facebook");
          inputfb.setAttribute("type", "url");
          inputfb.setAttribute("placeholder", "Введите ссылку на facebook");
          inputfb.classList.add("input-tel", "inp");
          e.target.classList.add("act");
        }
        if (e.target.value === "ВКонтакте") {
          let id = getId();
          let inputvk = e.target.parentNode.children[1];
          inputvk.value = "";
          e.target.setAttribute("data-id", id);
          inputvk.setAttribute("data-id", id);
          inputvk.setAttribute("name", "ВКонтакте");
          inputvk.setAttribute("type", "url");
          inputvk.setAttribute("placeholder", "Введите ссылку на ВКонтакте");
          e.target.classList.add("act");
        }
      });
    }
  }

  // Изменение нового дела
  function createInputContactChange(contact) {
    let inputContacts1 = document.getElementById("inputContacts1");
    const inputBox = document.createElement("div");
    inputBox.classList.add("input-box-change");
    inputContacts1.append(inputBox);
    const inputtel = document.createElement("input");
    inputtel.setAttribute("placeholder", "Введите данные контакта");
    if (contact) inputtel.setAttribute("name", contact.type);
    // inputtel.setAttribute("name", "Телефон");
    inputtel.classList.add("input-tel", "inp", "input-change");
    let inputBoxClose = document.createElement("btn");
    inputBoxClose.classList.add("input-box-close");
    inputBox.append(inputtel);
    inputBox.append(inputBoxClose);

    generateSelect(inputBox);
    if (contact) inputtel.value = contact.value;

    let selectContacts = document.querySelectorAll(".selectContacts");

    selectContacts.forEach((select) => {
      console.log(select.value);
      if (!select.classList.contains("act")) {
        select.classList.add("act");
      }
      select.classList.remove("act");
      let options = select.querySelectorAll(".option");

      options.forEach((option) => {
        if (!option.classList.contains("act")) {
          if (option.hasAttribute("selected")) {
            option.removeAttribute("selected");
          }
          if (contact) {
            if (option.textContent === contact.type) {
              option.setAttribute("selected", true);
            }
          }
        }
        option.classList.add("act");
      });
    });

    let inputBoxes = document.querySelectorAll(".input-box-change");
    inputBoxClose = document.querySelectorAll(".input-box-close");
    console.log(inputBoxClose);

    inputBoxClose.forEach((close) =>
      close.addEventListener("click", async function (e) {
        console.log(close);
        e.target.parentNode.remove();
      })
    );

    for (let i = 0; i < inputBoxes.length; i++) {
      let inputBox = inputBoxes[i];

      inputBox.addEventListener("click", function (e) {
        if (e.target.classList.contains("selectContacts")) {
          e.target.parentNode.children[0].classList.toggle("change-arrow");
        }
        if (e.target.value === "Телефон") {
          let id = getId();
          let inputtel = e.target.parentNode.children[1];
          inputtel.value = "";
          inputtel.setAttribute("placeholder", "+7(918)875-87-58");
          e.target.setAttribute("data-id", id);
          inputtel.setAttribute("data-id", id);
          inputtel.setAttribute("name", "Телефон");
          inputtel.setAttribute("type", "tel");
          inputtel.classList.add("input-tel", "inp");
        }

        if (e.target.value === "Email") {
          let id = getId();
          const inputEmail = e.target.parentNode.children[1];
          inputEmail.value = "";
          e.target.setAttribute("data-id", id);
          inputEmail.setAttribute("data-id", id);
          inputEmail.setAttribute("type", "Email");
          inputEmail.setAttribute("name", "Email");
          inputEmail.setAttribute("placeholder", "Введите email");
          inputEmail.classList.add("input-tel", "inp");
        }
        if (e.target.value === "Facebook") {
          let id = getId();
          let inputfb = e.target.parentNode.children[1];
          inputfb.value = "";

          e.target.setAttribute("data-id", id);
          inputfb.setAttribute("data-id", id);
          inputfb.setAttribute("name", "Facebook");
          inputfb.setAttribute("type", "url");
          inputfb.setAttribute("placeholder", "Введите ссылку на facebook");
          inputfb.classList.add("input-tel", "inp");
        }
        if (e.target.value === "ВКонтакте") {
          let id = getId();
          let inputvk = e.target.parentNode.children[1];
          inputvk.value = "";

          e.target.setAttribute("data-id", id);
          inputvk.setAttribute("data-id", id);
          inputvk.setAttribute("name", "ВКонтакте");
          inputvk.setAttribute("type", "url");
          inputvk.setAttribute("placeholder", "Введите ссылку на ВКонтакте");
        }
      });
    }

    let popupChangeClientsClose = document.getElementById(
      "popupChangeClientsClose"
    );
    console.log(popupChangeClientsClose);

    popupChangeClientsClose.addEventListener("click", function (e) {
      removeLayer();
      document
        .getElementById("popupChangeClients")
        .setAttribute("style", "display: none");
      popupChangeClients.classList.remove("active");
      const formChangeClients = document.getElementById("formChangeClients");
      formChangeClients.reset();
      let inputBoxChange = document.querySelectorAll(".input-box-change");
      let inputContacts1 = document.getElementById("inputContacts1");
      inputBoxChange.forEach((input) => {
        input.remove();
      });
    });
  }
  function deletePopup(popupName) {
    document.getElementById(popupName).setAttribute("style", "display: none");
    messageBox.replaceChildren;
  }
  let popupDeleteClient = document.getElementById("popupDeleteClient");
  console.log(popupDeleteClient);

  let popupDeleteClientClose = document.getElementById(
    "popupDeleteClientClose"
  );

  popupDeleteClientClose.addEventListener("click", function (e) {
    deletePopup("popupDeleteClient");
    removeLayer();
  });

  function sortUp(arr, prop) {
    console.log(prop);

    let result = arr.sort(function (a, b) {
      let dataA;
      let dataB;
      if (prop === "id") {
        dataA = a.id;
        dataB = b.id;
      }
      if (prop === "fio") {
        dataA = a.surname + a.name + a.lastName;
        dataB = b.surname + b.name + b.lastName;
      }
      if (prop === "createdAt") {
        dataA = a.createdAt;
        dataB = b.createdAt;
      }
      if (prop === "updatedAt") {
        dataA = a.updatedAt;
        dataB = b.updatedAt;
      }

      if (dataA > dataB) {
        return -1;
      }
    });

    return result;
  }

  function sortDown(arr, prop) {
    console.log(prop);

    let result = arr.sort(function (a, b) {
      let dataA;
      let dataB;
      if (prop === "id") {
        dataA = a.id;
        dataB = b.id;
      }
      if (prop === "fio") {
        dataA = a.surname + a.name + a.lastName;
        dataB = b.surname + b.name + b.lastName;
      }
      if (prop === "createdAt") {
        dataA = a.createdAt;
        dataB = b.createdAt;
      }
      if (prop === "updatedAt") {
        dataA = a.updatedAt;
        dataB = b.updatedAt;
      }
      if (dataA < dataB) {
        return -1;
      }
    });

    return result;
  }

  // Сортировка
  function addSort(title) {
    title.addEventListener("click", function (e) {
      listClients.replaceChildren();
      loadTodoItems().then((clientsListServer) => {
        console.log(clientsListServer);

        let eventTarget = e.target;
        console.log(eventTarget);

        let copy = [...clientsListServer];

        if (eventTarget.id === "fio") {
          copy = [...clientsListServer];
          prop = "fio";
          if (eventTarget.classList.contains("btn-fio")) {
            eventTarget.classList.remove("btn-fio");
            eventTarget.classList.add("btn-fio-1");
            sortUp(copy, prop);
          } else {
            eventTarget.classList.add("btn-fio");
            eventTarget.classList.remove("btn-fio-1");
            sortDown(copy, prop);
          }
        }

        if (eventTarget.id === "client-id") {
          copy = [...clientsListServer];
          prop = "id";
          if (!eventTarget.classList.contains("arrow-up")) {
            eventTarget.classList.add("arrow-up");
            sortUp(copy, prop);
          } else {
            eventTarget.classList.remove("arrow-up");
            sortDown(copy, prop);
          }
        }

        if (eventTarget.id === "dataCreate") {
          copy = [...clientsListServer];
          prop = "createdAt";
          if (!eventTarget.classList.contains("arrow-up")) {
            eventTarget.classList.add("arrow-up");
            sortUp(copy, prop);
          } else {
            eventTarget.classList.remove("arrow-up");
            sortDown(copy, prop);
          }
        }

        if (eventTarget.id === "dataUpdate") {
          copy = [...clientsListServer];
          prop = "updatedAt";

          if (!eventTarget.classList.contains("arrow-up")) {
            eventTarget.classList.add("arrow-up");
            sortUp(copy, prop);
          } else {
            eventTarget.classList.remove("arrow-up");
            sortDown(copy, prop);
          }
        }

        for (let i = 0; i < copy.length; i++) {
          let clientsObj = copy[i];
          render({
            surname: clientsObj.surname.trim(),
            name: clientsObj.name.trim(),
            lastName: clientsObj.lastName.trim(),
            contacts: clientsObj.contacts,
            id: clientsObj.id,
            updatedAt: clientsObj.updatedAt,
            createdAt: clientsObj.createdAt,
          });
        }
      });
    });
  }

  for (i = 0; i < titles.length; i++) {
    let title = titles[i];
    addSort(titles[i]);
  }

  const inputSearch = document.querySelector(".inputSearch"); //поле поиска
  let inputSearchValue;
  async function searchClient(inputSearchValue) {
    console.log(inputSearchValue);

    const response = await fetch(
      `http://localhost:3000/api/clients?search=${inputSearchValue}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    let data = await response.json();
    console.log(response);
    return data;
  }

  inputSearch.addEventListener("input", async function (e) {
    inputSearchValue = inputSearch.value;
    let clientsArr = searchClient(inputSearchValue);
    setTimeout(clientsArr, 300);
    clientsArr.then((searchListServer) => {
      listClients.replaceChildren();
      searchListServer.forEach((clientsObj) => {
        render({
          surname: clientsObj.surname.trim(),
          name: clientsObj.name.trim(),
          lastName: clientsObj.lastName.trim(),
          contacts: clientsObj.contacts,
          id: clientsObj.id,
          updatedAt: clientsObj.updatedAt,
          createdAt: clientsObj.createdAt,
        });
      });
    });
    //
  });

  // Отрисовка//////////////////////////////////////////////
  function render(clientsObj) {
    let tr = document.createElement("tr");
    tr.classList.add("row");

    b++;
    listClients.append(tr);
    let arr = Object.values(clientsObj);
    let contactClient = clientsObj.contacts; //контакты
    let arr1 = Object.entries(clientsObj);
    let n = 3;
    //1
    let td = document.createElement("td");
    td.classList.add("col", "col-1");
    td.textContent = arr[4];
    id++;
    tr.setAttribute("id", clientsObj.id);
    tr.append(td);
    //2
    td = document.createElement("td");
    td.classList.add("fio", "col", "col-2");
    td.textContent = arr[0] + " " + arr[1] + " " + arr[2];
    tr.append(td);

    //boxtd
    boxtd = document.createElement("td");
    boxtd.classList.add("box-td-date", "col-3");
    tr.append(boxtd);
    //3
    td = document.createElement("td");
    // td.classList.add("col");
    let create = clientsObj.createdAt;
    td.textContent = createDate(create) + Array(2).fill("\xa0").join("");
    td.classList.add("add-data");
    boxtd.append(td);

    td = document.createElement("td");
    td.classList.add("add-time");
    td.textContent = createTime(create);

    boxtd.append(td);

    //boxtd
    boxtd = document.createElement("td");
    boxtd.classList.add("box-td-date", "col-4");
    tr.append(boxtd);
    //4

    td = document.createElement("td");
    let createNew = clientsObj.updatedAt;
    td.textContent = createDate(createNew) + Array(2).fill("\xa0").join("");
    td.classList.add("add-data");
    boxtd.append(td);

    td = document.createElement("td");
    td.classList.add("add-time");
    td.textContent = createTime(createNew);
    boxtd.append(td);

    //5
    td = document.createElement("td");
    td.classList.add("col", "col-5");
    console.log(arr[3]);

    if (arr[3].length !== 0) {
      let buttonBox2 = document.getElementById("buttonBox2");
      console.log(buttonBox2);
      buttonBox2.setAttribute("style", "padding-top: 25px");
    }
    for (let i = 0; i < arr[3].length; i++) {
      if (i === 4) {
        if (arr[3].length > 4) {
          let iconBox1 = document.createElement("div");
          iconBox1.classList.add("icon-box1");
          let number = arr[3].length - 4;
          iconBox1.textContent = "+" + number;
          iconBox1.setAttribute(
            "style",
            "margin-right:0px; padding-top: 1px; padding-left: 1px; border: 1px solid #9873FF; border-radius: 50%; font-size: 10px;text-align: left; width:16px; height:16px; cursor:pointer"
          );

          td.append(iconBox1);
        }
        break;
      } //оставляем 4 иконки

      let link = arr[3][i].value;
      console.log(arr[3][i]);
      console.log(link);

      if (arr[3][i].type === "Facebook") {
        let icon = document.createElement("img");
        let iconBox = document.createElement("div");
        iconBox.classList.add("icon-box");

        iconBox.setAttribute("data-title", "Facebook: " + arr[3][i].value);
        icon.setAttribute("src", "img/fb.svg");
        iconBox.setAttribute("style", "margin-right: 7px");
        icon.classList.add("icon");
        iconBox.append(icon);
        td.append(iconBox);

        console.log(arr[3][i].value);
      }
      if (arr[3][i].type === "Телефон") {
        let icon = document.createElement("img");
        let iconBox = document.createElement("div");
        iconBox.classList.add("icon-box");
        iconBox.setAttribute("data-title", "Телефон: " + arr[3][i].value);
        icon.setAttribute("src", "img/phone.svg");
        iconBox.setAttribute("style", "margin-right: 7px");
        icon.classList.add("icon");
        iconBox.append(icon);
        td.append(iconBox);
      }

      if (arr[3][i].type === "Email") {
        let icon = document.createElement("img");
        let iconBox = document.createElement("div");
        iconBox.classList.add("icon-box");
        icon.setAttribute("src", "img/mail.svg");
        iconBox.setAttribute("data-title", "Email: " + arr[3][i].value);
        iconBox.setAttribute("style", "margin-right: 7px");
        icon.classList.add("icon");
        iconBox.append(icon);
        td.append(iconBox);
      }

      if (arr[3][i].type === "ВКонтакте") {
        let icon = document.createElement("img");
        let iconBox = document.createElement("div");
        iconBox.classList.add("icon-box");
        iconBox.setAttribute("data-title", "ВКонтакте: " + arr[3][i].value);
        icon.setAttribute("src", "img/vk.svg");
        iconBox.setAttribute("style", "margin-right: 7px");
        icon.classList.add("icon");
        iconBox.append(icon);
        td.append(iconBox);
      }
    }
    tr.append(td);
    //boxtd
    boxtd1 = document.createElement("td");
    boxtd1.classList.add("box-td");
    tr.append(boxtd1);
    //6
    td = document.createElement("td");
    td.classList.add("col", "col-6");
    let c = document.createElement("a");
    c.classList.add("change-client");
    c.setAttribute("disabled", "false");
    c.textContent = "Изменить";
    td.append(c);
    boxtd1.append(td);
    tr.append(boxtd1);

    //7
    td = document.createElement("td");
    td.classList.add("col", "col-7");
    let a = document.createElement("a");
    a.classList.add("delete-client");
    a.setAttribute("href", "#");

    a.textContent = "Удалить";
    td.append(a);
    boxtd1.append(td);
    tr.append(boxtd1);

    //...................Удаление клиетна......................................................
    a.addEventListener("click", function (e) {
      addLayer();
      let popupDeleteClient = document.getElementById("popupDeleteClient");
      popupDeleteClient.setAttribute("style", "opacity:1; z-index:1000");
      let eventTarget = e.target;
      let parent = eventTarget.parentNode;
      let parent1 = parent.parentNode;
      let parent2 = parent1.parentNode;
      iD = parent2.firstChild.textContent;
    });

    let btnDelete = document.getElementById("popup__deleteClient-btnDelete");
    btnDelete.addEventListener("click", async function (e) {
      removeLayer();
      let popupDeleteClient = document.getElementById("popupDeleteClient");
      popupDeleteClient.setAttribute("style", "display:none");
      console.log(listClients.children);
      let arr = listClients.children;
      console.log(arr);
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];

        if (item.id === iD) {
          console.log(item);
          await deleteTodoItem(item.id);
          item.remove();
        }
      }
    });
    //...................Изменение......................................................
    c.addEventListener("click", async function (e) {
      let strId = e.target.parentNode.parentNode.previousElementSibling;
      let inputBoxChange = document.querySelectorAll(".input-box-change");
      let newInputBox = document.querySelectorAll(".new-input-box");

      inputBoxChange.forEach((input) => {
        console.log(input);
        input.remove();
      });
      // removeLayer();
      document
        .getElementById("popupChangeClients")
        .setAttribute("style", "display: none");
      document.getElementById("popupChangeClients").classList.remove("active");

      if (strId.children.length > 9) {
        buttonChange.setAttribute("disabled", "true");
      }
      if (strId.children.length <= 9) {
        buttonChange.removeAttribute("disabled");
      }
      let popupChangeClients = document.getElementById("popupChangeClients");
      if (popupChangeClients.classList.contains("active")) {
        let inputBoxChange = inputContacts1.children;
        console.log(inputBoxChange);
        inputBoxChange.forEach((input) => {
          input.remove();
        });
      }

      let id = clientsObj.id;
      clientsObj.contacts = [];
      document
        .getElementById("popupChangeClients")
        .setAttribute("style", "display: flex");
      document.getElementById("popupChangeClients").classList.add("active");
      inputBoxChange = document.querySelectorAll(".input-box-change");

      inputBoxChange.forEach((input) => {
        input.remove();
      });
      loadTodoItemsId(id).then((client) => {

        let inputSurname = document.getElementById("surnameChange");
        inputSurname.value = client.surname;
        let inputName = document.getElementById("nameChange");
        inputName.value = client.name;
        let inputlastName = document.getElementById("lastnameChange");
        inputlastName.value = client.lastName;
        let contacts = client.contacts;
        let buttonChange = document.getElementById("buttonChange");
        let numberId = document.getElementById("numberId");
        numberId.textContent = id;
        const popupChangeLink = document.querySelector(".popup__change-link");

        popupChangeLink.addEventListener("click", async function (e) {
          document
            .getElementById("popupChangeClients")
            .classList.remove("active");
          deletePopup("popupChangeClients");

          let popupDeleteClient = document.getElementById("popupDeleteClient");
          popupDeleteClient.setAttribute("style", "opacity:1; z-index:1000");
        });

        let btnDelete = document.getElementById(
          "popup__deleteClient-btnDelete"
        );

        btnDelete.addEventListener("click", async function (e) {
          removeLayer();
          let elem = document.getElementById("numberId");
          let iD = elem.textContent;

          let popupDeleteClient = document.getElementById("popupDeleteClient");
          popupDeleteClient.setAttribute("style", "display:none");
          let arr = listClients.children;
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i];

            if (item.id === iD) {
              await deleteTodoItem(item.id);
              item.remove();
            }
          }
        });

        if (contacts.length > 0) {
          contacts.forEach((contact) => {
            console.log(contact);

            createInputContactChange(contact);
          });
          addLayer();
        }

        formChangeClients.addEventListener("submit", async function (e) {
          let messageBox1 = document.getElementById("messageBox1").children;


          for (let i = 0; i < messageBox1.length; i++) {
            let message = messageBox1[i];
            message.remove();
          }

          function capitalizeFLetter(string) {
            return string[0].toUpperCase() + string.slice(1);
          }
          if (test(this) === false) {
            e.preventDefault();
          }
          if (test(this)) {
            const inputSurnameValue = capitalizeFLetter(
              document.getElementById("surnameChange").value
            );
            const inputNameValue = capitalizeFLetter(
              document.getElementById("nameChange").value
            );
            const inputLastNameValue = capitalizeFLetter(
              document.getElementById("lastnameChange").value
            );
            let inputContacts1 = document.getElementById("inputContacts1");
            let inputBoxes1 = inputContacts1.children;

            for (let i = 0; i < inputBoxes1.length; i++) {
              let inputBox = inputBoxes1[i];
              obj = {
                type: inputBox.children[0].value,
                value: inputBox.children[1].value,
              };
              contactsList.push(obj);
            }
            let numberId = document.getElementById("numberId");

            let updatedAt = currentDate();

            const client = {
              surname: inputSurnameValue.trim(),
              name: inputNameValue.trim(),
              lastName: inputLastNameValue.trim(),
              contacts: contactsList,
              id: numberId.textContent,
              updatedAt: updatedAt,
            };

            async function changeTodoItemsId(id) {
              const response = await fetch(
                "http://localhost:3000/api/clients/" + id,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    surname: inputSurnameValue.trim(),
                    name: inputNameValue.trim(),
                    lastName: inputLastNameValue.trim(),
                    contacts: contactsList,
                    updatedAt: updatedAt,
                  }),
                }
              );
              let data = await response.json();
              console.log(data);
            }
            await changeTodoItemsId(client.id);
            inputContacts1.replaceChildren;
          }
          return;
        });
      });
    });
  }

  function currentDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let currentDate = day + "." + month + "." + year;
    return currentDate;
  }
  function createTime(create) {
    let date = create.substring(11, 16);
    let currentHours = date.substring(0, 2);
    let currentMinutes = date.substring(2, 5);
    let currentTime = currentHours + currentMinutes;
    return currentTime;
  }

  function createDate(create) {
    console.log(create);

    let date = create.substring(0, 10);
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    console.log(month);
    let day = date.substring(8, 10);
    let currentDate = day + "." + month + "." + year;
    return currentDate;
  }

  function getId(length = 16) {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let res = "";
    for (let i = 0; i < length; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let tg;

  //Проверка на валидность
  function test() {
    let result = true;

    if (popupAddClients.classList.contains("flex")) {
      messageBox = document.getElementById("messageBox");
      console.log(messageBox);
      allinputs = document.querySelectorAll(".input-tel");
    } else {
      messageBox = document.getElementById("messageBox1");
      allinputs = document.querySelectorAll(".input-change");
    }
    messageBox.replaceChildren();

    function createError(input, text) {
      const parent = input.parentNode;
      if (input.classList.contains("input")) {
        input.classList.add("error");
        input.setAttribute("style", "border: 1px solid red");
      } else {
        parent.classList.add("error");
        parent.setAttribute("style", "border: 1px solid red");
      }

      let item = document.createElement("li");
      item.classList.add("item");
      item.textContent = text;
      messageBox.append(item);
    }

    function isCyrillic(str) {
      //Функция проверки букв на кириллицу
      return /[а-я]/i.test(str);
    }

    function validNumberPhone(phone) {
      const regex = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
      return regex.test(phone);
    }

    function validateEmail(Email) {
      const pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(String(Email).toLowerCase());
    }
    function validateURL(url) {
      const pattern =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
      return pattern.test(String(url));
    }
    console.log(allinputs);

    allinputs.forEach((input) => {
      if (input.classList.contains("error")) {
        input.classList.remove("error");
        input.setAttribute("style", "border-bottom: 1px solid");
      }

      if (input.value == "") {
        console.log("9999999");
        let messageText;

        if (input.name) {
          messageText = 'Поле "' + `${input.name}` + '" не заполнено';
        }

        createError(input, messageText);
        result = false; // если хотя бы у одного поля будет ошибка, то форма не отправится
      }

      if (input.value !== "") {
        let res = isCyrillic(input.value);

        let resNumberPhone = validNumberPhone(input.value);

        let resValidateEmail = validateEmail(input.value);
        let resValidateURL = validateURL(input.value);

        if (
          (res === false && input.id === "surname") ||
          (res === false && input.id === "surnameChange")
        ) {
          createError(input, "Введите фамилию на кириллице");
          result = false;
        }

        if (
          (res === false && input.id === "name") ||
          (res === false && input.id === "nameChange")
        ) {
          createError(input, "Введите имя на кириллице");
          result = false;
        }

        if (
          (res === false && input.id === "lastname") ||
          (res === false && input.id === "lastnameChange")
        ) {
          createError(input, "Введите отчество на кириллице");
          result = false;
        }

        if (resNumberPhone === false && input.name === "Телефон") {
          createError(input, "Введите номер телефона в указанном формате");
          result = false;
        }

        if (resValidateEmail === false && input.name === "Email") {
          createError(input, "Введите email правильно");
          result = false;
        }
        if (resValidateURL === false && input.name === "Facebook") {
          createError(input, "Введите адрес ссылки на Facebook правильно");
          result = false;
        }
        if (resValidateURL === false && input.name === "ВКонтакте") {
          createError(input, "Введите адрес ссылки ВКонтакте правильно");
          result = false;
        }
      }
    });
    return result;
  }
})();
