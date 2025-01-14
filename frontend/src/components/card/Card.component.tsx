'use client'
import React, { } from "react";
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import 'react-slideshow-image/dist/styles.css'
import { Button, Card, CardContent, Grid, Tooltip, Typography } from "@mui/material";
import { getCookieToken } from "@/common/utils/getCookieToken";
import { toast } from "react-toastify";
import { IFiles } from "@/common/interface/files/files.interface";
import { convertBits } from "@/common/utils/convertType";
import { typeImage, typeVideo } from "@/common/const/const/fileType.constant";
interface PropCard {
  _id: string
  userOwner: string
  path: string
  filename: string
  size: number
  isPublic: boolean
  userAccess: any[]
  createdAt: string
  updatedAt: string
  __v: number,
  handleOpen: (file: IFiles) => void
  openVisualizer: () => void
  setTypeOfFile: any,
}
export default function CardComponent(prop: PropCard) {
  const { __v, _id, createdAt, filename, isPublic, path, size, updatedAt, userAccess, userOwner, handleOpen, openVisualizer, setTypeOfFile } = prop
  const getImage = (nameFile: string) => {
    const type = nameFile.split('.')[1]
    if (typeImage.includes(type)) {
      return (< ImageIcon />)

    } else if (typeVideo.includes(type)) {
      return (< OndemandVideoIcon />)
    } else if (type === 'pdf') {
      return (<PictureAsPdfIcon />)
    } else if (['zip', 'tar'].includes(type)) {
      return (<FolderZipIcon />)
    }
    return (<QuestionMarkIcon />)
  }
  const dowloadFile = (imageId: string, filename: string, option = 1) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/files/download/${imageId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear el archivo Excel');
        }
        return response.blob();
      }).then(blob => {
        const type = filename.split('.')[1]
        console.log();
        const url = window.URL.createObjectURL(blob);
        if (option === 1) {

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else if (option === 2) {


          if (typeImage.includes(type)) {
            openVisualizer()
            setTypeOfFile(1)
            const imageTag = document.querySelector('#image-visualizer');
            if (imageTag) {
              // @ts-expect-error probably is not null 
              imageTag.src = url;
            }
          } else if (typeVideo.includes(type)) {

            openVisualizer()
            setTypeOfFile(2)
            const videoElement = document.getElementById('video-visualizer');
            // @ts-ignore
            document.getElementById('title-file').innerHTML = filename
            if (videoElement) {
              // @ts-ignore
              videoElement.src = url;
              const videoTag = document.querySelector('#video-visualizer-father');
              // @ts-ignore
              videoTag.load(); // Reload the video to apply the new source
            }

          }

        }


      }).catch(error => {
        toast.error("!oops lo sentimos tenemos un error para visualizar!");
      })

  }
  return (
    <Card >
      <CardContent>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={1}>
            {getImage(filename)}

          </Grid>
          <Grid item xs={3}>
            <Tooltip title={filename}>
              <Typography variant="body1" component="div" noWrap={true}>
                {filename}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" component="div" noWrap={true} className="text-center">
              {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body1" component="div" noWrap={true} className="text-left">
              {convertBits(size)}
            </Typography>

            <Typography variant="body1" component="div" color="text.secondary" noWrap={true}>

            </Typography>
          </Grid>
          <Grid item container xs={2} >
            <Grid item xs={6} >
              <Tooltip title="Descargar">
                <Button size="small" onClick={() => dowloadFile(_id, filename)}><ArrowDownwardIcon /></Button>
              </Tooltip>
            </Grid>
            <Grid item xs={6} >
              <Tooltip title="Visualizar">
                <Button size="small" onClick={() => dowloadFile(_id, filename, 2)}><RemoveRedEyeIcon /></Button>
              </Tooltip>
            </Grid>

          </Grid>
          {/* <Grid item xs={1} >
            <Tooltip title="Descargar">
              <Button size="small" variant="text" onClick={() => handleOpen(prop)}><SettingsIcon /></Button>
            </Tooltip>
          </Grid> */}
        </Grid>
      </CardContent>

    </Card>
  );
} 