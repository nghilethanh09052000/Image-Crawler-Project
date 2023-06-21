import { CircularProgress } from "@mui/material";


const CircleLoading = () => {
    return ( 
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                cursor: 'wait',
                pointerEvents: 'fill',
                userSelect: 'none'  
            }}
        >    
            <CircularProgress color="secondary" size={40}/>    
        </div>
     );
}
 
export default CircleLoading;