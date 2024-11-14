require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Watch = require('./models/Watch');

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const watches = [];

        fs.createReadStream('luxury_watches.csv')
            .pipe(csv())
            .on('data', (row) => {
                watches.push({
                    watch_name: row.watch_name,
                    brand: row.brand,
                    price: parseFloat(row.price),
                    imageUrl: row.image_url
                });
            })
            .on('end', async () => {
                try {
                    await Watch.insertMany(watches);
                    console.log('Data imported successfully!');
                } catch (error) {
                    console.error('Error importing data:', error);
                } finally {
                    mongoose.connection.close();
                }
            });
    } catch (error) {
        console.error('Error starting data import:', error);
    }
};

importData()
    .then(() => console.log('Data import process started'))
    .catch(error => console.error('Error initializing importData:', error));
