'use strict'

import state from '../state.js';
import { addContact, searchContact, saveContacts, renderContact, updateUserContact } from '../contact.js';
import rl from '../readline.js';
import { readUserKey } from '../consoleUtils.js';
import { createOption, createContactsOptionsForPagination, createPaginationOptions } from './optionUtils.js';

export function createMenu() {
    return {
        main: {
            name: 'main',
            header: 'Main Menu',
            options: [
                createOption("Show contacts", function () { state.filteredContacts = [...state.contacts]; showMenu({ menuName: 'contacts', clear: true }) }),
                createOption("Add contact", addContact),
                createOption("Search contact", searchContact),
                createOption("Save contacts to file", saveContacts),
                createOption("Exit", function () { rl.close() })
            ]
        },
        contacts: {
            name: 'contacts',
            header: `Contacts, page ${state.page + 1}`,
            options: [
                ...createContactsOptionsForPagination(),
                ...createPaginationOptions(),
                createOption("Main Menu", function () { showMenu({ menuName: 'main', clear: true }) })
            ]
        },
        contact: {
            name: 'contact',
            header: 'Contact Details',
            options: [
                createOption("Edit", function () {
                    showMenu({ menuName: 'editContact', clear: true });
                }),
                createOption("Delete", function () {
                    const removedContact = state.filteredContacts.splice(state.currentContactId, 1)[0];
                    const removedContactIndex = state.contacts.findIndex(contact => contact.name === removedContact.name);
                    state.contacts.splice(removedContactIndex, 1);
                    showMenu({ menuName: 'contacts', clear: true });
                }),
                createOption("Back", function () { showMenu({ menuName: 'contacts', clear: true }) })
            ]
        },
        editContact: {
            name: 'editContact',
            header: 'Edit Contact',
            options: [
                createOption("Edit name", updateUserContact('name')),
                createOption("Edit email", updateUserContact('email')),
                createOption("Edit phone number", updateUserContact('phoneNumber')),
                createOption("Back", function () {
                    showMenu({ menuName: 'contact' });
                })
            ]
        }
    }
}

export async function showMenu({ menuName, clear = false }) {
    if (clear) {
        console.clear();
    }
    state.currentMenuName = menuName;
    // when visiting contact menu, we need to render contact details before options
    if (menuName === 'contact') {
        renderContact();
    }
    
    renderMenu(state.menus[menuName]);

    const userInput = await readUserKey();
    handleOption(userInput);
}


export function renderMenu(menu) {
    console.log(menu.header);
    if (menu.name === 'contacts' && state.filteredContacts.length === 0) {
        console.log('No contacts found');
    }
    menu.options.forEach((option, idx) => {
        console.log(`${idx + 1}. ${option.name}`);
    })
}

function handleOption(option) {
    if (!isNumberBetween(option, 1, state.getCurrentMenu().options.length)) {
        showMenu({ menu: state.currentMenuName, clear: true })
        return;
    }
    
    // if options is valid, execute action attatched to option
    state.getCurrentMenu().options[parseInt(option) - 1].action();
}

function isNumberBetween(number, min, max) {
    return number >= min && number <= max;
}

