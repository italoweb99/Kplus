import { useState } from 'react';
interface props{
    size?: number,
    color?: String,
    onClick?: (e:any) => void
}
const ExpandIcon = ({size=24, color ='#000000', onClick = ()=>{}}:props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const translateFrac = size*0.6
  // Define the transform values for each path when hovered
  const transform1 = isHovered ? `translate(-${translateFrac}px, -${translateFrac}px)` : 'none'; // Example for top-left path
  const transform2 = isHovered ? `translate(${translateFrac}px, -${translateFrac}px)` : 'none'; // Example for top-right path
  const transform3 = isHovered ? `translate(-${translateFrac}px, ${translateFrac}px)` : 'none'; // Example for bottom-left path
  const transform4 = isHovered ? `translate(${translateFrac}px, ${translateFrac}px)` : 'none'; // Example for bottom-right path

  return (
  
    <svg
      id="Camada_2"
      data-name="Camada 2"
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
            .cls-2 {
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
        <path className="cls-2" d="m299.26,295.37h-111.36c-3.19,0-5.77-2.58-5.77-5.77v-23.46c0-3.19,2.58-5.77,5.77-5.77h76.36v-74.41c0-3.19,2.58-5.77,5.77-5.77h23.46c3.19,0,5.77,2.58,5.77,5.77v109.41Z"
        style={{transform:transform4}}/>
        <path className="cls-2" d="m0,295.37h111.36c3.19,0,5.77-2.58,5.77-5.77v-23.46c0-3.19-2.58-5.77-5.77-5.77H35v-74.41c0-3.19-2.58-5.77-5.77-5.77H5.77c-3.19,0-5.77,2.58-5.77,5.77v109.41Z"
        style={{transform:transform3}}/>
      </g>
      <g>
        <path className="cls-2"d="m299.26,0h-111.36c-3.19,0-5.77,2.58-5.77,5.77v23.46c0,3.19,2.58,5.77,5.77,5.77h76.36v74.41c0,3.19,2.58,5.77,5.77,5.77h23.46c3.19,0,5.77-2.58,5.77-5.77V0Z"
        style={{transform:transform2}}/>
        <path className="cls-2" d="m0,0h111.36c3.19,0,5.77,2.58,5.77,5.77v23.46c0,3.19-2.58,5.77-5.77,5.77H35v74.41c0,3.19-2.58,5.77-5.77,5.77H5.77c-3.19,0-5.77-2.58-5.77-5.77V0Z"
        style={{transform:transform1}}/>
      </g>

        </g>
      </g>
    </svg>

  );
};

export default ExpandIcon;