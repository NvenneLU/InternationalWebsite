import {MDCTabBar} from '@material/tab-bar';
import {MDCTextField} from '@material/textfield';
import {MDCTextFieldHelperText} from '@material/textfield/helper-text';
import {MDCSelect} from '@material/select';
import {MDCSnackbar} from '@material/snackbar';

const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
const dataObj = {
  message: "You have not completed the previous step",
  actionText: 'Undo',
  actionHandler: function () {
    console.log('my cool function');
  }
};




const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
let currentTab = 0;
let completedTab = [0,0,0,0,0];
tabBar.listen('MDCTabBar:activated', function(event) {
  let nextTab = event.detail.index;
  document.querySelectorAll('.step').forEach(section => {
    if(section.dataset.step == nextTab) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });
  console.log(event);
});

function checkTabs() {
  document.querySelectorAll('.mdc-tab').forEach(tab => {
    if(completedTab[tab.tabIndex] == 0) {
      tab.disabled = true;
    } else {
      tab.disabled = false;
    }
  });
}

checkTabs();

function checkValidity(formID, callback) {
  let form = document.forms['form-step-' + formID];
  for(let i = 0; i < form.elements.length; i++) {
    let input = form.elements.item(i);
    if(input.required && input.value == "") {
      console.log(input);
      input.setCustomValidity(input.dataset.name + " is required");
    } else {
      input.setCustomValidity("");
    }
  }
  console.log(form.reportValidity());
}

document.querySelectorAll('.form-submit').forEach(button => {
  button.addEventListener('click', function() {
    checkValidity(button.dataset.step, function() {
      completedTab[button.dataset.step] = 1;
      tabBar.activateTab(button.dataset.tostep);
    });
  });
});

document.querySelectorAll('.mdc-select').forEach(select => {
  new MDCSelect(select);
});

document.querySelectorAll('.mdc-text-field').forEach(field => {
  new MDCTextField(field);
})

document.querySelectorAll('.mdc-text-field-helper-text').forEach(helper => {
  new MDCTextFieldHelperText(helper);
})
