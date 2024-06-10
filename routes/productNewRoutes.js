const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: "djwfvyckp",
    api_key: "954746167828835",
    api_secret: "KiYYN0eMl9IiI1kFnhW021cEOF0" // Click 'View Credentials' below to copy your API secret
});


const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const {
    createProductController,
    getProductController,
    getSingleProductController,
    // productPhotoController,
    deleteProductController,
    updateProductController,
    productFiltersController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    brainTreePaymentController
} = require('../controllers/productController');
const ExpressFormidable = require('express-formidable');



// create product
router.post('/create-product', requireSignIn, isAdmin, createProductController)

// update product
router.put("/update-product/:pid", requireSignIn, isAdmin, updateProductController)

// get all product

router.get('/get-product', getProductController);

// single product 
router.get('/get-product/:slug', getSingleProductController);

// get photo
// router.get('/product-photo/:pid', productPhotoController)

// delete product

router.delete("/delete-product/:pid", deleteProductController)

router.post('/product-filters', productFiltersController);

router.get('/product-count', productCountController);

router.get('/product-list/:page', productListController)

// search product

router.get("/search/:keyword", searchProductController)

// similar products
router.get('/related-product/:pid/:cid', relatedProductController)

// category wise product
router.get('/product-category/:slug', productCategoryController)

//payment routes
// token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, brainTreePaymentController)


router.post("/upload", ExpressFormidable({ maxFieldsSize: 5 * 2024 * 2024 }), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path)
        res.json({
            url: result.secure_url,
            public_id: result.public_id
        })

    } catch (error) {
        console.error(error.message);
    }
})



module.exports = router;