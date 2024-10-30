import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
    // State variables for loading status and job details
    const [loading, setLoading] = useState(false);

    // State variables to hold job details
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("submitted");
    const [location, setLocation] = useState("");
    const [priority, setPriority] = useState("Medium");

    // React hook for navigation
    const navigate = useNavigate(); // used to navigate to the home page after creating a job

    // Function to create a new job on the server
    const createJob = async (job) => {
        try {
            // Request options for the create job operation
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job),
            };

            // Fetch and create the job on the server
            const response = await fetch(
                `http://localhost:3500/jobs/`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Update loading status and navigate to the home page
            setLoading(false);
            navigate("/");
        } catch (err) {
            // Handle errors and update loading status
            console.log(err);
            setLoading(false);
        }
    };

    // Function to handle the creation of a new job
    const handleCreateJob = () => {
        setLoading(true);

        // Define statusObject based on the selected status
        let statusObject;
        switch (status) {
            case "completed":
                statusObject = { sortOrderNum: 3, option: status };
                break;
            case "in progress":
                statusObject = { sortOrderNum: 2, option: status };
                break;
            default:
                statusObject = { sortOrderNum: 1, option: status };
        }

        // Create a new job object with the provided details
        const newJob = {
            title: title,
            description: description,
            status: statusObject,
            location: location,
            priority: priority,
            archived: false,
        };

        // Call the createJob function to save the new job
        createJob(newJob);
    };

    return (
        <div className="create-form">
            <h1 className="create-form-heading">
                <BackButton />
                Create A Task
            </h1>
            {loading ? <Loading /> : ""}
            <div className="form-controllers">
                <div className="form-controller">
                    <label htmlFor="title">Title: </label>
                    <input
                        placeholder="Enter a title"
                        type="text"
                        value={title}
                        name="title"
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </div>
                <div className="form-controller">
                    <label htmlFor="description">Description: </label>
                    <input
                        placeholder="Enter a description"
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                </div>
                <div className="form-controller">
                    <label htmlFor="status">Status: </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        name="status">
                        <option value="in progress">In progress</option>
                        <option value="submitted">Submitted</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="form-controller">
                    <label htmlFor="priority">Priority: </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        name="priority">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="form-controller">
                    <label htmlFor="location">Location: </label>
                    <input
                        placeholder="Enter the location"
                        type="text"
                        name="location"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                        }}
                    />
                </div>

                <button className="" onClick={handleCreateJob}>
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateJob;
