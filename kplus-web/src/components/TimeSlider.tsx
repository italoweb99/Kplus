interface TimeSliderPrpos{
    width?: number
    per: any;
    className?: string;
    bgColor?: string;
    sldColor?: string;
}

const TimeSlider = ({width = 64,per,className = "h-1 rounded-xs" ,bgColor = "rgba(0,0,0,0.2)",sldColor = "gray"}: TimeSliderPrpos) =>{
const wdToPixel = width*4;
const wdFinal = wdToPixel - (wdToPixel*0.05)
const wdPer = wdFinal*per;
return(
    <div className="mx-0.5 absolute bottom-1">
    <div style={{
        backgroundColor: bgColor,
        width: wdFinal
    }} className={className}>
<div style={{
    backgroundColor: sldColor,
    width: wdPer
}} className={className}></div>
    </div>
    </div>
)
}
export default TimeSlider