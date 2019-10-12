const en = {
  thanks:
    "<p>Thank you for your registration, We will call you soon to confirm your appointment.</p>",
  error: "<p>An error occured, please try again.</p>",
  fill: "Please fill in this field",
  validEmail: "Please enter a valid email",
  validPhone: "Enter a valid phone number",
  fill2: "This field must be at least 2 words",
  answer: "Answer the questions",
  location: "../location.html"
};
let formFields = document.querySelectorAll(
  ".card input, .card select, .card textarea"
);
function validation() {
  validateEmpty(this);
  if (this.type == "email") {
    validateEmail(this);
  }
  if (this.type == "tel") {
    validatePhone(this);
  }
  if (
    this.tagName.toLowerCase() == "textarea" &&
    this.hasAttribute("required")
  ) {
    validateTextArea(this);
  }
}
formFields.forEach(field => {
  field.addEventListener("blur", validation);
  field.addEventListener("keydown", validation);
  field.addEventListener("change", validation);
  window.addEventListener("beforeunload", function() {
    localStorage.setItem(field.name, field.value);
  });
  window.addEventListener("load", function() {
    let val = localStorage.getItem(field.name);
    if (val !== null) field.value = val;
  });
  if (field.getAttribute("type") == "submit") {
    field.addEventListener("focus", function() {
      validateEmpty(this);
    });
  }
  if (window.innerWidth == 768) {
    field.addEventListener("focus", function() {
      document.body.scrollTop = this.offsetTop;
    });
  }
});
let error = 1;
let regForm = document.querySelector("#regForm");
regForm.addEventListener("submit", function(e) {
  let sub_form = {};
  formFields.forEach(field => {
    if (
      field.getAttribute("type") !== "submit" &&
      field.offsetParent !== null
    ) {
      sub_form[field.name] = field.value;
    }
  });
  if (error > 0) {
    e.preventDefault();
    formFields.forEach(field => {
      validateEmpty(field);
    });
  } else {
    e.preventDefault();
    let modal = document.querySelector("#val-modal");
    let modalContent = modal.querySelector(".modal-content");
    window.onclick = function(e) {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    };
    modal.style.display = "block";
    if (modalContent.querySelector("p")) {
      modalContent.querySelector("p").style.display = "none";
    }
    modalContent.querySelector("img").style.display = "block";
    fetch("https://warm-garden-27894.herokuapp.com/register", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sub_form)
    })
      .then(res => {
        modalContent.querySelector("img").style.display = "none";
        modalContent.querySelectorAll("p").forEach(p => {
          p.style.display = "none";
        });
        modalContent.insertAdjacentHTML("beforeend", `<p>${en.thanks}</p>`);
        formFields.forEach(field => {
          if (
            field.getAttribute("type") !== "submit" &&
            field.offsetParent !== null
          ) {
            field.value = "";
            field.classList.remove("valid");
            field.classList.remove("invalid");
          }
        });
      })
      .catch(err => {
        modalContent.querySelector("img").style.display = "none";
        modalContent.querySelectorAll("p").forEach(p => {
          p.style.display = "none";
        });
        modalContent.insertAdjacentHTML("beforeend", `<p>${en.error}</p>`);
      });
  }
});
function validateEmpty(field) {
  if (field.hasAttribute("required")) {
    if (field.value.length > 0) {
      field.classList.add("valid");
      field.classList.remove("invalid");
      if (error > 0) {
        error -= 1;
      }
      let errorMessage = field.parentElement.lastElementChild;
      if (errorMessage.classList.contains("validate-message")) {
        errorMessage.remove();
      }
    } else {
      if (!field.classList.contains("invalid")) {
        field.classList.add("invalid");
        field.classList.remove("valid");
        error += 1;
        message(field, en.fill);
      }
    }
  }
}
function validateEmail(field) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(field.value))) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");
      error += 1;
      message(field, en.validEmail);
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");
    if (error > 0) {
      error -= 1;
    }
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}
function validatePhone(field) {
  let re = /^01\d{9}/;
  if (!re.test(field.value)) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");
      error += 1;
      message(field, en.validPhone);
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");
    if (error > 0) {
      error -= 1;
    }
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}
function validateTextArea(field) {
  let textArr = field.value.split(" ");
  if (textArr.length < 2) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");
      error += 1;
      message(field, en.fill2);
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");
    if (error > 0) {
      error -= 1;
    }
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}
function message(el, msg) {
  el.insertAdjacentHTML("afterend", `<p class="validate-message">${msg}</p>`);
}
let committeeSelect = document.querySelector("select#committee");
let committeeSelect2 = document.querySelector("select#committee2");
committeeSelect.addEventListener("change", function() {
  for (let i = 0; i < committeeSelect2.children.length; i++) {
    if (committeeSelect2.children[i].value == this.value) {
      committeeSelect2.children[i].style.display = "none";
    } else {
      committeeSelect2.children[i].style.display = "block";
    }
  }
});
let universitySelect = document.querySelector("select#university");
universitySelect.addEventListener("change", function() {
  if (this.value == "other") {
    showOtherOption(this);
  } else {
    this.parentElement.nextElementSibling.style.display = "none";
  }
});
let facultySelect = document.querySelector("select#faculty");
facultySelect.addEventListener("change", function() {
  if (this.value == "other") {
    showOtherOption(this);
  } else {
    this.parentElement.nextElementSibling.style.display = "none";
  }
  document.querySelector(".year").style.display = "block";
  if (this.value == "Engineering") {
    document.querySelector(".eng-dept").style.display = "block";
  } else {
    document.querySelector(".eng-dept").style.display = "none";
  }
  if (this.value == "pharmacyeuticals") {
    yearCount(5);
  } else if (this.value == "applied arts" || this.value == "Engineering") {
    yearCount(4);
    let option = document.createElement("option");
    option.innerHTML = "preparatory year";
    option.value = "preparatory";
    yearSelect.appendChild(option);
  } else if (this.value == "medicine") {
    yearCount(6);
  } else {
    yearCount(4);
  }
});
let yearSelect = document.querySelector("select#year");
function yearCount(count) {
  while (yearSelect.firstElementChild.nextElementSibling) {
    yearSelect.firstElementChild.nextElementSibling.remove();
  }
  for (let i = 1; i <= count; i++) {
    let option = document.createElement("option");
    if (i === 1) {
      option.innerHTML = i + "st year";
      option.value = i;
    } else if (i === 2) {
      option.innerHTML = i + "nd year";
      option.value = i;
    } else if (i === 3) {
      option.innerHTML = i + "rd year";
      option.value = i;
    } else {
      option.innerHTML = i + "th year";
      option.value = i;
    }
    yearSelect.appendChild(option);
  }
}
function showOtherOption(targetSelect) {
  let otherOption = targetSelect.parentElement.nextElementSibling;
  otherOption.style.display = "block";
  let otherInput = otherOption.querySelector("input");
  otherInput.addEventListener("change", function() {
    let option = document.createElement("option");
    option.setAttribute("selected", "selected");
    targetSelect.value = this.value;
    option.innerHTML = this.value;
    targetSelect.appendChild(option);
  });
}
window.addEventListener("load", function() {
  if (location.href.indexOf("ar") > 0) {
    btnHeader.innerHTML = ar.answer;
  } else {
    btnHeader.innerHTML = en.answer;
  }
  btnHeader.disabled = !1;
  window.scrollTo(0, 0);
});
window.addEventListener("DOMContentLoaded", function() {
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";
});
let btnHeader = document.querySelector(".btn-header");
btnHeader.addEventListener("click", function() {
  document.body.style.overflow = "auto";
  document.body.style.height = 2100 + "px";
  window.scrollTo(0, 650);
  document.querySelector(".card").classList.add("anime-form");
  document.querySelector("main .container").classList.remove("contain");
});
termsBtn = document.querySelector("#terms-click");
termsModal = document.querySelector("#tAc");
termsBtn.addEventListener("click", function(e) {
  e.preventDefault();
  termsModal.style.display = "block";
});
window.onclick = function(e) {
  if (e.target == termsModal) {
    termsModal.style.display = "none";
  }
};
let termsCheck = document.querySelector("#terms-check");
let submitBtn = document.querySelector("#regForm input[type='submit']");
submitBtn.disabled = !0;
termsCheck.addEventListener("change", function() {
  if (this.checked) {
    formFields.forEach(field => {
      validateEmpty(field);
    });
    submitBtn.disabled = !1;
  } else {
    submitBtn.disabled = !0;
  }
});
