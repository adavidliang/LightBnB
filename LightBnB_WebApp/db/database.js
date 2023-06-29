const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool, Client } = require('pg');


/// Users
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

const client = new Client({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});


/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
  SELECT * FROM users
  WHERE users.email = $1
  `;
  return pool.query(queryString, [email])
  .then(res => {
    return(res.rows[0]);
  })
  .catch(err => {
    return('error:', err);
  })
};
// getUserWithEmail('asherpoole@gmx.com')
/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  SELECT * FROM users
  WHERE users.id = $1 or NULL
  `;
  return pool.query(queryString, [id])
  .then(res => {
    return(res.rows[0]);
  })
  .catch(err => {
    return('error:', err);
  })
};
// getUserWithId(6)
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
  INSERT INTO users (
    name, email, password
  )
  VALUES (
    $1, $2, $3
  )
  `;
    return pool.query(queryString, [user.name, user.email, user.password])
    .then(res => {
      return(res.rows);
    })
    .catch(err => {
      return('error:', err);
    })
};
// addUser();


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
 const queryString = `SELECT * FROM properties LIMIT $1`;
  return pool.query(queryString, [limit]).then((result) => {
    return result.rows;
  })
  .catch((err) => {
    console.log(err);
    return [];
  })
};
getAllProperties();
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};



module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
