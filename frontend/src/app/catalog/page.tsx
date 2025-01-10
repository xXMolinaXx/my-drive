'use client'
import React, { useEffect, useState, useContext, Suspense } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import MainLayout, { StoreContext } from "@/components/layout/MainLayout";
import { useSearchParams } from 'next/navigation'
import 'react-slideshow-image/dist/styles.css'
import { Button, Card, CardContent, CircularProgress, Grid, Pagination, Tooltip, Typography } from "@mui/material";
import { config } from "@/common/configs/config";
import { getCookieToken } from "@/common/utils/getCookieToken";
import { toast } from "react-toastify";
import { IFiles } from "@/common/interface/files/files.interface";
import { convertBits } from "@/common/utils/convertType";
import ConfigureFile from "@/components/modals/configureFile.modal";
import CardComponent from "@/components/card/Card.component";
import ModalImage from "@/components/modals/image.modal";

function Catalog2() {
  const { setShoppingCart, shoppingCart, user } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const search = searchParams.get('searchWord')
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<IFiles[]>([
    {
      __v: 0,
      _id: '',
      createdAt: '',
      filename: '',
      isPublic: false,
      path: '',
      size: 0,
      updatedAt: '',
      userAccess: [],
      userOwner: ''
    }
  ]);
  const [typeOfFile, settypeOfFile] = useState(0);
  const [searchWord, setSearchWord] = useState('ninguno');
  const [skip, setSkip] = useState(0);
  const [limit,] = useState(24);
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectFile, setSelectFile] = useState<any>({})
  const [openModalImage, setOpenModalImage] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  const handleOpen = (file: IFiles) => {
    setSelectFile(file)
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const onChangeImage = async (target: React.ChangeEvent<any>) => {
    try {
      setLoading(true)
      const file = target.currentTarget.files[0];
      if (file !== undefined) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user._id);
        let data: any = await fetch(`${config.backend}/files/upload/${`${user._id}-${file.name}`}`, {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "application/json",
            // Accept: "application/json",
            Authorization: `Bearer ${getCookieToken()}`,
          },
        }).then(data => data.json());
        if (data.success) {
          fetchFiles()
          toast.success("Imagen subida");
        } else if (data.statusCode === 500) {
          toast.error(data.message);
        } else {
          toast.error(data.message);
        }

      }
    } catch (error: any) {
      console.log(error);
      toast.error("Ocurrio un error al subir la imagen");
    }

    setLoading(false);
  };

  // const handleSearchProducts = () => {
  //   setLoadingProducts(true);
  //   setProducts([])
  //   fetch(`${config.backend}/products/${skip}/${limit}/${search ? search : 'ninguno'}`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${getCookieToken()}`,
  //     },
  //   }).then(data => data.json()).then(data => {
  //     if (data.statusCode === 200) {
  //       setProducts(data.data?.products || [])
  //       setAmount(Math.round(data.data?.count / limit))
  //       setLoadingProducts(false);
  //     } else {
  //       setOpenAlert(true);
  //       setmessageAlert(data.message)
  //     }
  //   }).catch(e => {
  //     setLoadingProducts(false)
  //     setOpenAlert(true);
  //     setmessageAlert(e.toString())
  //   })
  // }
  const fetchFiles = async () => {
    setLoadingFiles(true)
    if (user) {
      const resp = await fetch(`${config.backend}/files/${user._id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieToken()}`,
        },
      }).then(data => data.json())
      if (resp.success) {
        setFiles(resp.data)
      } else {
        toast.error('Error al cargar archivos')
      }

    }
    setLoadingFiles(false)
  }
  useEffect(() => {
    fetchFiles()
  }, [user])
  return (
    <div className="sm:px-4   mb-14">
      <ModalImage open={openModalImage} handleClose={() => { setOpenModalImage(false) }} handleClickOpen={() => { }} typeOfFile={typeOfFile} />
      <ConfigureFile open={open} onClose={handleClose} file={selectFile} reload={fetchFiles} />
      <section className="mt-4 flex">
        <Button variant="contained" startIcon={loading ? <CircularProgress /> : <CloudUploadIcon />} disabled={loading} onClick={() => {
          //@ts-ignore
          document.getElementById(`fileInput`).click()
        }}>Nuevo</Button>
        <input
          id={`fileInput`}
          className="hidden"
          type="file"
          name="avatar"

          onChange={onChangeImage}
        />
      </section>
      <section className="pt-5">
        <Grid container justifyContent="center">
          <Grid item xs={1}>

          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" component="div" noWrap={true}>
              Archivo
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" component="div" noWrap={true}>
              creado
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body1" component="div" color="text.secondary" noWrap={true}>
              Tamaño
            </Typography>
          </Grid>
          <Grid item xs={1}>

          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" className="mt-3">
          {loadingFiles ? <CircularProgress /> : files?.map(data => (
            <Grid key={data._id} item xs={12}>

              <CardComponent
                {...data}
                handleOpen={handleOpen}
                openVisualizer={() => {
                  setOpenModalImage(true);

                }}
                setTypeOfFile={settypeOfFile} />
            </Grid>
          ))}
          {files.length === 0 && <Typography variant="h5" textAlign={'center'} className="p-5">No tienes ningún elemento guardado</Typography>}
        </Grid>
        <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />
      </section>

    </div>
  );
}
const CatalogPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Catalog2 />
    </Suspense>
  );
};

export default function Catalog() {
  return (
    <MainLayout>
      <CatalogPage />
    </MainLayout>
  )
}


