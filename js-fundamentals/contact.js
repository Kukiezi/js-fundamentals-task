"use strict";

import * as fs from "fs";
import { readUserLine, clickAnyKeyToContinue, clearConsole } from "./consoleUtils.js";
import state from "./state.js";
import { showMenu } from "./menu/menu.js";

// function that searches for a contact by name, email or phone number
export async function searchContact() {
    clearConsole();
    const searchQuery = await readUserLine(
        "Write name, email or phone number: "
    );

    const foundContacts = state.contacts.filter((contact) => {
        return Object.values(contact).some((value) =>
            value
                .toString()
                .toLocaleLowerCase()
                .includes(searchQuery.toLocaleLowerCase())
        );
    });
    if (foundContacts.length > 0) {
        state.filteredContacts = foundContacts;
        state.page = 0;
        showMenu({ menuName: "contacts", clear: true });
    } else {
        console.log("No contacts found");
        clickAnyKeyToContinue();
    }
}

// function that adds a new contact
export async function addContact() {
    clearConsole();
    const name = await readUserLine("Write name: ", validators.name);
    const email = await readUserLine("Write email: ", validators.email);
    const phoneNumber = await readUserLine("Write phone number: ", validators.phoneNumber);
    state.contacts.push({ name, email, phoneNumber });
    state.filteredContacts.push({ name, email, phoneNumber });
    showMenu({ menuName: "contacts", clear: true });
}

// save contacts to json file
export async function saveContacts() {
    const contacts = JSON.stringify(state.contacts);
    fs.writeFileSync("contacts.json", contacts);
    console.log("Contacts saved to file");
    clickAnyKeyToContinue();
}

// we are using higher order function here that creates a cloesure with the property name
// so that when user selects the option to edit any of the properties we can use the same function
export function updateUserContact(property) {
    return async function () {
        clearConsole();
        const newValue = await readUserLine(`Write new ${property}: `, validators[property]);
        state.filteredContacts[state.currentContactId][property] = newValue;
        showMenu({ menuName: 'contact' });
    }
}



// read contacts from json file
export function readContactsFromJson() {
    const contacts = fs.readFileSync("contacts.json");
    return JSON.parse(contacts);
}

export function renderContact() {
    console.clear();
    const contact = state.filteredContacts[state.currentContactId];
    console.log(`name: ${contact.name}`);
    console.log(`email: ${contact.email}`);
    console.log(`phone number: ${contact.phoneNumber}`);
}

function validateInput(input, validator, errorMessage) {
    const isValid = validator(input);
    return {
        success: isValid,
        ...(isValid && { data: input }),
        ...(!isValid && { error: errorMessage })
    };
}

const validators = {
    name: name => validateInput(name, name => name.length > 0, "Name must be at least 1 character long"),
    email: email => validateInput(email, email => /^\S+@\S+\.\S+$/.test(email), "Email is not valid"),
    phoneNumber: phoneNumber => validateInput(phoneNumber, phoneNumber => /^\d{9}$/.test(phoneNumber), "Phone number must be 9 digits long")
}

// you could also define the validators as separate functions and export them
// export function isNameValid(name) {
//     return validateInput(name, name => name.length > 0, "Name must be at least 1 character long");
// }

// export function isEmailValid(email) {
//     return validateInput(email, email => /^\S+@\S+\.\S+$/.test(email), "Email is not valid");
// }

// export function isPhoneNumberValid(phoneNumber) {
//     return validateInput(phoneNumber, phoneNumber => /^\d{9}$/.test(phoneNumber), "Phone number must be 9 digits long");
// }
