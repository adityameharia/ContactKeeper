const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

router.post(
	'/',
	[
		check('name', 'pls enter a name').not().isEmpty(),
		check('email', 'pls enter a valid email').isEmail(),
		check(
			'password',
			'pls entert a password with 6 or more characetrs'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			console.log(user);
			if (user) {
				res.status(400).json({ msg: 'user already exists' });
			}

			user = new User({ name, email, password });

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			const res1=await user.save();
			console.log(res1+'hi');
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err.message);

			res.status(500).send('server error');
		}
	}
);

module.exports = router;
