import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: Object,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true,
        },
        archived: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Job = mongoose.model("Job", jobSchema);
