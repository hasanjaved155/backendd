// const fs = require('fs');
// const productModel = require('../model/productModel');
const slugify = require('slugify');
const productNewModel = require('../model/productNewModel');
const categoryModel = require('../model/categoryModel');
const orderModel = require('../model/orderModel');

const dotenv = require('dotenv');

dotenv.config();

var braintree = require('braintree');



var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// exports.createProductController = async (req, res) => {
//     try {
//         const { name, slug, description, price, category, quantity, shipping } = req.fields;
//         const { photo } = req.files;

//         switch (true) {
//             case !name:
//                 return res.status(500).send({ error: "Name is Required" });
//             case !description:
//                 return res.status(500).send({ error: "Description is Required" });
//             case !price:
//                 return res.status(500).send({ error: "Price is Required" });
//             case !category:
//                 return res.status(500).send({ error: "Category is Required" });
//             case !quantity:
//                 return res.status(500).send({ error: "Quantity is Required" });
//             case photo && photo.size > 10000000000000:
//                 return res.status(500).send({ error: "Photo is Required and should be less then 1mb" });

//         }

//         const products = new productModel({ ...req.fields, slug: slugify(name) });
//         if (photo) {
//             products.photo.data = fs.readFileSync(photo.path);
//             products.photo.contentType = photo.type;
//         }

//         await products.save();
//         return res.status(201).send({
//             success: true,
//             message: "Product Created Successfully",
//             products,
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({
//             success: false,
//             message: "Error In creating product",
//             error
//         })
//     }
// }

exports.createProductController = async (req, res) => {
    try {
        const { name, description, price, photo, category, quantity, shipping } = req.body;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case !photo:
                return res.status(400).send({ message: "Image is required" });

        }

        const products = new productNewModel({
            name, description, price, category, photo, quantity, shipping, slug: slugify(name)
        });

        await products.save();
        return res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error In creating product",
            error
        })
    }
}

// exports.getProductController = async (req, res) => {
//     try {
//         const products = await productModel.find({}).select("-photo").limit(12).populate("category").sort({ createdAt: -1 });
//         return res.status(201).send({
//             success: true,
//             countTotal: products.length,
//             message: "All Products Fetched Successfully",
//             products,

//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({
//             success: false,
//             message: "Error In fetching all product",
//             error
//         })
//     }
// }
exports.getProductController = async (req, res) => {
    try {
        const products = await productNewModel.find({}).populate("category");
        return res.status(201).send({
            success: true,
            countTotal: products.length,
            message: "All Products Fetched Successfully",
            products,

        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error In fetching all product",
            error
        })
    }
}

exports.getSingleProductController = async (req, res) => {
    try {
        const product = await productNewModel.findOne({ slug: req.params.slug }).populate("category");
        return res.status(201).send({
            success: true,
            message: "Product Fetched Successfully",
            product,

        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in getting single product",
            error
        })
    }
}

// exports.productPhotoController = async (req, res) => {
//     try {
//         const product = await productModel.findById(req.params.pid).select("photo");
//         if (product.photo.data) {
//             res.set('Content-type', product.photo.contentType)
//             return res.status(201).send(product.photo.data)
//         }


//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({
//             success: false,
//             message: "Error in getting photo",
//             error
//         })
//     }
// }

exports.deleteProductController = async (req, res) => {
    try {
        await productNewModel.findByIdAndDelete(req.params.pid)
        return res.status(201).send({
            success: true,
            message: " Product deleted successfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in deleting product",
            error
        })
    }
}

exports.updateProductController = async (req, res) => {
    try {
        const { name, description, price, photo, category, quantity, shipping } = req.body;


        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case !photo:
                return res.status(500).send({ error: "Photo is Required" });

        }

        const products = await productNewModel.findByIdAndUpdate(req.params.pid, {
            name, description, price, photo, category, quantity, shipping, slug: slugify(name)
        }, { new: true });
        await products.save();
        return res.status(201).send({
            success: true,
            message: "Product updated Successfully",
            products,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error In updating product",
            error
        })
    }
}

exports.productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        // Use $in operator for category filtering
        if (checked.length > 0) args.category = { $in: checked };

        // Price filtering
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        // Find products with applied filters
        const products = await productNewModel.find(args);

        res.status(200).send({
            success: true,
            products
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In filtering product",
            error
        });
    }
}

// product count

exports.productCountController = async (req, res) => {
    try {

        const total = await productNewModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In counting product",
            error
        });
    }
}

exports.productListController = async (req, res) => {
    try {

        const perPage = 3;
        const page = req.params.page ? req.params.page : 1;

        const products = await productNewModel.find({}).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in per page count",
            error
        });
    }
}

exports.searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productNewModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        });
        res.json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in per page count",
            error
        });
    }
}


exports.relatedProductController = async (req, res) => {
    try {

        const { pid, cid } = req.params;
        const products = await productNewModel.find({
            category: cid,
            _id: { $ne: pid },
        }).limit(3).populate("category")

        res.status(200).send({
            success: true,
            products,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting related products",
            error
        });
    }
}


exports.productCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productNewModel.find({ category }).populate('category');

        res.status(200).send({
            success: true,
            category,
            products
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        });
    }
}


// token

exports.braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//payment

exports.brainTreePaymentController = (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }

        )

    } catch (error) {
        console.log(error)
    }
}