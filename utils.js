'use strict';

// To get the last name, we will take all the terms strictly in even UpperCase or LowerCase (like 'von', 'de' etc...)
const getLastName = name => name.split(' ').filter(n => n === n.toUpperCase() || n === n.toLowerCase()).join(' ').replace(/\s+$/, '')

export { getLastName };