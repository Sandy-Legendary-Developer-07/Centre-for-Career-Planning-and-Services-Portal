import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true,
    },
    Company: {
        type: String,
        required: true,
    },
    requiredSkills: [{
        type: String,
    }],
    Type: {
        type: String,
        required: true,
        enum: ["on-campus", "off-campus"]
    },
    batch: {
        type: Number,
        required: true,
    },
    Deadline: {
        type: Date,
    },
    ApplicationLink: {
        type: String,
    },
    Expiry: {
        type: Date,
    },
    author: {
        type: String,
    },
    relevanceScore: {
        type: Number,
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}); 

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);

export default JobPosting;
