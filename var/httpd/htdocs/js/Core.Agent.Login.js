// --
// Copyright (C) 2001-2016 OTRS AG, http://otrs.com/
// --
// This software comes with ABSOLUTELY NO WARRANTY. For details, see
// the enclosed file COPYING for license information (AGPL). If you
// did not receive this file, see http://www.gnu.org/licenses/agpl.txt.
// --

"use strict";

var Core = Core || {};
Core.Agent = Core.Agent || {};

/**
 * @namespace Core.Agent.Login
 * @memberof Core.Agent
 * @author OTRS AG
 * @description
 *      This namespace contains the special module functions for the Login.
 */
Core.Agent.Login = (function (TargetNS) {

    /**
     * @name PreLogin
     * @memberof Core.Agent.Login
     * @function
     * @description
     *      Automatically submits the login form in case of a pre login scenario.
     */
    TargetNS.PreLogin = function() {
        if ($('#LoginBox').hasClass('PreLogin')) {
            $('#LoginBox form').submit();
        }
    };

    /**
     * @name Init
     * @memberof Core.Agent.Login
     * @function
     * @param {Boolean} LoginFailed
     * @description
     *      This function initializes the special module functions.
     */
    TargetNS.Init = function (LoginFailed) {
        // Browser is too old
        if (!Core.Agent.SupportedBrowser) {
            $('#LoginBox').hide();
            $('#OldBrowser').show();
            return;
        }

        // enable login form
        Core.Form.EnableForm($('#LoginBox form, #PasswordBox form'));

        // set focus
        if ($('#User').val() && $('#User').val().length) {
            $('#Password').focus();
        }
        else {
            $('#User').focus();
        }

        // enable link actions to switch login <> password request
        $('#LostPassword, #BackToLogin').click(function () {
            $('#LoginBox, #PasswordBox').toggle();
            return false;
        });

        // save TimeZoneOffset data for OTRS
        $('#TimeZoneOffset').val((new Date()).getTimezoneOffset());

        // shake login box on authentication failure
        if (LoginFailed) {
            Core.UI.Animate($('#LoginBox'), 'Shake');
        }

        // display ad blocker warning
        if (window.OTRSAdblockDisabled === undefined && !localStorage.getItem("UserDontShowAdBlockWarning") && !$('LoginBox').hasClass('PreLogin')) {
            $('#LoginBox')
                .prepend('<div class="ErrorBox" style="display: none;"><span>' + Core.Language.Translate("Are you using a browser plugin like AdBlock or AdBlockPlus? This can cause several issues and we highly recommend you to add an exception for this domain.") + ' <i class="fa fa-long-arrow-right"></i> <a href="#" id="HideAdBlockMessage">' + Core.Language.Translate("Do not show this warning again.") + '</a></span></div>')
                .find('#HideAdBlockMessage')
                .on('click', function() {
                    localStorage.setItem('UserDontShowAdBlockWarning', 1); // do this in local storage because it needs to be saved per device
                    $(this).closest('.ErrorBox').fadeOut('slow', function() {
                        $(this).remove();
                    });
                    return false;
                })
                .closest('.ErrorBox')
                .fadeIn('slow');
        }
    };

    return TargetNS;
}(Core.Agent.Login || {}));
