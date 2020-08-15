const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const contact = require('../models/Contact');
const Contact = require('../models/Contact');
const { findByIdAndRemove } = require('../models/User');

router.get('/', auth, async (req, res) => {
	try {
		const contact = await Contact.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(contact);
	} catch (error) {
		console.log(err.message);
		res.status(500).send('server error');
	}
});

router.post(
	'/',
	auth,
	[check('name', 'Name is required').not().isEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, phone, type } = req.body;
		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id,
			});
			const contact = await newContact.save();
			res.json(contact);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('server error');
		}
	}
);

router.put('/:id', async (req, res) => {
	try {
		const { name, email, phone, type } = req.body;
		const update = { name, email, phone, type };
		const newdata = await Contact.findOneAndUpdate(
			{ _id: req.params.id },
			update,
			{
				new: true,
			}
		);
		res.status(200).send(newdata);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('server error');
	}
});

router.delete('/:id', [auth], async (req, res) => {
	try {
		await Contact.findByIdAndRemove(req.params.id);
		res.status(200).send('contact deleted');
	} catch (error) {
		console.error(error.message);
		res.status(500).send('server error');
	}
});

module.exports = router;
