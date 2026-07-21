const mongoose = require('mongoose');
const { nanoid } = require('nanoid'); // This is the only import you need

const ApplicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    planName: {
        type: String,
        required: true
    },
    applicationNumber: {
        type: String,
        default: () => `LPL-${nanoid(10)}`, // Use the imported nanoid function directly
        unique: true
    },
    formData: {
        type: Map,
        of: String
    },
    documents: [{
        docName: String,
        docPath: String
    }],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    policyNumber: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);