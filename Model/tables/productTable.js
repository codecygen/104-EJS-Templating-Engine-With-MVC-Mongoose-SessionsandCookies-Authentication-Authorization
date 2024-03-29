// Mongoose-Queries
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    productDesc: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productImg: {
      type: String,
      required: true,
    },

    adminId: {
      type: mongoose.Types.ObjectId,
      // ref creates a relationship with UserTable
      ref: "UserTable",
      required: true,
    },
  },
  // timestamps: true adds createAt, updatedAt fields
  // if (collection: "ProductTable"), it means use this as a collection name in DB.
  // if not existent, from
  // module.exports = mongoose.model("ProductTable", productSchema);
  // program takes "ProductTable", 
  // lowercase it as producttable and pluriliuze it as "producttables" in DB.
  { 
    collection: "ProductTable", 
    // timestamps: true 
  }
);

// methods keyword creates a function that can be used with
// creating class instance
productSchema.methods.createProduct = async function () {
  // Create a new product
  try {
    await this.save();
  } catch (err) {
    console.error(err);
  }
};

// statics keyword creates a static function
productSchema.statics.findAllProducts = async function () {
  let allProducts;

  try {
    allProducts = await this.find();
  } catch (err) {
    console.error(err);
  }

  return allProducts;
};

productSchema.statics.getSingleProduct = async function (productId) {
  let foundProduct;

  try {
    foundProduct = await this.findById(productId);
  } catch (err) {
    console.error(err);
  }

  return foundProduct;
};

productSchema.statics.adminProducts = async function (adminId) {
  try {
    // Mongoose-Populate
    // "populate" method will not work here
    // check "Mongoose-Populate"
    // section in "README,md"
    // to understand the logic behind it.
    const adminProducts = await this.find({ adminId: adminId });
    return adminProducts;
  } catch (err) {
    console.error(err);
  }
};

productSchema.statics.deleteProduct = async function (productId) {
  try {
    await this.findByIdAndDelete(productId);
  } catch (err) {
    console.error(err);
  }
};

productSchema.statics.updateProduct = async function (productData) {
  const { _id, productName, productDesc, productPrice, productImg, adminId } =
    productData;

  try {
    // if new: true returns the modified document.
    await this.findOneAndUpdate({ _id: _id }, productData, {
      new: true,
    });
  } catch (err) {
    console.error(err);
  }
};

// "ProductTable" means export the object as ProductTable to be used in NodeJS
module.exports = mongoose.model("ProductTable", productSchema);
