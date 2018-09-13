/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Binds handlers for the password UI element.
 */

goog.provide('firebaseui.auth.ui.element.password');

goog.require('firebaseui.auth.soy2.strings');
goog.require('firebaseui.auth.ui.element');
goog.require('goog.ui.Component');


goog.scope(function() {
var element = firebaseui.auth.ui.element;


/**
 * @return {Element} The password input.
 * @this {goog.ui.Component}
 */
element.password.getPasswordElement = function() {
  return this.getElementByClass('firebaseui-id-password');
};


/**
 * @return {Element} The error panel.
 * @this {goog.ui.Component}
 */
element.password.getPasswordErrorElement = function() {
  return this.getElementByClass('firebaseui-id-password-error');
};

/**
 * @return {Element} The toggle button to show or hide the password text.
 * @this {goog.ui.Component}
 */
element.password.getPasswordToggleElement = function () {
  return this.getElementByClass('firebaseui-id-password-toggle');
};

/** @private {string} The CSS class for the "visiblility on" eye icon. */
var CLASS_TOGGLE_ON_ = 'firebaseui-input-toggle-on';


/** @private {string} The CSS class for the "visiblility off" eye icon. */
var CLASS_TOGGLE_OFF_ = 'firebaseui-input-toggle-off';


/**
 * @private {string} The CSS class for the eye icon when the input is
 *     focused.
 */
var CLASS_TOGGLE_FOCUS_ = 'firebaseui-input-toggle-focus';


/**
 * @private {string} The CSS class for the eye icon when the input is not
 *     focused.
 */
var CLASS_TOGGLE_BLUR_ = 'firebaseui-input-toggle-blur';


/**
 * Toggles the visibility of the password text.
 * @this {goog.ui.Component}
 */
element.password.togglePasswordVisible = function () {
  this.isPasswordVisible_ = !this.isPasswordVisible_;

  var toggleElement = element.password.getPasswordToggleElement.call(this);
  var passwordElement = element.password.getPasswordElement.call(this);

  if (this.isPasswordVisible_) {
    passwordElement['type'] = 'text';
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_OFF_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_ON_);
  } else {
    passwordElement['type'] = 'password';
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_ON_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_OFF_);
  }
  passwordElement.focus();
};

/**
 * Validates the field and shows/clears the error message if necessary.
 * @param {Element} passwordElement The password input.
 * @param {Element} errorElement The error panel.
 * @return {boolean} True if field is valid.
 * @private
 */
element.password.validate_ = function(passwordElement, errorElement) {
  var password = element.getInputValue(passwordElement);
  if (password) {
    element.setValid(passwordElement, true);
    element.hide(errorElement);
    return true;
  } else {
    element.setValid(passwordElement, false);
    element.show(errorElement,
        firebaseui.auth.soy2.strings.errorMissingPassword().toString());
    return false;
  }
};


/**
 * Initializes the password element.
 * @this {goog.ui.Component}
 */
element.password.initPasswordElement = function() {
  this.isPasswordVisible_ = false;

  var passwordElement = element.password.getPasswordElement.call(this);
  passwordElement['type'] = 'password';

  var errorElement = element.password.getPasswordErrorElement.call(this);

  element.listenForInputEvent(this, passwordElement, function(e) {
    // Clear but not show error on-the-fly.
    if (element.isShown(errorElement)) {
      element.setValid(passwordElement, true);
      element.hide(errorElement);
    }
  });

  var toggleElement = element.password.getPasswordToggleElement.call(this);
  goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_ON_);
  goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_OFF_);

  element.listenForFocusInEvent(this, passwordElement, function (e) {
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_FOCUS_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_BLUR_);
  });

  element.listenForFocusOutEvent(this, passwordElement, function (e) {
    goog.dom.classlist.add(toggleElement, CLASS_TOGGLE_BLUR_);
    goog.dom.classlist.remove(toggleElement, CLASS_TOGGLE_FOCUS_);
  });

  element.listenForActionEvent(this, toggleElement,
    goog.bind(element.password.togglePasswordVisible, this));
};


/**
 * Gets the password.
 * It validates the field and shows/clears the error message if necessary.
 * @return {?string} The password.
 * @this {goog.ui.Component}
 */
element.password.checkAndGetPassword = function() {
  var passwordElement = element.password.getPasswordElement.call(this);
  var errorElement = element.password.getPasswordErrorElement.call(this);
  if (element.password.validate_(passwordElement, errorElement)) {
    return element.getInputValue(passwordElement);
  }
  return null;
};
});
