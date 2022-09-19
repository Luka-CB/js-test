const forms = document.querySelectorAll(".needs-validation");

let savedData =
  localStorage.getItem("savedData") &&
  JSON.parse(localStorage.getItem("savedData"));

const dataFromStorage =
  localStorage.getItem("formData") &&
  JSON.parse(localStorage.getItem("formData"));

const initialData = {
  id: dataFromStorage ? dataFromStorage.id : "",
  firstName: dataFromStorage ? dataFromStorage.firstName : "",
  lastName: dataFromStorage ? dataFromStorage.lastName : "",
  address: dataFromStorage ? dataFromStorage.address : "",
  date: dataFromStorage ? dataFromStorage.date : "",
  gender: dataFromStorage ? dataFromStorage.gender : "",
  notes: dataFromStorage ? dataFromStorage.notes : "",
};

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

  savedData && render(savedData);
});

// FORM HANDLER

Array.prototype.slice.call(forms).forEach((form, index) => {
  form.addEventListener("change", (e) => {
    initialData.date = form.date.value;
    initialData.gender = form.gender.value;
    localStorage.setItem("formData", JSON.stringify(initialData));
  });

  form.addEventListener("keyup", (e) => {
    initialData.firstName = form.firstName.value;
    initialData.lastName = form.lastName.value;
    initialData.address = form.address.value;
    initialData.notes = form.notes.value;

    localStorage.setItem("formData", JSON.stringify(initialData));
  });

  form.addEventListener(
    "submit",
    (e) => {
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        e.preventDefault();
      } else {
        if (savedData) {
          initialData.id = Date.now();
          localStorage.setItem(
            "savedData",
            JSON.stringify([...savedData, initialData])
          );
        } else {
          initialData.id = Date.now();
          localStorage.setItem("savedData", JSON.stringify([initialData]));
        }

        localStorage.removeItem("formData");
        form.classList.remove("was-validated");

        form.firstName.value = "";
        form.lastName.value = "";
        form.address.value = "";
        form.date.value = "";
        form.gender.value = "";
        form.notes.value = "";
      }
    },
    false
  );
});

// RENDER FORM DATA FROM LOCAL STORAGE

const tBodyInfo = document.getElementById("t-body-info");

function render(data) {
  if (data.length === 0) {
    const noNotes = document.createElement("div");
    noNotes.classList.add("text-danger");
    noNotes.classList.add("w-100");
    noNotes.classList.add("fw-bold");
    noNotes.classList.add("h-100");
    noNotes.classList.add("position-absolute");
    noNotes.classList.add("d-flex");
    noNotes.classList.add("justify-content-center");
    noNotes.classList.add("align-items-center");

    noNotes.textContent = "No Notes!";

    tBodyInfo.appendChild(noNotes);
  } else {
    data.forEach((item, index) => {
      const row = document.createElement("tr");
      row.style.cursor = "pointer";
      row.addEventListener("mouseenter", (e) => {
        e.target.style.backgroundColor = "#e3e8e5";
      });
      row.addEventListener("mouseleave", (e) => {
        e.target.style.backgroundColor = "transparent";
      });

      row.innerHTML = `
              <th>${index + 1} </th>
              <td>${item.firstName}</td>
              <td>${item.lastName}</td>
              <td>${item.address}</td>
              <td>${item.date}</td>
              <td>${item.gender}</td>
              <input type="hidden" value="${item.id}" />
              <td><i class="fa-solid fa-trash text-danger" style="cursor: pointer"></i></td>
          `;

      tBodyInfo.appendChild(row);
    });
  }
}

// DELETE TABLE ROW
tBodyInfo.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    e.target.parentElement.parentElement.remove();
    removeFromStorage(e.target.parentElement.previousElementSibling.value);
  }
});

function removeFromStorage(id) {
  savedData.forEach((data, index) => {
    if (data.id === +id) {
      savedData.splice(index, 1);
    }
  });

  localStorage.setItem("savedData", JSON.stringify(savedData));
}
