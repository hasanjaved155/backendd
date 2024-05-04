const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../model/userModel');
const JWT = require('jsonwebtoken');

exports.registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ error: "Email is Required" })
        }
        if (!password) {
            return res.send({ error: "Password is Required" })
        }
        if (!phone) {
            return res.send({ error: "Phone no is Required" })
        }
        if (!address) {
            return res.send({ error: "Address is Required" })
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register Please Login",
            })
        }

        const hashedPassword = await hashPassword(password);


        const user = new userModel({ name, email, phone, address, password: hashedPassword });
        await user.save();



        res.status(200).send({
            success: true,
            message: "User Register Successfully",
            user,
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in registeration",
            error,
        });
    }
}


exports.loginController = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });

    }
}


exports.testController = (req, res) => {
    res.send('protected admin');
}