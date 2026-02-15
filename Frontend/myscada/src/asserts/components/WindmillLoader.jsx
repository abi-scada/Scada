import { motion } from "framer-motion";
import "../styles/Windmill.css";
import ro from '../ro_bl.png';

const WindmillLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="rotor-wrapper">
  <svg
    className="rgb-arcs"
    width="180"
    height="180"
    viewBox="0 0 180 180"
  >
    <defs>
      <linearGradient id="grad1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="180" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="red" stopOpacity="1" />
      </linearGradient>

      <linearGradient id="grad2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="180" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="lime" stopOpacity="1" />
      </linearGradient>

      <linearGradient id="grad3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="180" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="blue" stopOpacity="1" />
      </linearGradient>
    </defs>

    <circle className="arc arc1" cx="110" cy="80" r="60" stroke="url(#grad1)" />
    <circle className="arc arc2" cx="110" cy="80" r="60" stroke="url(#grad2)" />
    <circle className="arc arc3" cx="110" cy="80" r="60" stroke="url(#grad3)" />
  </svg>

  <motion.img
    src={ro}
    alt="Loading"
    className="rotor"
    animate={{ rotate: 360 }}
    transition={{
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }}
  />
</div>

      <p>Loading SCADA Data...</p>
    </div>
  );
};

export default WindmillLoader;
