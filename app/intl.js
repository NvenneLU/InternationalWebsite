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
let currentTab = 0;
var displaySize;
resize();
window.addEventListener("resize", resize);

function resize() {

  displaySize = document.querySelector('.formDisplay').offsetWidth;
  document.querySelectorAll('.animated-section, td').forEach(td => {
    td.style.width = displaySize + "px";
  });
  document.querySelector('table').style.width = displaySize * 5;
  console.log(currentTab);
  document.querySelector('.move-row').style.transform = "translateX(" + displaySize * (currentTab * -1) + "px)";
}


const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

let completedTab = [0,0,0,0,0];
tabBar.listen('MDCTabBar:activated', function(event) {

  let nextTab = event.detail.index;
  currentTab = nextTab;
  let diff = (nextTab) * -1;
  document.querySelector('.move-row').style.transform = "translateX(" + displaySize * diff + "px)";
  document.querySelectorAll('.step').forEach(step => {
    if(step.dataset.step == nextTab) {
      step.classList.remove("hidden");
    } else {
      step.classList.add("hidden");
    }
  })
});

// function checkTabs() {
//   document.querySelectorAll('.mdc-tab').forEach(tab => {
//     if(completedTab[tab.tabIndex] == 0) {
//       tab.disabled = true;
//     } else {
//       tab.disabled = false;
//     }
//   });
// }

// checkTabs();


function checkValidity(formID, callback) {
  let form = document.forms['form-step-' + formID];
  for(let i = 0; i < form.elements.length; i++) {
    let input = form.elements.item(i);
    input.addEventListener("change", function() {checkValidityInput(input)});

  }
  if(form.reportValidity()) {
    callback();
  }
}

function checkValidityInput(input) {
  console.log("typeing");
  if(input.required && input.value == "") {
    input.setCustomValidity(input.nextSibling.nextSibling.innerHTML + " is required");
  } else {
    input.setCustomValidity("");
  }
}

document.querySelectorAll('.form-submit').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelector('.move-row').classList.add('move-step1');
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
