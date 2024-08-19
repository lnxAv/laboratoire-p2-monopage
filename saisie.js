// UTILS
const calculateAge = (birthday) => {
  const age = (Date.now() - birthday) / 31557600000;
  return age;
};

function toDateInputValue(dateObject) {
  const local = new Date(dateObject);
  local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}

// FORM SHAPE
/* establish the shape of the form
  - each key is the id of the input
  - each value is an object with the following properties:
    - type: the type of the input
    - title: the title of the input
    - required: whether the input is required
    - validation: a function that takes the input object as a parameter and returns a string if the input is invalid, or true if it is valid
    - onChange: a function that takes the input object as a parameter and is called when the input changes
    - disable: a function that takes the input object as a parameter and returns true if the input should be disabled, or false if it should be enabled
    - options: an array of options for select and radio inputs
    - default: the default value of the input
    - pattern: the pattern of the input
*/
const formShape = {
  nom: {
    type: "text",
    title: "Nom",
    required: true,
    validation: function (obj) {
      const value = obj.value;
      const regex = /^[a-zA-Z]+$/;
      if (!regex.test(value)) {
        return "Nom invalide";
      }
      if (value.length < 3) {
        return "Nom trop court";
      }
      return true;
    },
  },
  prenom: {
    type: "text",
    title: "Prenom",
    required: true,
    validation: function (obj) {
      const value = obj.value;
      const regex = /^[a-zA-Z]+$/;
      if (!regex.test(value)) {
        return "Prenom invalide";
      }
      if (value.length < 3) {
        return "Prenom trop court";
      }
      return true;
    },
  },
  age: {
    type: "date",
    title: "Age",
    required: true,
    onChange: function (obj) {
      const value = obj.value;
      const age = calculateAge(value);
      document.getElementById("ageCounter").value = age;
    },
    validation: function (obj) {
      const value = obj.value;
      const age = calculateAge(value);
      if (age < 18) {
        window.alert("Age trop petit");
        window.location.href = "/";
      }
      return true;
    },
  },
  ageCounter: {
    type: "hidden",
    default: 0,
  },
  oldMember: {
    type: "radio",
    default: "no",
    title: "Je suis déjà membre",
    options: ["yes", "no"],
    onChange: (obj) => {
      const value = obj.value;
      if (value === "yes") {
        obj.classList.remove("hidden");
      } else {
        obj.classList.add("hidden");
      }
    },
  },
  oldMemberYears: {
    type: "select",
    title: "Années d'activité",
    disable: (obj) => {
      const ageCounter = document.getElementById("ageCounter");
      return ageCounter.value < 18;
    },
    options: (obj) => {
      const ageCounter = document.getElementById("ageCounter");
      const options = [];
      if (ageCounter.value >= 18) {
        const yearsPossible = ageCounter.value - 18 + 1;
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < yearsPossible; i++) {
          options.push(currentYear - i);
        }
        return options;
      }
    },
  },
  phone: {
    type: "tel",
    title: "Téléphone",
    required: true,
    pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
    validation: function (obj) {
      const regex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
      if (!regex.test(value)) {
        return "Format invalide (ex: 000-000-0000)";
      }
      return true;
    },
  },
  rules: {
    type: "checkbox",
    title: "Règles",
    options: ["1"],
  },
  submit: {
    type: "submit",
    title: "Soummettre",
    disabled: (obj, form) => {
      return form.isValid();
    },
  },
};

// FORM CREATOR
const serveState = (id, formId, func) => {
  // this function serves the object with the id "id" to the form with the id "formId"
  const obj = document.getElementById(id);
  const form = document.getElementById(formId);
  func(obj, form);
};

const createLabel = (key, title) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("form-row-label");
  const label = document.createElement("label");
  label.setAttribute("for", key);
  label.innerHTML = title;
  const message = document.createElement("div");
  message.id = `${key}-message`;
  message.classList.add("label-message");
  wrapper.appendChild(label);
  return wrapper;
};

const setDateIput = (shapeData) => {
  const input = document.createElement("input");
  const date = toDateInputValue(new Date());
  input.type = "date";
  input.value = date;
  return input;
};

const setTelInput = (shapeData) => {
  const { pattern } = shapeData;
  const input = document.createElement("input");
  input.type = "tel";
  input.pattern = pattern || null;
  return input;
};

const setCheckboxInput = (shapeData) => {
  const { options, id } = shapeData;
  const fieldSet = document.createElement("fieldset");
  fieldSet.classList.add("form-checkbox");
  fieldSet.id = id;
  options.forEach((option) => {
    const label = document.createElement("label");
    label.innerHTML = option;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = option;
    input.id = `${option}-${input.id}`;
    input.name = `${option}-${input.name}`;
    fieldSet.appendChild(label);
    fieldSet.appendChild(input);
  });
  return fieldSet;
};

const setRadioInput = (shapeData) => {
  const { options, id } = shapeData;
  const fieldSet = document.createElement("fieldset");
  fieldSet.classList.add("form-radio");
  fieldSet.id = id;
  options.forEach((option) => {
    const label = document.createElement("label");
    label.innerHTML = option;
    const input = document.createElement("input");
    input.type = "radio";
    input.value = option;
    input.id = `${option}-${input.id}`;
    input.name = `${option}-${input.name}`;
    fieldSet.appendChild(label);
    fieldSet.appendChild(input);
  });
  return fieldSet;
};

const setSelectInput = (shapeData) => {
  const { options, id } = shapeData;
  const fieldSet = document.createElement("fieldset");
  fieldSet.classList.add("form-select");
  fieldSet.id = id;
  options.forEach((option) => {
    const label = document.createElement("label");
    label.innerHTML = option;
    const input = document.createElement("input");
    input.type = "select";
    input.value = option;
    input.id = `${option}-${input.id}`;
    input.name = `${option}-${input.name}`;
    fieldSet.appendChild(label);
    fieldSet.appendChild(input);
  });
  return fieldSet;
};

const setSubmitInput = (shapeData) => {
  const { title } = shapeData;
  const input = document.createElement("input");
  input.type = "submit";
  input.innerHTML = title;
  return input;
};

const createInput = (shapeData) => {
  if (shapeData.default) {
    input.value = shapeData.default;
  }
  if (shapeData.required) {
    input.required = true;
  }
  if (shapeData.onChange) {
    input.addEventListener("change", () =>
      serveState(shapeData.id, formId, shapeData.onChange)
    );
  }
  let formInput = null;
  switch (shapeData.type) {
    case "date":
      formInput = setDateIput(shapeData);
      break;
    case "tel":
      formInput = setTelInput(shapeData);
      break;
    case "checkbox":
      formInput = setCheckboxInput(shapeData);
      break;
    case "radio":
      formInput = setRadioInput(shapeData);
      break;
    case "select":
      formInput = setSelectInput(shapeData);
      break;
    case "submit":
      formInput = setSubmitInput(shapeData);
      break;
    default:
      return input;
  }
  return formInput;
};

const init = (form, formShape) => {
  const keys = Object.keys(formShape);
  keys.forEach((key) => {
    const obj = formShape[key];
    const element = document.createElement("div");
    element.classList.add("form-row");
    const label = createLabel(key, obj.title);
    const input = createInput(key, obj, formId);
    element.appendChild(label);
    element.appendChild(input);
    form.appendChild(element);
  });
};

const startForm = (formId) => {
  const form = document.getElementById(formId);
  form.innerHTML = "";
  init(form, formShape);
};

startForm("saisie-form");
