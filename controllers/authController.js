const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../model/userModel');
const JWT = require('jsonwebtoken');

exports.registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

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
        if (!answer) {
            return res.send({ error: "Answer is Required" })
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register Please Login",
            })
        }

        const hashedPassword = await hashPassword(password);


        const user = new userModel({ name, email, phone, address, password: hashedPassword, answer });
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
                role: user.role,
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


exports.forgotPasswordController = async (req, res) => {

    try {

        const { email, answer, newPassword } = req.body;
        if (!answer) {
            return res.send({ error: "answer is Required" });
        }
        if (!email) {
            return res.send({ error: "Email is Required" })
        }
        if (!newPassword) {
            return res.send({ error: "New Password is Required" })
        }

        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer"
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
            user,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }

}


exports.testController = (req, res) => {
    res.send('protected admin');
}