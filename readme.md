### Required Commands

```javascript
// create new models
npx sequelize-cli model:generate --name User --attributes firstName:string

// migrate
npx sequelize-cli db:migrate

// migrate rollback
npx sequelize-cli db:migrate:undo:all

// Create new seeds
npx sequelize-cli seed:generate --name product

// run seeds
npx sequelize-cli db:seed:all

// rollback seeds
npx sequelize-cli db:seed:undo:all
```

### Response Structure

```javascript
{
    success: true,
    message: "Product Created successfully",
    data: product,
}
```

### Empty Controller Structure

```javascript
// internal imports
const createError = require("http-errors");
const db = require("../../models");

module.exports = {
  // ---------------------------------
  //        LIST ALL PRODUCTS
  // ---------------------------------
  index: async (req, res, next) => {
    try {
    } catch (error) {
      next(createError(500, "Failed to retrieve products"));
    }
  },

  // ---------------------------------
  //        GET SINGLE PRODUCT
  // ---------------------------------
  show: async (req, res, next) => {
    try {
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to fetch product"));
    }
  },

  // ---------------------------------
  //        CREATE NEW PRODUCT
  // ---------------------------------
  store: async (req, res, next) => {
    try {
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to create product"));
    }
  },

  // ---------------------------------
  //        UPDATE PRODUCT
  // ---------------------------------
  update: async (req, res, next) => {
    try {
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to update product"));
    }
  },

  // ---------------------------------
  //        DELETE PRODUCT
  // ---------------------------------
  destroy: async (req, res, next) => {
    try {
    } catch (err) {
      console.log(err);
      next(createError(500, "Failed to delete product"));
    }
  },
};
```
