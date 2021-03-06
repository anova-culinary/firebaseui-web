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
 * @fileoverview UI component for the password recovery page.
 */

goog.provide('firebaseui.auth.ui.page.PasswordRecovery');

goog.require('firebaseui.auth.soy2.page');
goog.require('firebaseui.auth.ui.element');
goog.require('firebaseui.auth.ui.element.email');
goog.require('firebaseui.auth.ui.element.form');
goog.require('firebaseui.auth.ui.page.Base');


/**
 * Password recovery UI component.
 * @param {function()} onSubmitClick Callback to invoke when the submit button
 *     is clicked.
 * @param {function()=} opt_onCancelClick Callback to invoke when the cancel
 *     button is clicked.
 * @param {string=} opt_email The email to prefill.
 * @param {?function()=} opt_tosCallback Callback to invoke when the ToS link
 *     is clicked.
 * @param {?function()=} opt_privacyPolicyCallback Callback to invoke when the
 *     Privacy Policy link is clicked.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {firebaseui.auth.ui.page.Base}
 */
firebaseui.auth.ui.page.PasswordRecovery = function(
    onSubmitClick,
    opt_onCancelClick,
    opt_email,
    opt_tosCallback,
    opt_privacyPolicyCallback,
    opt_domHelper) {
  firebaseui.auth.ui.page.PasswordRecovery.base(
      this,
      'constructor',
      firebaseui.auth.soy2.page.passwordRecovery,
      {
        email: opt_email,
        allowCancel: !!opt_onCancelClick
      },
      opt_domHelper,
      'passwordRecovery',
      {
        tosCallback: opt_tosCallback,
        privacyPolicyCallback: opt_privacyPolicyCallback
      });
  this.onSubmitClick_ = onSubmitClick;
  this.onCancelClick_ = opt_onCancelClick;
};
goog.inherits(firebaseui.auth.ui.page.PasswordRecovery,
    firebaseui.auth.ui.page.Base);


/** @override */
firebaseui.auth.ui.page.PasswordRecovery.prototype.enterDocument = function() {
  this.initEmailElement();
  this.initFormElement(this.onSubmitClick_, this.onCancelClick_);
  this.updateSubmitButton_();
  this.setupListenersForUpdatingSubmitButton_();
  if (!firebaseui.auth.ui.element.getInputValue(this.getEmailElement())) {
    this.getEmailElement().focus();
  }
  this.submitOnEnter(this.getEmailElement(), this.onSubmitClick_);
  firebaseui.auth.ui.page.PasswordRecovery.base(this, 'enterDocument');
};


/** @override */
firebaseui.auth.ui.page.PasswordRecovery.prototype.disposeInternal =
    function() {
  this.onSubmitClick_ = null;
  this.onCancelClick_ = null;
  firebaseui.auth.ui.page.PasswordRecovery.base(this, 'disposeInternal');
};


/**
 * Enables/disables the submit button based on input fields.
 * @private
 */
firebaseui.auth.ui.page.PasswordRecovery.prototype.updateSubmitButton_ = function () {
  var emailTextField = document.querySelector(".firebaseui-input.firebaseui-id-email");

  var submitButton = document.querySelector(".firebaseui-id-submit");
  
  if (emailTextField != null && submitButton != null) {
    if (emailTextField.value.length > 0) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
  }

  return null;
};
      
    
/**
 * Sets up listeners for input fields in order to enable/disable submit button.
 * @private
 */
firebaseui.auth.ui.page.PasswordRecovery.prototype.setupListenersForUpdatingSubmitButton_ = function() {
    var emailTextField = document.querySelector(".firebaseui-input.firebaseui-id-email");

    emailTextField.addEventListener("input", firebaseui.auth.ui.page.PasswordRecovery.prototype.updateSubmitButton_);
};


goog.mixin(
    firebaseui.auth.ui.page.PasswordRecovery.prototype,
    /** @lends {firebaseui.auth.ui.page.PasswordRecovery.prototype} */
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

      // For form.
      getSubmitElement:
          firebaseui.auth.ui.element.form.getSubmitElement,
      getSecondaryLinkElement:
          firebaseui.auth.ui.element.form.getSecondaryLinkElement,
      initFormElement:
          firebaseui.auth.ui.element.form.initFormElement
    });
