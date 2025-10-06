// components/LoadingSpinner.jsx
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 35, color = "#1296B3" }) => (
  <div className="flex justify-center items-center min-h-[200px]">
    <ClipLoader
      color={color}
      loading={true}
      size={size}
      aria-label="Loading Spinner"
    />
  </div>
);

export default LoadingSpinner;

