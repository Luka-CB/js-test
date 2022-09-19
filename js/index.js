const forms = document.querySelectorAll(".needs-validation");

const dataFromStorage =
  localStorage.getItem("formData") &&
  JSON.parse(localStorage.getItem("formData"));

const initialData = {
  firstName: dataFromStorage ? dataFromStorage.firstName : "",
  lastName: dataFromStorage ? dataFromStorage.lastName : "",
  address: dataFromStorage ? dataFromStorage.address : "",
  date: dataFromStorage ? dataFromStorage.date : "",
  gender: dataFromStorage ? dataFromStorage.gender : "",
  notes: dataFromStorage ? dataFromStorage.notes : "",
};

document.addEventListener("DOMContentLoaded", () => {
  if (dataFromStorage) {
    document.getElementById("firstName").value = dataFromStorage.firstName;
    document.getElementById("lastName").value = dataFromStorage.lastName;
    document.getElementById("address").value = dataFromStorage.address;
    document.getElementById("date").value = dataFromStorage.date;
    document.getElementById("gender").value = dataFromStorage.gender;
    document.getElementById("notes").value = dataFromStorage.notes;
  }
});

Array.prototype.slice.call(forms).forEach((form) => {
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
      e.preventDefault();

      form.classList.add("was-validated");

      if (form.checkValidity()) {
        const savedData =
          localStorage.getItem("savedData") &&
          JSON.parse(localStorage.getItem("savedData"));

        if (savedData) {
          localStorage.setItem(
            "savedData",
            JSON.stringify([...savedData, initialData])
          );
        } else {
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
