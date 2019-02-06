import {MDCTabBar} from '@material/tab-bar';
import {MDCTextField} from '@material/textfield';
import {MDCTextFieldHelperText} from '@material/textfield/helper-text';
import {MDCSelect} from '@material/select';
import {MDCSnackbar} from '@material/snackbar';
import {MDCDialog} from '@material/dialog';
import {MDCMenu} from '@material/menu';

var formData = new FormData();

const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
function showMsg(msg) {
  const dataObj = {
    message: msg
  };
  snackbar.show(dataObj);
}

function showMsgUndo(msg, callback) {
  const dataObj = {
    message: msg,
    actionText: 'Undo',
    actionHandler: function () {
      callback()
    }
  }
  snackbar.show(dataObj);
}
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
  document.querySelector('.move-row').style.transform = "translateX(" + displaySize * (currentTab * -1) + "px)";
  var sectionHeight;

  document.querySelectorAll('.animated-section').forEach(step => {
    if(step.dataset.step == currentTab) {
      sectionHeight = step.offsetHeight;
      var tableHeight = document.querySelector('.table-height').offsetHeight;
      document.querySelector('.formDisplay').style.height = sectionHeight + 80 + "px";
      document.querySelector('.actionButtons').style.position = "relative";
      document.querySelector('.actionButtons').style.bottom = tableHeight - sectionHeight - 24 + "px"
    }
  })
}


const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
let override = false;
let completedTab = [0,0,0,0,0];
tabBar.listen('MDCTabBar:activated', function(event) {

  let nextTab = event.detail.index;
  console.log(currentTab + " " + nextTab);
  if(currentTab > nextTab)  {
    console.log("RUN");
    override = true;
    currentTab = nextTab;
    tabBar.activateTab(nextTab);
  }
  if(checkValidity(currentTab) || override) {
    if(!override) {
      completedTab[currentTab] = 1;
      if((currentTab - nextTab) * -1 != 1) {
        for(let i = currentTab + 1; i <= nextTab - 1; i++) {
          if(completedTab[i] != 1) {
            override = true;
            tabBar.activateTab(i);
            return;
          }
        }
        currentTab = nextTab;
      } else {
        currentTab = nextTab;
      }
    } else {
      console.log("override");
      currentTab = nextTab;
      override = false;
    }

    document.querySelector('.move-row').style.transform = "translateX(" + displaySize * currentTab * -1  + "px)";
    var sectionHeight;
    document.querySelectorAll('.animated-section').forEach(step => {
      if(step.dataset.step == nextTab) {
        sectionHeight = step.offsetHeight;
        var tableHeight = document.querySelector('.table-height').offsetHeight;
        document.querySelector('.formDisplay').style.height = sectionHeight + 80 + "px";
        document.querySelector('.actionButtons').style.position = "relative";
        document.querySelector('.actionButtons').style.bottom = tableHeight - sectionHeight - 24 + "px"
      }
    })
    document.querySelectorAll('.step').forEach(step => {
      if(step.dataset.step == nextTab) {
        step.classList.remove("hidden");
      } else {
        step.classList.add("hidden");
      }
    })
  } else {

      tabBar.activateTab(currentTab);
  }
});


const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));

document.querySelector('.openDialog').addEventListener('click', function() {
  dialog.open();
})

dialog.listen('MDCDialog:closed', function(event) {
  if(event.detail.action == "yes") {
    document.querySelector('.openDialog').innerHTML = "Requirements met";
    document.querySelector('.requirementsMetYes').checked = true;
    document.querySelectorAll('.requirementsMet').forEach(div => {
      div.classList.remove("hidden");
      div.firstChild.nextSibling.classList.remove("mdc-select--disabled");
    });
    document.querySelectorAll('.requirementsNotMet').forEach(div => {
      div.classList.add("hidden");
      div.firstChild.nextSibling.classList.add("mdc-select--disabled");
    });
    document.querySelectorAll('.requirementsNotMetInput').forEach(div => {
      div.disabled = true;

    });
    document.querySelectorAll('.requirementsMetInput').forEach(div => {
      div.disabled = false;
    });
    console.log("i an1");
    showMsg("Requirements met");
  } else {
    document.querySelector('.openDialog').innerHTML = "Requirements not met";
    document.querySelector('.requirementsMetNo').checked = true;
    document.querySelectorAll('.requirementsMet').forEach(div => {
      div.classList.add("hidden");
      div.firstChild.nextSibling.classList.add("mdc-select--disabled");
    });
    document.querySelectorAll('.requirementsNotMet').forEach(div => {
      div.classList.remove("hidden");
      div.firstChild.nextSibling.classList.remove("mdc-select--disabled");
    });
    document.querySelectorAll('.requirementsNotMetInput').forEach(div => {
      div.disabled = false
    });
    document.querySelectorAll('.requirementsMetInput').forEach(div => {
      div.disabled = true;
    });
    console.log("i an");
    showMsg("Requirements not met");
  }
  resize();
});

var schoolIndex = 1;
document.querySelector('.addHighSchool').addEventListener('click', function(event) {
  console.log(event);
  let button = event.target;
  if(schoolIndex == 3) {
    showMsg("Max 3 high schools");
    return;
  }
  schoolIndex++;
  console.log(schoolIndex);
  document.querySelector('.highschool--' + schoolIndex).style.display = "block";
  setTimeout(function() {
    document.querySelector('.highschool--' + schoolIndex).style.transform = "scale(1)";
  }, 0);
  document.querySelector('.highschool--' + schoolIndex).querySelectorAll('.initSchoolInputs').forEach(input => {
    input.disabled = false;
  });
  showMsgUndo("Added Secondary School", function() {
    let tmp = document.querySelector('.addHighSchool');
    if(schoolIndex == 1) {
      showMsg("Minimum 1 high school");
      return;
    }
    document.querySelector('.highschool--' + schoolIndex).style.transform = "scale(0)";
    setTimeout(function() {
      document.querySelector('.highschool--' + schoolIndex).style.display = "none";
      schoolIndex--;
      resize();
    }, 499)
    document.querySelector('.highschool--' + schoolIndex).querySelectorAll('.initSchoolInputs').forEach(input => {
      input.disabled = true;
    });
    showMsg("Undo");
  });
  resize();

});

document.querySelector('.removeHighSchool').addEventListener('click', function(event){
      let tmp = document.querySelector('.addHighSchool');
      if(schoolIndex == 1) {
        showMsg("Minimum 1 high school");
        return;
      }
      document.querySelector('.highschool--' + schoolIndex).style.transform = "scale(0)";
      setTimeout(function() {
        document.querySelector('.highschool--' + schoolIndex).style.display = "none";
        schoolIndex--;
        resize();
      }, 499)
      document.querySelector('.highschool--' + schoolIndex).querySelectorAll('.initSchoolInputs').forEach(input => {
        input.disabled = true;
      });
      showMsg("Removed Secondary School");

});

var postSchoolIndex = 1;
document.querySelector('.addPostsecondarySchool').addEventListener('click', function(event) {
  let button = event.target;
  if(postSchoolIndex == 3) {
    showMsg("Max 3 postsecondary schools");
    return;
  }
  postSchoolIndex++;
  console.log(postSchoolIndex);
  document.querySelector('.postsecondary--' + postSchoolIndex).style.display = "block";
  setTimeout(function() {
    document.querySelector('.postsecondary--' + postSchoolIndex).style.transform = "scale(1)";
  }, 0);
  document.querySelector('.postsecondary--' + postSchoolIndex).querySelectorAll('.initSchoolInputs').forEach(input => {
    input.disabled = false;
  });
  showMsgUndo("Added Postsecondary School", function() {
    document.querySelector('.postsecondary--' + postSchoolIndex).style.transform = "scale(0)";
    setTimeout(function() {
      document.querySelector('.postsecondary--' + postSchoolIndex).style.display = "none";
      postSchoolIndex--;
      resize();
    }, 499)
    document.querySelector('.postsecondary--' + postSchoolIndex).querySelectorAll('.initSchoolInputs').forEach(input => {
      input.disabled = true;
    });
    showMsg("Undo");
  });
  resize();

});

document.querySelector('.removePostsecondarySchool').addEventListener('click', function(event){
      let tmp = document.querySelector('.addHighSchool');
      if(postSchoolIndex == 1) {
        showMsg("Minimum 1 Postsecondary school");
        return;
      }
      document.querySelector('.postsecondary--' + postSchoolIndex).style.transform = "scale(0)";
      setTimeout(function() {
        document.querySelector('.postsecondary--' + postSchoolIndex).style.display = "none";
        postSchoolIndex--;
        resize();
      }, 499)
      document.querySelector('.postsecondary--' + postSchoolIndex).querySelectorAll('.initSchoolInputs').forEach(input => {
        input.disabled = true;
      });
      showMsg("Removed Postsecondary School");

});



const menu = new MDCMenu(document.querySelector('.mdc-menu'));
document.querySelector('.languageButton').addEventListener('click', function() {
  menu.open = true;
})

menu.listen('MDCMenu:selected', function(event) {
  switch(event.detail.index) {
    case 0:
      window.location.pathname = "international/en";
      break;
    case 1:
      window.location.pathname = "international/fr";
      break;
    default:
      break;
  }
})


document.querySelector('.attened-ps__yes').addEventListener('click', function() {
  document.querySelectorAll('.psButton').forEach(but => {
    but.style.transform = "scale(1)";
  });
  document.querySelector('.ps-section').style.display = "block";
  for(let i = 1; i <= postSchoolIndex; i++ ) {
    document.querySelector('.postsecondary--' + i).querySelectorAll('.initSchoolInputs').forEach(input => {
      input.disabled = false;
    });
  }
  resize();
})

document.querySelector('.attened-ps__no').addEventListener('click', function() {
  document.querySelector('.ps-section').style.display = "none";
  document.querySelectorAll('.psButton').forEach(but => {
    but.style.transform = "scale(0)";
  });

  document.querySelectorAll('.initSchoolInputs').forEach(input => {
    input.disabled = true;
  });

  resize();
})


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


function checkValidity(formID) {
  let form = document.forms['form-step-' + formID];
  for(let i = 0; i < form.elements.length; i++) {
    let input = form.elements.item(i);
    checkValidityInput(input);
    input.addEventListener("change", function() {checkValidityInput(input)});

  }
  if(form.reportValidity()) {
    return true;
  } else {
    return false;
  }
}

function checkValidityInput(input) {
  if(input.required && input.value == "") {
    input.setCustomValidity(input.nextSibling.nextSibling.innerHTML + " is required");
  } else {
    input.setCustomValidity("");

  }
}


document.querySelectorAll('.form-submit').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelector('.move-row').classList.add('move-step1');
    if(checkValidity(button.dataset.step)) {
      completedTab[button.dataset.step] = 1;
      let form = document.forms['form-step-' + button.dataset.step];
      for(let i = 0; i < form.elements.length; i++) {
        let input = form.elements.item(i);
        console.log(input.value != "")
        if(input.value != "") {
          if(input.type == 'radio') {
            if(input.checked == true) {
              formData.append(input.name, input.value);
            }
          } else {
            formData.append(input.name, input.value);
          }

        }
      }
      for(let key of formData.values()) {
        console.log(key);
      }
      tabBar.activateTab(button.dataset.tostep);
    }
  });
});

document.querySelectorAll('.previousBtn').forEach(btn => {
  btn.addEventListener('click', function() {
    tabBar.activateTab(btn.dataset.tostep);
  })
})

document.querySelectorAll('.mdc-select').forEach(select => {
  new MDCSelect(select);
});

document.querySelectorAll('.mdc-text-field').forEach(field => {
  new MDCTextField(field);
})

document.querySelectorAll('.mdc-text-field-helper-text').forEach(helper => {
  new MDCTextFieldHelperText(helper);
})

document.querySelectorAll('.initSchoolInputs').forEach(input => {
  input.disabled = true;
});
