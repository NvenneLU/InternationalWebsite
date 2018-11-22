import {MDCTabBar} from '@material/tab-bar';
import {MDCTextField} from '@material/textfield';
import {MDCTextFieldHelperText} from '@material/textfield/helper-text';


const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));


document.querySelectorAll('.mdc-text-field').forEach(field => {
  new MDCTextField(field);
})

document.querySelectorAll('.mdc-text-field-helper-text').forEach(helper => {
  new MDCTextFieldHelperText(helper);
})
