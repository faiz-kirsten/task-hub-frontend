import BackButton from "../components/BackButton";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EditJob = () => {
    // State variables for loading status and job details
    const [loading, setLoading] = useState(false);

    // State variables to hold job details
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("submitted");
    const [location, setLocation] = useState("");
    const [priority, setPriority] = useState("Medium");

    // Extract job id from the URL parameters
    const { id } = useParams();

    // React hook for navigation
    const navigate = useNavigate(); // used to navigate to the main route after editing a book

    // Load the current job's information into the input form when the component mounts
    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                // Fetch job details based on the provided job id
                const response = await fetch(
                    `http://localhost:3500/jobs/${id}`
                );
                if (!response.ok) {
                    throw Error("Did not receive expected data.");
                }

                // Parse the response data
                const data = await response.json();

                // Set state variables with the fetched job details
                setTitle(data.title);
                setDescription(data.description);
                setStatus(data.status.option);
                setPriority(data.priority);
                setLocation(data.location);

                setLoading(false);
            } catch (err) {
                // Handle errors and update loading status
                console.log(err);
                setLoading(false);
            }
        };

        // Fetch job details when the component mounts
        fetchJob();
    }, []); // The empty dependency array ensures that this useEffect runs only once on component mount

    // Function to update the job details on the server
    const updateJob = async (job) => {
        try {
            // Request options for the update
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job),
            };

            // Fetch and update the job on the server
            const response = await fetch(
                `http://localhost:3500/jobs/${id}`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Update loading status and navigate back to the main route
            setLoading(false);
            navigate("/");
        } catch (err) {
            // Handle errors and update loading status
            setLoading(false);
            console.log(err);
        }
    };

    // Function to handle editing and updating a job
    const handleEditJob = () => {
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

        // Create a new job object with updated details
        const newJob = {
            title: title,
            description: description,
            status: statusObject,
            location: location,
            priority: priority,
            archived: false,
        };

        // Call the updateJob function to save changes
        updateJob(newJob);
    };

    return (
        <div className="edit-form">
            <h1 className="edit-form-heading">
                <BackButton />
                Edit Task
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

                <button className="" onClick={handleEditJob}>
                    Update
                </button>
            </div>
        </div>
    );
};

export default EditJob;
