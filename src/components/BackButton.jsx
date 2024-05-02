import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

// redirects the user to the home page
const BackButton = ({ destination = "/" }) => {
    return (
        <div>
            <Link to={destination} className="router-link">
                <BsArrowLeft className="back-button" />
            </Link>
        </div>
    );
};

export default BackButton;
