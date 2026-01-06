import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons'; // Specific icon
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'; // Specific icon

export default function App() {
  return (
    <div>
        {/* Pass the icon object directly */}
        <FontAwesomeIcon icon={faHouse} />
        <FontAwesomeIcon icon={faCircleUser} />
    </div>
  );
}