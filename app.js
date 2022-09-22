const inputs = document.querySelectorAll(".needs-validation");
const modal = document.querySelector(".note-modal-bg");

let showNoteModal = false;

const dataFromStorage =
  localStorage.getItem("inputData") &&
  JSON.parse(localStorage.getItem("inputData"));

const initialData = {
  id: dataFromStorage ? dataFromStorage.id : "",
  firstName: dataFromStorage ? dataFromStorage.firstName : "",
  lastName: dataFromStorage ? dataFromStorage.lastName : "",
  address: dataFromStorage ? dataFromStorage.address : "",
  date: dataFromStorage ? dataFromStorage.date : "",
  gender: dataFromStorage ? dataFromStorage.gender : "",
  notes: dataFromStorage ? dataFromStorage.notes : "",
};

// ERROR HANDLING & SAVING INPUT DATA TO LOCAL STORAGE

Array.prototype.slice.call(inputs).forEach((input, index) => {
  input.addEventListener("change", (e) => {
    initialData.firstName = input.firstName.value;
    initialData.lastName = input.lastName.value;
    initialData.address = input.address.value;
    initialData.date = input.date.value;
    initialData.gender = input.gender.value;
    initialData.notes = input.notes.value;

    localStorage.setItem("inputData", JSON.stringify(initialData));
  });

  input.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();
      input.classList.add("was-validated");

      if (input.checkValidity()) {
        initialData.id = Date.now();

        const notes = getNotes();

        addToList(initialData, notes.length);
        addNote(initialData);

        localStorage.removeItem("inputData");
        input.classList.remove("was-validated");

        input.firstName.value = "";
        input.lastName.value = "";
        input.address.value = "";
        input.date.value = "";
        input.gender.value = "";
        input.notes.value = "";
      }
    },
    false
  );
});

// STORAGE FUNCTIONS
function getNotes() {
  let notes;

  if (localStorage.getItem("notes") === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem("notes"));
  }

  return notes;
}

function addNote(note) {
  const notes = getNotes();

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

// ADD & RENDER LISTS

const tBodyInfo = document.getElementById("t-body-info");

function renderList() {
  const notes = getNotes();

  notes.forEach((note, index) => addToList(note, index));
}

function addToList(note, index) {
  const row = document.createElement("tr");

  row.id = "list-item";
  row.style.cursor = "pointer";
  row.addEventListener("click", modalHandler);

  row.innerHTML = `
              <th>${index + 1} </th>
              <td>${note.firstName}</td>
              <td>${note.lastName}</td>
              <td>${note.address}</td>
              <td>${note.date}</td>
              <td>${note.gender}</td>
              <input type="hidden" value="${note.id}" />
              <td><i class="fa-solid fa-trash text-danger fs-3" style="cursor: pointer"></i></td>
          `;

  tBodyInfo.appendChild(row);
}

// RENDER DATA ON PAGE LOAD FROM LOCAL STORAGE

document.addEventListener("DOMContentLoaded", () => {
  if (dataFromStorage) {
    document.getElementById("firstName").value = dataFromStorage.firstName;
    document.getElementById("lastName").value = dataFromStorage.lastName;
    document.getElementById("address").value = dataFromStorage.address;
    document.getElementById("date").value = dataFromStorage.date;
    document.getElementById("gender").value = dataFromStorage.gender;
    document.getElementById("notes").value = dataFromStorage.notes;
  }

  renderList();
  if (!showNoteModal) {
    modal.style.display = "none";
  }
});

// DELETE TABLE ROW
tBodyInfo.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    e.target.parentElement.parentElement.remove();
    removeFromStorage(e.target.parentElement.previousElementSibling.value);
  }
});

function removeFromStorage(id) {
  const notes = getNotes();

  notes.forEach((data, index) => {
    if (data.id === +id) {
      notes.splice(index, 1);
    }
  });

  localStorage.setItem("notes", JSON.stringify(notes));
}

// MODAL FUNCTIONS
const modalContainer = document.querySelector(".note-modal-container");
const closeBtn = document.querySelector(".close-btn");
const textContainer = document.querySelector(".text-container");

function modalHandler(e) {
  if (e.target.classList.contains("fa-trash")) {
    showNoteModal = false;
    return;
  }

  showNoteModal = true;

  getNote(e.target.parentElement.lastElementChild.previousElementSibling.value);

  if (showNoteModal) {
    modal.style.display = "block";
  }
}

function getNote(noteId) {
  const notes = getNotes();

  const note = notes.find((note) => note.id === +noteId);

  if (note.notes.length > 1000) {
    textContainer.style.overflowY = "scroll";
  } else {
    textContainer.style.overflowY = "hidden";
  }

  const text = document.createElement("p");
  text.textContent = note.notes;

  textContainer.appendChild(text);
}

modal.addEventListener("click", () => {
  modal.style.display = "none";
  textContainer.removeChild(textContainer.firstElementChild);
});

modalContainer.addEventListener("click", (e) => {
  e.stopPropagation();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  textContainer.removeChild(textContainer.firstElementChild);
});
