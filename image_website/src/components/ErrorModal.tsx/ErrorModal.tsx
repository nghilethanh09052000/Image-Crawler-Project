'use client'

import ModalDialog from "../ModalDialog/ModalDialog";
import {useContext} from 'react'
import { 
    AppContext, 
    setError
} from "@/context/Context";



const ErrorModal = () => {

    const {state, dispatch} = useContext(AppContext)
    const {
        error 
    } = state


    const handleCloseError = () =>{
        setError(dispatch, {...error, isError:false })
    }
 

    return (
        <ModalDialog
            isDialogOpen={error.isError}
            closeModal={handleCloseError}
            title={''}
        >
            <div className="w- pb-3 bg-white">
                {error.message}
            </div>
        </ModalDialog>
    );
}
 
export default ErrorModal;