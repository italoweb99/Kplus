//import React from 'react';
import { motion, easeInOut} from 'framer-motion';
interface props {
    size?:number,
    color?: string,
}
// Este componente recebe o SVG e aplica a animação
const Loader = ({size=150,color='black'}:props) => {
  // Define a animação de repetição para os polígonos
  const p1 = size*(20/150)
const p2 = size*(10/150)
  const polygonAnimation = {
    // Estado inicial (opcional, pode ser omitido)
    initial: {
      scale: 1,
      rotate: 0,
      y: 0,
      opacity: 1,
    },
    // Estado de animação
    animate: {
       // Escala de 0.8 para 1 e volta para 0.8
      rotate: 180,          // Rotação de 360 graus
      y: [0, (-p1),(-p1), 0],       // Movimento vertical para cima e para baixo
    },
    // Propriedades da transição
    transition: {
      duration: 2,          // Duração da animação
      ease: easeInOut,      // Tipo de easing
      repeat: Infinity,     // Repete a animação infinitamente
     // repeatType: 'reverse',  // Inverte a animação a cada repetição
    },
  };
  const polygonAnimation2 = {
    // Estado inicial (opcional, pode ser omitido)
    initial: {
      scale: 1,
      rotate: 0,
      y: 0,
      opacity: 1,
    },
    // Estado de animação
    animate: {
       // Escala de 0.8 para 1 e volta para 0.8
      rotate: 180,          // Rotação de 360 graus
      y: [0,p2,p2, 0],   
      x:[0,p2,p2,0]    // Movimento vertical para cima e para baixo
    },
    // Propriedades da transição
    transition: {
      duration: 2,          // Duração da animação
      ease: easeInOut,      // Tipo de easing
      repeat: Infinity,     // Repete a animação infinitamente
      //repeatType: 'reverse',  // Inverte a animação a cada repetição
    },
  };
  const polygonAnimation3 = {
    // Estado inicial (opcional, pode ser omitido)
    initial: {
      scale: 1,
      rotate: 0,
      y: 0,
      opacity: 1,
    },
    // Estado de animação
    animate: {
       // Escala de 0.8 para 1 e volta para 0.8
      rotate: 180,          // Rotação de 360 graus
      y: [0,p2, p2,0],   
      x:[0,(-p2),(-p2),0]    // Movimento vertical para cima e para baixo
    },
    // Propriedades da transição
    transition: {
      duration: 2,          // Duração da animação
      ease: easeInOut,      // Tipo de easing
      repeat: Infinity,     // Repete a animação infinitamente
      //repeatType: 'reverse',  // Inverte a animação a cada repetição
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <motion.svg
        // Adiciona as props de animação ao elemento <svg> principal
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        fill= {color}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 314 313.74"
        width={size}
        style={{overflow: 'visible'}}
      >
        <g>
          {/* Polígono 1 */}
          <motion.polygon
            //className="cls-3"
            points="147 271.31 147 186.44 73.5 144 0 186.44 0 271.31 73.5 313.74 147 271.31"
            // Aplica a animação definida
            {...polygonAnimation3}
          />
          {/* Polígono 2 */}
          <motion.polygon
           // className="cls-3"
            points="314 271.31 314 186.44 240.5 144 167 186.44 167 271.31 240.5 313.74 314 271.31"
            // Aplica a animação com um pequeno atraso
            {...polygonAnimation2}
          
          />
          {/* Polígono 3 */}
          <motion.polygon
            //className="cls-3"
            points="230 127.31 230 42.44 156.5 0 83 42.44 83 127.31 156.5 169.74 230 127.31"
            // Aplica a animação com outro pequeno atraso
            {...polygonAnimation}
            
          />
        </g>
      </motion.svg>
    </div>
  );
};

export default Loader;