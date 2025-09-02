import {  useEffect, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

const Carosel = ({width = 50,height=40,time = 10000}) =>{
    const imgs = ["https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
"https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
"https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg",
"https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
"https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg",
"https://pixlr.com/images/generator/text-to-image.webp",
"https://www.bnf.fr/sites/default/files/2019-10/btv1b8457904c_f1.jpg"

    ]
    const wdToPixel = width*4;
    const hgToPixel = height*4;
    const [current, setCurrent] = useState(0);
    const next = () =>{
    current == imgs.length-1 ? setCurrent(0) : setCurrent(current+1);
    }
    const prev = () =>{
       current==0 ? setCurrent(imgs.length-1) : setCurrent(current-1);
    }
    useEffect(()=>{
        const interval = setInterval(()=>{
            next();
        },time);
        return ()=> clearInterval(interval);
    },[current])
    return(
        <div style={{
            width: wdToPixel
        }}>
        <div className="relative overflow-hidden">
            <div className="flex transiton ease-out duration-500" style={{
                transform: `translateX(-${current*(wdToPixel)}px)`
            }}>
                {
                  imgs.map((img)=>(
                    <img src={img} style = {{
                        width: wdToPixel,
                        height: hgToPixel
                    }}className="object-cover shrink-0"/>
                  ))
                }
            </div>
            {
         
            <div className="text-white/0 hover:text-white absolute top-0 h-full w-full flex justify-between items-center px-2 text-lg transition ease-out duration-500">
            <FaArrowCircleLeft onClick={()=>prev()}/>
            <FaArrowCircleRight  onClick={()=>next()}/>
            </div>
            }
        </div>
        </div>
    );
}
export default Carosel