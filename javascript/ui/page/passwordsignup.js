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
 * @fileoverview UI component for the password sign-up page.
 */

goog.provide('firebaseui.auth.ui.page.PasswordSignUp');

goog.require('firebaseui.auth.soy2.page');
goog.require('firebaseui.auth.ui.element');
goog.require('firebaseui.auth.ui.element.email');
goog.require('firebaseui.auth.ui.element.form');
goog.require('firebaseui.auth.ui.element.name');
goog.require('firebaseui.auth.ui.element.newPassword');
goog.require('firebaseui.auth.ui.page.Base');



/**
 * Password sign-up UI component.
 * @param {boolean} requireDisplayName Whether to show the display name.
 * @param {function()} onSubmitClick Callback to invoke when the submit button
 *     is clicked.
 * @param {function()=} opt_onCancelClick Callback to invoke when the cancel
 *     button is clicked.
 * @param {string=} opt_email The email to prefill.
 * @param {string=} opt_name The name to prefill.
 * @param {?function()=} opt_tosCallback Callback to invoke when the ToS link
 *     is clicked.
 * @param {?function()=} opt_privacyPolicyCallback Callback to invoke when the
 *     Privacy Policy link is clicked.
 * @param {boolean=} opt_displayFullTosPpMessage Whether to display the full
 *     message of Terms of Service and Privacy Policy.
 * @param {boolean=} opt_displayGDPRTosPpMessage Whether to display the GDPR version
 *     of Terms of Service and Privacy Policy.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @param {boolean=} opt_userExistsInCognitoShowSignIn Whether to display something else.
 * @constructor
 * @extends {firebaseui.auth.ui.page.Base}
 */
firebaseui.auth.ui.page.PasswordSignUp = function(
    requireDisplayName,
    onSubmitClick,
    opt_onCancelClick,
    opt_email,
    opt_name,
    opt_tosCallback,
    opt_privacyPolicyCallback,
    opt_displayFullTosPpMessage,
    opt_displayGDPRTosPpMessage,
    opt_domHelper,
    opt_userExistsInCognitoShowSignIn) {

  firebaseui.auth.ui.page.PasswordSignUp.base(
      this,
      'constructor',
      firebaseui.auth.soy2.page.passwordSignUp,
      {
        email: opt_email,
        requireDisplayName: requireDisplayName,
        name: opt_name,
        allowCancel: !!opt_onCancelClick,
        displayFullTosPpMessage: !!opt_displayFullTosPpMessage,
        displayGDPRTosPpMessage: !!opt_displayGDPRTosPpMessage,
        userExistsInCognitoShowSignIn: !!opt_userExistsInCognitoShowSignIn
      },
      opt_domHelper,
      'passwordSignUp',
      {
        tosCallback: opt_tosCallback,
        privacyPolicyCallback: opt_privacyPolicyCallback
      });
  this.onSubmitClick_ = onSubmitClick;
  this.onCancelClick_ = opt_onCancelClick;
  this.requireDisplayName_ = requireDisplayName;
};
goog.inherits(firebaseui.auth.ui.page.PasswordSignUp,
    firebaseui.auth.ui.page.Base);


/** @override */
firebaseui.auth.ui.page.PasswordSignUp.prototype.enterDocument = function() {
  this.initEmailElement();
  if (this.requireDisplayName_) {
    this.initNameElement();
  }
  this.initNewPasswordElement();
  this.initFormElement(this.onSubmitClick_, this.onCancelClick_);
  this.updateSubmitButton_();
  this.setupListenersForUpdatingSubmitButton_();
  this.setupFocus_();
  firebaseui.auth.ui.page.PasswordSignUp.base(this, 'enterDocument');
};


/** @override */
firebaseui.auth.ui.page.PasswordSignUp.prototype.disposeInternal = function() {
  this.onSubmitClick_ = null;
  this.onCancelClick_ = null;
  firebaseui.auth.ui.page.PasswordSignUp.base(this, 'disposeInternal');
};


/**
 * Sets up the focus order and auto focus.
 * @private
 */
firebaseui.auth.ui.page.PasswordSignUp.prototype.setupFocus_ = function() {
  // Focus order.
  if (this.requireDisplayName_) {
    this.focusToNextOnEnter(this.getEmailElement(), this.getNameElement());
    this.focusToNextOnEnter(
        this.getNameElement(), this.getNewPasswordElement());
  } else {
    this.focusToNextOnEnter(
        this.getEmailElement(), this.getNewPasswordElement());
  }

  // On enter in password element.
  // TODO: Investigate why the compiler complains about onSubmitClick_ being
  // nullable here but not in any other file.
  if (this.onSubmitClick_) {
    this.submitOnEnter(this.getNewPasswordElement(), this.onSubmitClick_);
  }

  // Auto focus.
  if (!firebaseui.auth.ui.element.getInputValue(this.getEmailElement())) {
    this.getEmailElement().focus();
  } else if (this.requireDisplayName_ &&
      !firebaseui.auth.ui.element.getInputValue(this.getNameElement())) {
    this.getNameElement().focus();
  } else {
    this.getNewPasswordElement().focus();
  }
};
 

/**
 * Enables/disables the submit button based on input fields and checkboxes.
 * @private
 */
firebaseui.auth.ui.page.PasswordSignUp.prototype.updateSubmitButton_ = function () {
  var emailTextField = document.querySelector(".firebaseui-input.firebaseui-id-email");
  var passwordTextField = document.querySelector(".firebaseui-input.firebaseui-id-new-password");
  var privacyPolicyCheckbox = document.querySelector("#privacy-policy");
  var termsOfServiceCheckbox = document.querySelector("#terms-of-service");
  
  var submitButton = document.querySelector(".firebaseui-id-submit");
  
  if (emailTextField != null && passwordTextField != null && submitButton != null) {
    if (emailTextField.value.length > 0 && passwordTextField.value.length > 0) {
        if (privacyPolicyCheckbox != null && termsOfServiceCheckbox != null) {
            if (privacyPolicyCheckbox.validity.valid === true && termsOfServiceCheckbox.validity.valid === true) {
                submitButton.removeAttribute("disabled");
            } else {
                submitButton.setAttribute("disabled", "disabled");
            }
        } else {
            submitButton.removeAttribute("disabled");
        }
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
  }

  return null;
};


/**
 * Sets up listeners for input fields and checkboxes in order to enable/disable submit button.
 * @private
 */
firebaseui.auth.ui.page.PasswordSignUp.prototype.setupListenersForUpdatingSubmitButton_ = function() {
    var emailTextField = document.querySelector(".firebaseui-input.firebaseui-id-email");
    var passwordTextField = document.querySelector(".firebaseui-input.firebaseui-id-new-password");
    var privacyPolicyCheckbox = document.querySelector("#privacy-policy");
    var termsOfServiceCheckbox = document.querySelector("#terms-of-service");

    emailTextField.addEventListener("input", firebaseui.auth.ui.page.PasswordSignUp.prototype.updateSubmitButton_);
    passwordTextField.addEventListener("input", firebaseui.auth.ui.page.PasswordSignUp.prototype.updateSubmitButton_);

    if (privacyPolicyCheckbox != null && termsOfServiceCheckbox != null) {
        privacyPolicyCheckbox.addEventListener("change", firebaseui.auth.ui.page.PasswordSignUp.prototype.updateSubmitButton_);
        termsOfServiceCheckbox.addEventListener("change", firebaseui.auth.ui.page.PasswordSignUp.prototype.updateSubmitButton_);
    }
};


goog.mixin(
    firebaseui.auth.ui.page.PasswordSignUp.prototype,
    /** @lends {firebaseui.auth.ui.page.PasswordSignUp.prototype} */
    {
      // For email.
      getEmailElement:
          firebaseui.auth.ui.element.email.getEmailElement,
      getEmailErrorElement:
          firebaseui.auth.ui.element.email.getEmailErrorElement,
      initEmailElement:
          firebaseui.auth.ui.element.email.initEmailElement,
      getEmail:
          firebaseui.auth.ui.element.email.getEmail,
      checkAndGetEmail:
          firebaseui.auth.ui.element.email.checkAndGetEmail,

      // For name.
      getNameElement:
          firebaseui.auth.ui.element.name.getNameElement,
      getNameErrorElement:
          firebaseui.auth.ui.element.name.getNameErrorElement,
      initNameElement:
          firebaseui.auth.ui.element.name.initNameElement,
      checkAndGetName:
          firebaseui.auth.ui.element.name.checkAndGetName,

      // For new password.
      getNewPasswordElement:
          firebaseui.auth.ui.element.newPassword.getNewPasswordElement,
      getNewPasswordErrorElement:
          firebaseui.auth.ui.element.newPassword.getNewPasswordErrorElement,
      getPasswordToggleElement:
          firebaseui.auth.ui.element.newPassword.getPasswordToggleElement,
      initNewPasswordElement:
          firebaseui.auth.ui.element.newPassword.initNewPasswordElement,
      checkAndGetNewPassword:
          firebaseui.auth.ui.element.newPassword.checkAndGetNewPassword,


      // For form.
      getSubmitElement:
          firebaseui.auth.ui.element.form.getSubmitElement,
      getSecondaryLinkElement:
          firebaseui.auth.ui.element.form.getSecondaryLinkElement,
      initFormElement:
          firebaseui.auth.ui.element.form.initFormElement
    });
