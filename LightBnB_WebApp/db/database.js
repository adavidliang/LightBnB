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

 const queryString = `SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON property_reviews.property_id = properties.id
  JOIN reservations ON reservations.property_id = properties.id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2`;
  return pool.query(queryString, [guest_id, limit])
  .then(res => {
    console.log(res.rows)
    return res.rows;
  })
  .catch(err => {
    console.log('error :', err);
  })

  // return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// ---------------------------------------------
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1=1
  `;

  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length}\n`;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night*100)
    queryParams.push(options.maximum_price_per_night*100)
    queryString += `AND (cost_per_night >= $${queryParams.length-1} AND cost_per_night <= $${queryParams.length})\n`;
  }

  queryString += `GROUP BY properties.id\n`;
if (options.minimum_rating) {
    queryParams.push(options.minimum_rating)
    queryString += `HAVING avg(rating) >= $${queryParams.length}\n`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;


  // console.log(queryString, queryParams);
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
  

// --------------------------------------



// const getAllProperties = function (options, limit = 10) {
//   // 1
//   const queryParams = [];
//   // 2
//   let queryString = `
//   SELECT properties.*, avg(property_reviews.rating) as average_rating
//   FROM properties
//   JOIN property_reviews ON properties.id = property_reviews.property_id
//   WHERE 1=1
//   `;

//   // 3
//   if(options.owner_id) {
//     queryParams.push(`%${options.owner_id}%`);
//     queryString += ` AND owner_id = $${queryParams.length}\n`;
//   }

//   if (options.city) {
//     queryParams.push(`%${options.city}%`);
//     queryString += ` AND city LIKE $${queryParams.length}\n`;
//   }


//   if (options.minimum_price_per_night && options.maximum_price_per_night) {
//     queryParams.push(options.minimum_price_per_night);
//     queryParams.push(options.maximum_price_per_night);
//     queryString += ` AND cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}\n`;
//   }

//   if (options.minimum_rating) {
//     queryParams.push(`${options.minimum_rating}`);
//     queryString += ` AND average_rating >= $${queryParams.length}\n`;
//   }

//   // 4
//   queryParams.push(limit);
//   queryString += `
//   GROUP BY properties.id
//   ORDER BY cost_per_night
//   LIMIT $${queryParams.length};
//   `;

//   // 5
//   // console.log(queryString, queryParams);

//   // 6
//   return pool.query(queryString, queryParams)
//   .then((res) => res.rows)
//   .catch((err) => {
//   console.error(err);
// })
// };


// getAllProperties();
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  // 
  const queryString = `
  INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  street,
  city,
  province,
  post_code,
  country,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14
  )
  RETURNING *`;

  const container = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
    return pool.query(queryString, container)
    .then(res => {
      return res.rows;
    })
};





module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
