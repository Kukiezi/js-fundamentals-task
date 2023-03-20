import state from '../state.js';
import { showMenu } from './menu.js';

/**
 * Creates an option object with a name and action.
 * @param {string} name - The name of the option.
 * @param {Function} action - The action to be performed when the option is selected.
 * @returns {Object} - An option object with a name and action.
 * 
 * @example
 * const option = createOption("Edit", () => console.log("Editing contact"));
 * option = { name: "Edit", action: [Function] }
 */
export function createOption(name, action) {
    return {
        name,
        action
    }
}

/**
 * Creates an array of options for a pagination menu. Based on the page number in the state, it will create options for the current page.
 * @returns {Array} - An array of options with contact names and actions.
 * 
 * @example
 * const contactsOptions = createContactsOptionsForPagination();
 * contactsOptions = [
 *   { name: "Alice", action: [Function] },
 *   { name: "Bob", action: [Function] },
 *   { name: "Charlie", action: [Function] }
 * ]
 */
export function createContactsOptionsForPagination() {
    const contactsPerPage = 3;
    const startIndex = state.page * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    const pageContacts = state.filteredContacts.slice(startIndex, endIndex);
    return pageContacts.map(contact => createOption(contact.name, function (id) { state.currentContactId = startIndex + id; showMenu({ menuName: 'contact' }); }));
}

/**
 * Creates an array of pagination options. 
 * Based on the page number in the state, it will create options for the previous and next pages.
 * @returns {Array} - An array of pagination options.
 * 
 * @example
 * const paginationOptions = createPaginationOptions();
 * paginationOptions = [
 *  { name: "Prev", action: [Function] },
 *  { name: "Next", action: [Function] }
 * ]
 */
export function createPaginationOptions() {
    const options = [];
    if (state.page > 0) {
        options.push(createOption("Prev", function () {
            state.page--;
            showMenu({ menuName: 'contacts', clear: true });
        }));
    }
    if (state.page < Math.ceil(state.filteredContacts.length / 3) - 1) {
        options.push(createOption("Next", function () {
            state.page++;
            showMenu({ menuName: 'contacts', clear: true });
        }));
    }
    return options;
}