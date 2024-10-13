const express = require('express');
const Watch = require('../models/Watch');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const watches = await Watch.find();
        res.json(watches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const watch = new Watch(req.body);
        await watch.save();
        res.status(201).json(watch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const watch = await Watch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!watch) return res.status(404).json({ message: 'Watch not found' });
        res.json(watch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const watch = await Watch.findByIdAndDelete(req.params.id);
        if (!watch) return res.status(404).json({ message: 'Watch not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;