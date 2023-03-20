'use strict';

import { readContactsFromJson } from "./contact.js";
import { createMenu } from "./menu/menu.js";

function State() {
    const contacts = readContactsFromJson();
    const filteredContacts = [
        ...contacts
    ]
    let menus = [];
    let currentMenuName = 'main';

    // refers to the index of the contact in the filteredContacts array, -1 means no contact is selected
    let currentContactId = -1;
    let page = 0;

    function refreshMenu() {
        state.menus = createMenu();
    }

    function getCurrentMenu() {
        return state.menus[state.currentMenuName];
    }

    // create a proxy object that intercepts changes to the state object
    const state = new Proxy({
        currentMenuName,
        currentContactId,
        page,
        menus,
        contacts,
        filteredContacts,
        getCurrentMenu
    }, {
        set: function (target, property, value) {
            target[property] = value;
            // refresh menu when state is updated
            // call the refreshMenu function whenever a non-menus property is set
            if (property !== 'menus') {
                // when we delete contacts, we need to reset the page number to 0 if the current page is no longer valid
                if (state.page > 0 && state.contacts.length <= 3) {
                    state.page = 0;
                }
                
                refreshMenu(); 
            }
            return true;
        }
    });

    return { state };
}

const state = new State().state;
export default state;