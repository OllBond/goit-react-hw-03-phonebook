import { Component } from 'react';
import { nanoid } from 'nanoid';

import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';

import css from './ContactForm/ContactForm.module.css';
export class App extends Component {
  state = {
    contacts: [
      { id: nanoid(), name: 'Rosie Simpson', number: '459-12-56' },
      { id: nanoid(), name: 'Hermione Kline', number: '443-89-12' },
      { id: nanoid(), name: 'Eden Clements', number: '645-17-79' },
      { id: nanoid(), name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  handleFilter = ({ target }) => {
    this.setState({ filter: target.value });
  };
  // функція створює новий контакт newContact
  // і повертає масив старих контактів і новий
  handleSubmit = ({ name, number }) => {
    if (this.isDublicate({ name, number })) {
      alert(`${name}: ${number} is already in contacts`);
      return false;
    }
    // тут callback бо хочемо змінити масив у state
    this.setState(prevState => {
      const { contacts } = prevState;
      const newContact = {
        id: nanoid(),
        name,
        number,
      };
      // в об'єкт contacts записуємо новий контакт і всі попередні
      // обнуляю name і number, відбувається рендер
      // і у value inputa потрапляє пуста стока
      return { contacts: [newContact, ...contacts] };
    });
  };
  removeContact = id => {
    this.setState(({ contacts }) => {
      // фільтр книг, який дає масив newContact
      // який має сонтакти з id які не дорівнюють id, того, що ми видаляли
      const newContact = contacts.filter(contact => contact.id !== id);
      // в масив newContact потрапили контакти окрім того, який треба видалити
      return { contacts: newContact };
    });
  };
  isDublicate({ name }) {
    const normalizedName = name.toLowerCase();
    const { contacts } = this.state;
    // щоб знайти елемент в масиві
    // якщо знайщеться в contact буде об'єкт
    // якщо не здайде - undefind
    const result = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedName;
    });
    // треба повернути або true або false
    // булеве значення об'єкта - true
    // булеве значення undefind - false
    return Boolean(result);
  }
  getFilteredContacts() {
    const { filter, contacts } = this.state;
    // якщо фільтр пустий - повертати масив контактів не фільтрувати
    if (!filter) {
      return contacts;
    }
    const normalizedFilter = filter.toLowerCase();
    const result = contacts.filter(({ name, number }) => {
      return (
        // якщо у name є ці кілька літер - вертає true
        name.toLowerCase().includes(normalizedFilter) ||
        // або якщо у number є ці кілька цифр - вертає true
        number.toLowerCase().includes(normalizedFilter)
      );
    });
    return result;
  }
  render() {
    const { handleSubmit, handleFilter, removeContact } = this;
    const { filter } = this.state;
    const contacts = this.getFilteredContacts();
    const isContacts = Boolean(contacts.length);
    return (
      <div>
        <h1 className={css.title}>Phonebook</h1>

        <ContactForm onSubmit={handleSubmit} />
        <h2 className={css.title}>Contacts</h2>
        <Filter handleInputChange={handleFilter} value={filter} />
        {isContacts && (
          <ContactList contacts={contacts} removeContact={removeContact} />
        )}
        {!isContacts && <p>No contacts in list</p>}
      </div>
    );
  }
}
