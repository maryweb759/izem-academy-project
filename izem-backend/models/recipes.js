const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    preptime: {
        type: Number,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    preparationSteps: [{
        type: String,
        required: true
    }],
    origins: {
        type: [String],
        enum: ['Algérie', 'Tunisie', 'Maroc'],
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    recipetype: {
        type: [String],
        enum: ['plat', 'dessert'],
        required: true
    }
}, 
{ timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
