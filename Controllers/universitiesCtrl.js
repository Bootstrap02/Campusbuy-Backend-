const University = require('../Models/universitiesModel');
const asyncHandler = require('express-async-handler');

const createUniversity = asyncHandler(async (req, res) => {
    const { fullname, abbreviation } = req.body;

    if (!fullname || !abbreviation) {
        return res.status(400).json('University Fullname and Abbreviation are required!');
    }

    try {
        const existingUniversity = await University.findOne({ fullname, abbreviation }).exec();

        if (existingUniversity) {
            return res.status(400).json('University already exists!');
        } else {
            const newUniversity = await University.create(req.body);
            return res.status(201).json(newUniversity);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getUniversity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'University id is required!' });
    }

    try {
        const university = await University.findOne({ _id: id }).exec();

        if (!university) {
            return res.status(404).json({ error: 'University not found!' });
        } else {
            return res.status(200).json(university);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getUniversities = asyncHandler(async (req, res) => {
    try {
        const universities = await University.find();

        if (!universities || universities.length === 0) {
            return res.status(404).json('Universities not found!');
        } else {
            return res.status(200).json(universities);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const updateUniversity = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, abbreviation, category, author } = req.body;
        const findUniversity = await University.findOne({ _id: id }).exec();

        if (!findUniversity) {
            return res.status(404).json({ message: 'University does not exist' });
        } else {
            if (fullname) findUniversity.fullname = fullname;
            if (abbreviation) findUniversity.abbreviation = abbreviation;
            if (category) findUniversity.category = category;
            if (author) findUniversity.author = author;

            const updatedUniversity = await findUniversity.save();
            return res.status(200).json(updatedUniversity);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

const deleteUniversity = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const findUniversity = await University.findOne({ _id: id }).exec();

        if (!findUniversity) {
            return res.status(404).json({ message: 'University does not exist' });
        } else {
            await findUniversity.deleteOne({ _id: id });
            return res.status(200).json({ success: true, message: 'University deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = { createUniversity, getUniversity, getUniversities, updateUniversity, deleteUniversity };
