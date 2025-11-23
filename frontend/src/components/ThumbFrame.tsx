
import TimeSlider from "./TimeSlider";
interface ThumbFrameProps{
  tempo_assist: number|null;
  duracao: number;
  src: string;
  width?: number;
  height?: number;
}
const ThumbFrame = ({tempo_assist=null,duracao,src,width = 40 ,height = 30}:ThumbFrameProps) =>{
    const wdToPixel = width*4;
    const hgToPixel = height*4;
    
    return(
     
      <div className="relative overflow-hidden shrink-0" style={{
        height: hgToPixel,
        width: wdToPixel
      }}>
        <div className="hover:bg-black/10 absolute top-0 rounded-lg"style={{
            height: hgToPixel,
            width: wdToPixel
        }}></div>
        <img src={src} className="object-cover rounded-lg"style={{
            width: wdToPixel,
            height: hgToPixel
        }}/>
        {tempo_assist != null &&(
                    <TimeSlider per = {(tempo_assist)/duracao} width={width}/>
                    )}
      </div>

    );

}
export default ThumbFrame