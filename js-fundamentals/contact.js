'use strict';

import * as fs from 'fs';
import { readUserLine, clickAnyKeyToContinue } from "./consoleUtils.js";
import state from "./state.js";
import { showMenu } from "./menu/menu.js";

// function that searches for a contact by name, email or phone number
export function searchContact() {
    return async function () {
        const searchQuery = await readUserLine('Write name, email or phone number: ');

        const foundContacts = state.contacts.filter(contact => {
            return Object.values(contact).some(value => value.toString().toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()));
        });
        if (foundContacts.length > 0) {
            state.filteredContacts = foundContacts;
            state.page = 0;
            showMenu({ menuName: 'contacts', clear: true });
        } else {
            console.log('No contacts found');
            clickAnyKeyToContinue()
        }
    }
}

// function that adds a new contact
export function addContact() {
    return async function () {
        const name = await readUserLine('Write name: ');
        const email = await readUserLine('Write email: ');
        const phoneNumber = await readUserLine('Write phone number: ');
        state.contacts.push({ name, email, phoneNumber });
        state.filteredContacts.push({ name, email, phoneNumber });
        showMenu({ menuName: 'contacts', clear: true });
    }
}


// save contacts to json file
export function saveContacts() {
    return async function () {
        const contacts = JSON.stringify(state.contacts);
        fs.writeFileSync('contacts.json', contacts);
        console.log('Contacts saved to file');
        clickAnyKeyToContinue();
    }
}

// function that accept user line and updates the state
export function updateUserContact(property) {
    return async function () {
        const newValue = await readUserLine(`Write new ${property}: `);
        state.filteredContacts[state.currentContactId][property] = newValue;
        showMenu({ menuName: 'contact' });
    }
}

// read contacts from json file
export function readContactsFromJson() {
    const contacts = fs.readFileSync('contacts.json');
    return JSON.parse(contacts);
}

export function renderContact() {
    console.clear();
    const contact = state.filteredContacts[state.currentContactId];
    console.log(`name: ${contact.name}`);
    console.log(`email: ${contact.email}`);
    console.log(`phone number: ${contact.phoneNumber}`);
}
