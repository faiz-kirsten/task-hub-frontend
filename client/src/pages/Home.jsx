import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { RiInboxArchiveFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";

const Home = () => {
    // State variables for managing job data, filters, loading status, and batch operations
    const [jobs, setJobs] = useState([]);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState("none");
    const [loading, setLoading] = useState(false);
    const [displayArchived, setDisplayArchived] = useState(false);
    const [selectedBatchStatus, setSelectedBatchStatus] = useState("none");
    const [selectedSort, setSelectedSort] = useState("none");
    const [batchList, setBatchList] = useState([]);
    const [batchUpdateBegan, setBatchUpdateBegan] = useState(false);
    const [batchListCount, setBatchListCount] = useState(0);
    const [addedToBatchCount, setAddedToBatchCount] = useState(0);

    // Function to fetch jobs from the server based on filters and update state
    const fetchJobs = async () => {
        try {
            // Fetch jobs data from the server
            const response = await fetch("http://localhost:3500/jobs");
            if (!response.ok) {
                throw Error("Did not receive expected data.");
            }

            // Parse the response data
            const data = await response.json();
            let jobs;

            // Filter jobs based on displayArchived and selectedFilterStatus
            if (!displayArchived) {
                jobs = data.data.filter((job) => !job.archived);

                // Additional filtering based on selectedFilterStatus
                if (selectedFilterStatus !== "none") {
                    jobs = jobs.filter(
                        (job) => job.status.option === selectedFilterStatus
                    );
                }

                // Sorting based on selectedSort criteria
                if (selectedSort === "date submitted") {
                    jobs.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                } else if (selectedSort === "status") {
                    jobs.sort(
                        (a, b) =>
                            parseInt(a.status.sortOrderNum) -
                            parseInt(b.status.sortOrderNum)
                    );
                }

                // Update filter and sort state variables
                setSelectedFilterStatus(selectedFilterStatus);
                setSelectedSort(selectedSort);
            } else {
                // Display archived jobs
                jobs = data.data.filter((job) => job.archived);
            }

            // Update state variables
            setBatchUpdateBegan(false);
            setJobs(jobs);
            setLoading(false);
        } catch (err) {
            // Handle errors and update loading status
            console.error(err);
            setLoading(false);
        }
    };

    // UseEffect hook to fetch jobs when dependencies change
    useEffect(() => {
        setLoading(true);
        fetchJobs();
    }, [displayArchived, selectedFilterStatus, batchUpdateBegan, selectedSort]);

    // Function to update job status to archived or unarchived
    const archiveBook = async (job, updatedJob) => {
        try {
            // Request options for the update
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedJob),
            };

            // Fetch and update the job status
            const response = await fetch(
                `http://localhost:3500/jobs/${job._id}`,
                requestOptions
            );
            const data = await response.json();

            // Fetch updated jobs to rerender the component
            fetchJobs();
        } catch (err) {
            // Handle errors and update loading status
            setLoading(false);
            console.log(err);
        }
    };

    // Function to handle archiving or unarchiving a job
    const handleArchiveBook = (job, archive) => {
        let updatedJob = archive
            ? {
                  // Updated job object for archiving
                  title: job.title,
                  description: job.description,
                  status: job.status,
                  priority: job.priority,
                  location: job.location,
                  archived: true,
              }
            : {
                  // Updated job object for unarchiving
                  title: job.title,
                  description: job.description,
                  status: job.status,
                  priority: job.priority,
                  location: job.location,
                  archived: false,
              };
        setLoading(true);
        archiveBook(job, updatedJob);
    };

    // Function to update the status of a batch of jobs
    const batchUpdate = async (job, status) => {
        try {
            // Create job object with updated status
            console.log("Updating book status...");
            let statusObject;
            switch (status) {
                // Define status based on selectedBatchStatus
                case "completed":
                    statusObject = { sortOrderNum: 3, option: status };
                    break;
                case "in progress":
                    statusObject = { sortOrderNum: 2, option: status };
                    break;
                default:
                    statusObject = { sortOrderNum: 1, option: status };
            }
            const updatedJobStatus = {
                // Updated job status object
                title: job.job_info.title,
                description: job.job_info.description,
                status: statusObject,
                priority: job.job_info.priority,
                location: job.job_info.location,
                archived: job.job_info.archived,
            };

            // Request options for the update
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedJobStatus),
            };

            // Fetch and update the job status
            const response = await fetch(
                `http://localhost:3500/jobs/${job.id}`,
                requestOptions
            );
            const data = await response.json();
        } catch (err) {
            // Handle errors and update loading status
            console.log(err);
            setLoading(false);
        }
    };

    // Function to handle batch update of selected jobs
    const handleBatchUpdate = () => {
        if (batchList < 1 || selectedBatchStatus === "none") return; // Exit function if batchList is empty or no status selected
        setLoading(true);
        setBatchUpdateBegan(true);

        console.log("Handle batch update");

        // Batch update each job in the batchList
        batchList.forEach((job) => {
            batchUpdate(job, selectedBatchStatus);
            setBatchListCount((prevCounter) => prevCounter + 1);
        });
    };

    // Reset state variables after batch update completes
    if (addedToBatchCount === batchListCount && batchListCount > 0) {
        setBatchList([]);
        setBatchListCount(0);
        setAddedToBatchCount(0);
        setSelectedBatchStatus("none");
        setLoading(false);
    }

    // Function to add or remove jobs from the batchList
    const addToBatchList = (job) => {
        // Check if the job exists in the batchList
        const jobExists = batchList.filter((jobitem) => jobitem.id === job._id);

        // If the job exists, remove it from the batchList; otherwise, add it
        if (jobExists.length > 0) {
            const jobRemoved = batchList.filter(
                (jobitem) => jobitem.id !== job._id
            );

            setBatchList(jobRemoved);
            setAddedToBatchCount((prevCounter) => prevCounter - 1);
            return;
        } else {
            setBatchList((prevArray) => [
                ...prevArray,
                { id: job._id, job_info: job },
            ]);
            setAddedToBatchCount((prevCounter) => prevCounter + 1);
        }
    };

    return (
        <div>
            <div className="legend">
                <div className="legend-heading">Legend</div>
                <div className="legend-items">
                    <div className="legend-item">
                        <MdAddCircle />
                        <span>Create A Job</span>
                    </div>
                    <div className="legend-item">
                        <MdEdit />
                        <span>Edit A Job</span>
                    </div>
                    <div className="legend-item">
                        <RiInboxArchiveFill />
                        <span>Archive A Job</span>
                    </div>
                    <div className="legend-item">
                        <RiInboxUnarchiveFill />
                        <span>Unarchive A Job</span>
                    </div>
                    <div className="legend-item">
                        <input type="checkbox" />
                        <span>Select to add item to batch list </span>
                    </div>
                </div>
            </div>
            <div className="header">
                <Link to={`/jobs/create`} className="router-link">
                    <MdAddCircle className="icon" />
                </Link>
                <button
                    onClick={() =>
                        setDisplayArchived((prevState) => !prevState)
                    }>
                    {displayArchived
                        ? "Hide Archived Jobs"
                        : "Show Archived Jobs"}
                </button>
            </div>

            {!displayArchived && (
                <>
                    <p>
                        To update multiple jobs click the checkbox of the jobs
                        you would like to update. Choose the status you would
                        like to change it to and click update.
                    </p>
                    <div className="home-input-container">
                        <div className="batchUpdateForm">
                            <label>
                                Select a status for batch update:
                                <select
                                    value={selectedBatchStatus}
                                    onChange={(e) =>
                                        setSelectedBatchStatus(e.target.value)
                                    }>
                                    <option value="none">None</option>
                                    <option value="in progress">
                                        In progress
                                    </option>
                                    <option value="submitted">Submitted</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </label>
                            <button onClick={handleBatchUpdate}>Update</button>
                        </div>
                        <div className="filter-form">
                            <label>
                                Filter By status:
                                <select
                                    value={selectedFilterStatus}
                                    onChange={(e) =>
                                        setSelectedFilterStatus(e.target.value)
                                    }>
                                    <option value="none">None</option>
                                    <option value="in progress">
                                        In progress
                                    </option>
                                    <option value="submitted">Submitted</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </label>
                        </div>
                        {/* Provide a different filter sort select box according to the selectedStatus */}
                        {selectedFilterStatus === "none" ? (
                            <label>
                                Sort:
                                <select
                                    value={selectedSort}
                                    onChange={(e) =>
                                        setSelectedSort(e.target.value)
                                    }>
                                    <option value="none">None</option>
                                    <option value="date submitted">
                                        Date submitted
                                    </option>
                                    <option value="status">Status</option>
                                </select>
                            </label>
                        ) : (
                            <label>
                                Sort:
                                <select
                                    value={selectedSort}
                                    onChange={(e) =>
                                        setSelectedSort(e.target.value)
                                    }>
                                    <option value="none">None</option>
                                    <option value="date submitted">
                                        Date submitted
                                    </option>
                                </select>
                            </label>
                        )}
                    </div>
                </>
            )}
            <h1>Job Listings</h1>
            <div className="jobs-container">
                {loading ? (
                    <Loading />
                ) : jobs.length > 0 ? (
                    jobs.map((job, i) => (
                        <div key={job._id} className="job-container">
                            <div className="job-header">
                                <span className="job-title">{job.title}</span>
                                <span>{i + 1}</span>
                            </div>
                            <div className="job-info-description">
                                <div>Description: </div>
                                <span>{job.description}</span>
                            </div>
                            <div className="job-info-container">
                                <span>Status: </span>
                                <span>{job.status.option}</span>
                            </div>
                            <div className="job-info-container">
                                <span>Date submitted: </span>
                                <span>
                                    {new Date(job.createdAt).toLocaleDateString(
                                        "en-us",
                                        {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                            <div className="job-info-container">
                                <span>Location: </span>
                                <span>{job.location}</span>
                            </div>
                            <div className="job-info-container">
                                <span className="operations">
                                    {!job.archived ? (
                                        <>
                                            <RiInboxArchiveFill
                                                onClick={() =>
                                                    handleArchiveBook(job, true)
                                                }
                                                className="icon router-link"
                                            />
                                            <Link
                                                to={`/jobs/edit/${job._id}`}
                                                className="router-link">
                                                <MdEdit className="icon" />
                                            </Link>
                                        </>
                                    ) : (
                                        <RiInboxUnarchiveFill
                                            onClick={() =>
                                                handleArchiveBook(job, false)
                                            }
                                            className="icon"
                                        />
                                    )}
                                    {!job.archived && (
                                        <input
                                            className="add-batch-checkbox"
                                            type="checkbox"
                                            onClick={() => addToBatchList(job)}
                                        />
                                    )}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="jobs-empty">
                        No current jobs with selected status/no archived jobs
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
