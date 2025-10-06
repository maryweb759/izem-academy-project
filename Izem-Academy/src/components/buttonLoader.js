import { ClipLoader } from 'react-spinners';

const ButtonLoader = ({ size = 20, color = "#ffffff" }) => (
  <ClipLoader
    color={color}
    loading={true}
    size={size}
    aria-label="Loading Spinner"
  />
);

export default ButtonLoader;