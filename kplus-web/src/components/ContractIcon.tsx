import React, { useState } from 'react';
interface propsCon{
    size?: number,
    color?: String,
    onClick?: (e:any) => void
}
const ContractIcon = ({size=24, color ='#FFFFFF', onClick = ()=>{}}:propsCon) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const translateFrac = size*0.6
  // Define the transform values for each path when hovered
  const transform1 = isHovered ? `translate(${translateFrac}px, -${translateFrac}px)` : 'none'; // Example for top-left path
  const transform2 = isHovered ? `translate(-${translateFrac}px, -${translateFrac}px)` : 'none'; // Example for top-right path
  const transform3 = isHovered ? `translate(${translateFrac}px, ${translateFrac}px)` : 'none'; // Example for bottom-left path
  const transform4 = isHovered ? `translate(-${translateFrac}px, ${translateFrac}px)` : 'translate(0, 0)'; // Example for bottom-right path

  return (
  
    <svg
      id="Camada_3"
      data-name="Camada 3"
      width={size}
      height={size}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 299.26 295.37"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ overflow: 'visible' }} // Important for seeing transforms if paths move outside original bounds
    >
      <defs>
        <style>
          {`
            .cls-1 {
            
              fill: ${color};
              stroke-width: 0px;
             
              transition: transform 0.3s ease-out; /* Smooth transition for hover effect */
            }
          `}
        </style>
      </defs>
      <g id="Camada_1-2" data-name="Camada 1">
        <g>
          <g>
            {/* Top-right original: d="m344.76,496.63v-143.04c0-15.34,12.44-27.78,27.78-27.78h161.99" */}
            <path
              className="cls-1"
            d="m182.13,180.18h111.36c3.19,0,5.77,2.58,5.77,5.77v23.46c0,3.19-2.58,5.77-5.77,5.77h-76.36v74.41c0,3.19-2.58,5.77-5.77,5.77h-23.46c-3.19,0-5.77-2.58-5.77-5.77v-109.41Z"
              style={{ transform: transform2 }} // Apply dynamic transform
            />
            {/* Top-left original: d="m219.76,496.63v-143.04c0-15.34-12.44-27.78-27.78-27.78H30" */}
            <path
              className="cls-1"
            d="m117.13,180.18H5.77c-3.19,0-5.77,2.58-5.77,5.77v23.46c0,3.19,2.58,5.77,5.77,5.77h76.36v74.41c0,3.19,2.58,5.77,5.77,5.77h23.46c3.19,0,5.77-2.58,5.77-5.77v-109.41Z"
              style={{ transform: transform1 }} // Apply dynamic transform
            />
         
            {/* Bottom-right original: d="m344.76,30v143.04c0,15.34,12.44,27.78,27.78,27.78h161.99" */}
            <path
              className="cls-1"
             d="m182.13,115.18h111.36c3.19,0,5.77-2.58,5.77-5.77v-23.46c0-3.19-2.58-5.77-5.77-5.77h-76.36V5.77c0-3.19-2.58-5.77-5.77-5.77h-23.46c-3.19,0-5.77,2.58-5.77,5.77v109.41Z"
              style={{ transform: transform4 }} // Apply dynamic transform
            />
            {/* Bottom-left original: d="m219.76,30v143.04c0,15.34-12.44,27.78-27.78-27.78H30" */}
            <path
              className="cls-1"d="m117.13,115.18H5.77c-3.19,0-5.77-2.58-5.77-5.77v-23.46c0-3.19,2.58-5.77,5.77-5.77h76.36V5.77c0-3.19,2.58-5.77,5.77-5.77h23.46c3.19,0,5.77,2.58,5.77,5.77v109.41Z"
              style={{ transform: transform3 }} // Apply dynamic transform
            />
          </g>
        </g>
      </g>
    </svg>

  );
};

export default ContractIcon;