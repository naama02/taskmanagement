const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        required: true,
    },
    hour: {
        type: String,
        required: true,
    },
    deadline: {
        type: String,
        default: '',
    },
    attachedFile: {
        type: String,
        default: '',
    },
    
    color: {
        type: String,
        default: '',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    type: {
        type: String,
        enum: ['personal', 'group'],
        default: 'group',
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

module.exports = mongoose.model('Task', taskSchema);
