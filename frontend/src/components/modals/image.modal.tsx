import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Typography } from '@mui/material';
interface props {
  open: boolean,
  handleClose: () => void
  handleClickOpen: () => void
  typeOfFile: number
}
export default function ModalImage({ open, handleClose, handleClickOpen, typeOfFile }: props) {
  const imageTag = document.querySelector('#image-visualizer');
  const videoElement = document.getElementById('video-visualizer');
  const close = () => {
    // if (imageTag) {
    //   // @ts-expect-error probably is not null 
    //   imageTag.src = '';
    //   // @ts-expect-error probably is not null 
    //   videoElement.src = '';
    //   const videoTag = document.querySelector('video');
    //   // @ts-ignore
    //   videoTag.load();
    // }
    handleClose();
  }
  // useEffect(() => {
  //   return () => {
  //     alert(1)
  //   }
  // }, [])
  return (
    <div className={`${!open && 'hidden'} fixed inset-0 flex items-center justify-center z-50 max-h-dvh`} >
      <div className="absolute inset-0 bg-black opacity-50" onClick={close}></div>
      <div className="relative bg-white rounded-lg shadow-2xl w-4/5 max-w-3xl p-6 border-2 border-black" >
        <div className="flex flex-col items-center">
          <Typography id='title-file'> </Typography>
          <img id="image-visualizer" alt="image file" className={` ${typeOfFile === 1 ? 'static' : 'hidden'} max-h-[500px] mb-4 rounded`} />
          <video id='video-visualizer-father' controls className={`${typeOfFile === 2 ? 'static' : 'hidden'}`}>
            <source id="video-visualizer" />
            Your browser does not support the video tag.
          </video>
          <Button
            className="w-20"
            variant="outlined"
            color="error"
            onClick={close}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
