import { Job } from "../models/jobsModel.js";

// gets all job listings
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}); // gets all the jobs from the collection

        return res.status(200).send({ count: jobs.length, data: jobs });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message }); // send error message
    }
};

// add a new job listing
export const addJob = async (req, res) => {
    try {
        // store body properties in new object
        const newJob = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            location: req.body.location,
            priority: req.body.priority,
            archived: req.body.archived,
        };

        const job = await Job.create(newJob); // creates a new job in database collection

        return res.status(201).send(job);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message }); // send error message
    }
};

// get a specific jobs info using the id in the parameters
export const getJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id); // finds the book with the given id

        return res.status(200).send(job);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Job.findByIdAndUpdate(id, req.body); // finds the job by id and updates it using the request body

        if (!result) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).send({ message: "Job updated successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};
