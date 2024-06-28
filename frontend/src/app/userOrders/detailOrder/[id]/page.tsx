'use client'
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IOrder } from "@/common/interface/orders/orders.interface";
import MainLayout from "@/components/layout/MainLayout";
import { Backdrop, Button, CircularProgress, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { config } from "@/common/configs/config";
import { getCookieToken } from "@/common/utils/getCookieToken";
import MainAlert from "@/components/alerts/MainAlert";

interface props2 {
  userOrder: string
}
interface params {
  params: { id: string };
}
function DetailOrder({ userOrder }: props2) {
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('error')
  const [loading, setloading] = useState(false)
  const [order, setorder] = useState<IOrder>({
    __v: 0,
    _id: '12sd',
    branch: 'la granja',
    cart: [],
    createdAt: '',
    finalPayment: 0,
    reservationDate: {
      date: 0,
      hour: 0,
      minute: 0,
      month: 0,
      year: 0
    },
    status: '',
    updatedAt: '',
    userId: '',
    user: [{ _id: '', DNI: '', fullName: '', identification: '', telphone: '', email: '' }],
    payed: false,
    urlPayment: '',
    imagePaymentName: ''
  })
  const onChangeImage = async (target: React.ChangeEvent<any>, index: string) => {
    try {
      setloading(true)
      const file = target.currentTarget.files[0];
      if (file !== undefined) {
        const formData = new FormData();
        formData.append("file", file);
        let data: any = await fetch(`${config.backend}/files/upload/${index}.${file.type.split('/')[1]}`, {
          method: "POST",
          body: formData,
        }).then(data => data.json());
        if (!data.success) throw data.error
        const resp2 = await fetch(`${config.backend}/orders/${index}`, {
          method: 'PUT',
          body: JSON.stringify({ urlPayment: data.data.fileName, type: 4 }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieToken()}`,
          },
        }).then(data => data.json());
        if (resp2.statusCode !== 200) throw resp2.error;
        getOrder()
        setSnackBarMessage('Imagen cargada con exito');
        setOpenSnackBar(true);
        setSnackbarType('success')
      }
    } catch (error: any) {
      setSnackBarMessage(error);
      setOpenSnackBar(true);
      setSnackbarType('error')
    }
    setloading(false);
  };
  const getOrder = () => {
    setloading(true);
    fetch(`${config.backend}/orders/${userOrder}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then((data) => data.json()).then(data => {
      if (data.statusCode === 200) {
        setorder(data.data)
      }
      setloading(false);
    }).catch(() => setloading(false))
  }
  useEffect(() => {
    getOrder()
  }, [])
  return <Grid container className="pt-5" spacing={3}>
    <Grid item xs={12} md={6} lg={6} >
      # orden: {order._id.substring(order._id.length - 6, order._id.length)}
      <Typography variant="h4" className="text-blue-700" color="text.secondary" gutterBottom>
        {order.status}
      </Typography>
      <Typography className="font-bold">
        Fecha: {`${dayjs(order.createdAt).format("YYYY MMMM DD")} ${order.reservationDate.hour > 9 ? order.reservationDate.hour : `0${order.reservationDate.hour}`}:${order.reservationDate.minute > 9 ? order.reservationDate.minute : `0${order.reservationDate.minute}`} `}
      </Typography>
      <Typography variant="body2">
        Sucursal {order.branch}
      </Typography>

      <Typography className="font-bold">
        {`Pago realizado:        ${order.payed ? 'SI' : 'NO'} `}
      </Typography>
      <Paper elevation={4} className="w-full p-3 mt-5">
        <Typography variant="h4" align="center" className="text-blue-500 bolder font-black" >Resumen de orden</Typography>
        <Divider />
        <TableContainer >
          <Table >
            <TableBody>
              {
                order.cart.map(product => (
                  <TableRow key={product._id}>
                    <TableCell component="th" scope="row">
                      {product.name} * {product.amount}
                    </TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                  </TableRow>
                ))
              }

              <TableRow>
                <TableCell className=" w-1/5">
                  DESCUENTO(3RA Y 4TA EDAD)
                </TableCell>
                <TableCell align="right" className="font-black w-4/5"> L. 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-black w-1/5"  >
                  TOTAL
                </TableCell>
                <TableCell align="right" className="font-black w-4/5">L. {order.finalPayment.toFixed(2)} </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
    <Grid item xs={12} md={6} lg={6}>
      <input
        id={`fileInput`}
        className="hidden"
        type="file"
        name="avatar"
        accept="image/png, image/jpeg"
        onChange={(e) => onChangeImage(e, order._id)}
      />
      <Tooltip title="Sube tu imagen del pago al banco">
        <Button size="small" variant="text" onClick={() => {
          //@ts-ignore
          document.getElementById(`fileInput`).click()
        }}><CloudUploadIcon className="mx-2" />Carga tu imagen de pago</Button>
      </Tooltip>
      <Image src={`${config.backend}/files/getFile/${order.imagePaymentName}`} alt="Imagen de pago" height={500} width={500} />
    </Grid>
    <MainAlert handleClose={() => { setOpenSnackBar(false); setSnackBarMessage(''); setSnackbarType('error') }} open={openSnackBar} message={snackBarMessage} type={snackbarType} duration={10000} />
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  </Grid>
}

export default function WrappedOrderUser({ params }: params) {
  return (
    <MainLayout>
      <DetailOrder userOrder={params.id} />
    </MainLayout>
  )
}