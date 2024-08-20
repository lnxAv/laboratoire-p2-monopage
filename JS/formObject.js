// DATE UTILS
function calculateAge(birthday) {
  let years = 0;
  var birthdayTime = Number(new Date(birthday));
  years = Math.floor((new Date().getTime() - birthdayTime) / 31556952000);
  return years;
}

/* FormObject.js
 * @Class: FormUtils - Contain prototypes functions for the form
 *               they can be called by the shapeData & the form
 * @Class: Form - Create the form
 */

/* @CLASS FormUtils
 * @description: Class that contains the prototypes of the form
 *               they can be called by the shapeData & the form
 * @param form: the form Element
 * @param formShape: the shape of the form
 * @Returns: an object with the prototypes functions
 *    @prototype.isValid(): returns true if the form is valid
 *    @prototype.setValidity(validity, key): sets the validity of the input with the key
 *    @prototype.setMessage(message, key): sets the message of the input with the key
 *    @prototype.displayRow(key, display): displays or hides the row with the key
 *    @prototype.callAllDisabled(): calls all the disabled functions given in the shape
 */
class FormUtils {
  constructor(form, formShape) {
    this.form = form;
    this.formShape = formShape;
    this.keys = Object.keys(this.formShape);
    this.prototype = {
      isValid: () => {
        // check if the form is has invalid inputs
        // if it does, the form is not valid
        const invalidQuerySelectors = form.querySelectorAll(":invalid");
        let validity = !!!invalidQuerySelectors.length;
        // for each key, check if the onChange function returns false
        // if it does, the form is not valid
        this.keys.forEach((key) => {
          const shapeData = this.formShape[key];
          if (shapeData.onChange) {
            const confirmOnChange =
              shapeData.onChange(key, this.form, this.prototype) !== false;
            if (!confirmOnChange) {
              validity = false;
            }
          }
        });
        // return the validity of the form
        return validity;
      },
      setValidity: (validity, key) => {
        const input = document.getElementById(key);
        // find the message element
        const messageElement = document.getElementById(`${key}-message`);
        // if the input is not found, return
        if (!input) return;
        if (validity) {
          // if asked to set the validity to true, remove the invalid class
          input.classList.remove("invalid");
          messageElement.classList.remove("invalid");
          input.setCustomValidity("");
        } else {
          // else, add the invalid class
          input.classList.add("invalid");
          messageElement.classList.add("invalid");
          input.setCustomValidity("Invalid field");
        }
      },
      callAllDisabled: () => {
        // call the disabled function for each key
        this.keys.forEach((key) => {
          const shapeData = this.formShape[key];
          const input = document.getElementById(key);
          if (shapeData.disabled) {
            input.disabled = shapeData.disabled(key, this.form, this.prototype);
          }
        });
      },
      setMessage: (message, key) => {
        // find the message element
        const messageElement = document.getElementById(`${key}-message`);
        // if the message element is not found, return
        if (!messageElement) return;
        if (message) {
          // if asked to set a message
          messageElement.innerHTML = message;
        } else {
          // else, set the message to empty
          messageElement.innerHTML = "";
        }
      },
      displayRow: (key, display) => {
        // find the row element
        const row = document.getElementById(`${key}-row`);
        if (display) {
          // if asked to display the row, remove the display-none class
          row.classList.remove("display-none");
        } else {
          // else, add the display-none classa
          row.classList.add("display-none");
        }
      },
    };
  }
}

/* @CLASS FormUtils
 * @description: Class that creates the form
 * @param formId: the id of the form to fill in the DOM
 * @param formShape: the shape of the form
 *    @formShape.type: the type of the input
 *    @formShape.title: the title of the input
 *    @formShape.required: whether the input is required
 *    @formShape.onChange: function (key, form, utils)
 *                        called when the input changes
 *                        returns true if the input is valid, or false if it is not
 *    @formShape.disable: function (key, form, utils)
 *                        returns true if the input should be disabled,
 *                        or false if it should be enabled
 *    @formShape.options: Array or function ()
 *                        a static array of options for select, radio and checkbox inputs
 *                        or a function called when the form changes => returns the array of options
 *    @formShape.default: the default value of the input
 *    @formShape.pattern: the pattern of the input
 * @Returns: an object to create the form
 */
class Form {
  constructor(formId, formShape) {
    this.form = document.getElementById(formId);
    this.formShape = formShape;
    this.utils = new FormUtils(this.form, this.formShape);
    this.keys = Object.keys(this.formShape);
  }
  // add an event listener to the form to handle the disabled function given in the shape
  handleOnDisabled(key, shapeData, input) {
    const { disabled } = shapeData;
    if (disabled instanceof Function) {
      this.form.addEventListener("input", () => {
        input.disabled = disabled(key, this.form, this.utils.prototype);
      });
    } else if (disabled) {
      input.disabled = disabled;
    }
  }

  // create the label for inputs
  createLabel(key, shapeData) {
    const { title = null } = shapeData;
    const wrapper = document.createElement("div");
    wrapper.classList.add("form-row-label");
    const label = document.createElement("label");
    label.setAttribute("for", key);
    label.innerHTML = title;
    wrapper.appendChild(label);
    const message = document.createElement("div");
    message.id = `${key}-message`;
    message.classList.add("label-message");
    wrapper.appendChild(message);
    return wrapper;
  }

  // create the general input for simple inputs ("text", "date", "tel", "hidden")
  createGeneralInput(key, shapeData) {
    const { pattern, required, type } = shapeData;
    const input = document.createElement("input");
    input.id = key;
    input.name = key;
    input.type = type;
    // set pattern
    if (pattern) {
      input.pattern = pattern || null;
    }
    // set disabled
    this.handleOnDisabled(key, shapeData, input);
    input.required = !!required;
    return input;
  }

  // create inputs inside a FieldSet for radio and checkbox inputs
  setFieldSetOption(key, options, optionsData, fieldSet) {
    const { title, type, default: defaultValue, required } = optionsData;
    fieldSet.innerHTML = "";
    const legend = document.createElement("legend");
    legend.innerHTML = title;
    fieldSet.appendChild(legend);
    const selectedOption = fieldSet.querySelector("input:checked");
    let selectedValue = selectedOption?.value || defaultValue;
    options.forEach((option) => {
      const label = document.createElement("label");
      label.innerHTML = option;
      const input = document.createElement("input");
      input.type = type;
      input.value = option;
      input.checked = option === selectedValue;
      input.id = key;
      input.name = key;
      input.required = !!required;
      // set disabled event listener
      this.handleOnDisabled(key, optionsData, input);
      fieldSet.appendChild(label);
      fieldSet.appendChild(input);
    });
  }

  // create a FieldSet for for radios and checkboxes
  createFieldSet = (key, shapeData) => {
    const { options, ...optionsData } = shapeData;
    const fieldSet = document.createElement("fieldset");
    fieldSet.id = key;
    fieldSet.name = key;
    fieldSet.classList.add("form-fieldset");
    // set inputs
    let optionsList = [];
    if (options instanceof Function) {
      optionsList = options(key, this.form, this.utils.prototype);
      form.addEventListener("input", () => {
        const newOptions = options(key, this.form, this.utils.prototype);
        this.setFieldSetOption(key, newOptions, optionsData, fieldSet);
      });
    } else if (options instanceof Array) {
      optionsList = options;
    }
    // set the options
    this.setFieldSetOption(key, optionsList, optionsData, fieldSet);
    return fieldSet;
  };

  // create options for a select
  setSelectOption(options, select) {
    // find the selected option
    const selectedOption = select.querySelector("option:checked");
    let selectedValue = null;
    if (selectedOption) {
      // if there is a selected option, set the selected value
      selectedValue = selectedOption.value;
    }
    // empty the select
    select.innerHTML = "";
    // for each option, create an option element
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.innerHTML = option;
      select.appendChild(optionElement);
    });
    // if there is a selected value, set it
    if (selectedValue) {
      select.value = selectedValue;
      select.dispatchEvent(new Event("change"));
    }
  }

  // create a select input
  createSelectInput(key, shapeData) {
    const { options, required } = shapeData;
    const select = document.createElement("select");
    select.id = key;
    select.name = key;
    select.required = !!required;
    // set options
    let optionsList = [];
    if (options instanceof Function) {
      optionsList = options(key, this.form, this.utils.prototype);
      this.form.addEventListener("input", () => {
        const newOptions = options(key, this.form, this.utils.prototype);
        this.setSelectOption(newOptions, select);
      });
    } else if (options instanceof Array) {
      optionsList = options;
    }
    // set the options
    this.setSelectOption(optionsList, select);
    // set disabled event listener
    this.handleOnDisabled(key, shapeData, select);
    return select;
  }

  // create a submit button
  createSubmitButton(key, shapeData) {
    const { title } = shapeData;
    const button = document.createElement("button");
    button.id = key;
    button.type = "submit";
    button.classList.add("white");
    const titleElement = document.createElement("h5");
    titleElement.innerHTML = title;
    // set disabled event listener
    this.handleOnDisabled(key, shapeData, button);
    button.appendChild(titleElement);
    return button;
  }

  // create the input for the based on the type given in the shape
  createInput(key) {
    let formInput = null;
    let formLabel = null;
    const shapeData = this.formShape[key];
    switch (shapeData.type) {
      case "text":
      case "date":
      case "tel":
      case "email":
      case "hidden":
        formLabel = this.createLabel(key, shapeData);
        formInput = this.createGeneralInput(key, shapeData);
        break;
      case "checkbox":
      case "radio":
        formInput = this.createFieldSet(key, shapeData);
        break;
      case "select":
        formLabel = this.createLabel(key, shapeData);
        formInput = this.createSelectInput(key, shapeData);
        break;
      case "submit":
        formInput = this.createSubmitButton(key, shapeData);
        break;
      default:
        return [formLabel, formInput];
    }
    return [formLabel, formInput];
  }

  // MAIN FUNCTION
  // initialize the form
  init() {
    this.keys.forEach((key) => {
      const shapeData = this.formShape[key];
      const element = document.createElement("div");
      element.id = `${key}-row`;
      element.classList.add("form-row");
      if (shapeData.display === false) {
        element.classList.add("display-none");
      }
      const [label, input] = this.createInput(key);
      if (label) {
        element.appendChild(label, shapeData);
      }
      if (input) {
        element.appendChild(input);
      }
      this.form.appendChild(element);
    });
    // Once all the inputs are created, check if the form is valid
    // or disabled
    this.utils.prototype.isValid();
    this.utils.prototype.callAllDisabled();
  }
  /* add event listeners to the form
   * @description: add event listeners to the form
   * @param eventName: the name of the event to listen to
   * @param func: (event, utils) => void: the function to call when the event is triggered
   *    @event: the event object
   *    @utils: the utils object
   * @Returns: nothing
   */
  addEventListeners(eventName, func) {
    this.form.addEventListener(eventName, (event) => {
      func(event, this.form, this.utils.prototype);
    });
  }
}
