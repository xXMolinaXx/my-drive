
'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Backdrop, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Dialog, Divider, Grid, LinearProgress, Pagination, Tooltip, Typography } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { config } from "@/common/configs/config";
import { IOrder } from "@/common/interface/orders/orders.interface";
import MainAlert from "@/components/alerts/MainAlert";
import { getCookieToken } from "@/common/utils/getCookieToken";
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
interface params {
  params: { id: string };
}
interface props2 {
  userOrder: string
}
function OrderUser({ userOrder }: props2) {
  const router = useRouter()
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [imageSelect, setimageSelect] = useState('')
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(25)
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [startAt, setstartAt] = useState<Dayjs | null>(dayjs());
  const [endAt, setendAt] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [orders, setorders] = useState<IOrder[]>([{
    __v: 0,
    _id: '',
    branch: '',
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
    imagePaymentName: '',
    totalDiscount: 0,
    totalWithoutDiscount: 0,
  }])
  const [open, setOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('error')
  const [selectValue, setselectValue] = useState('');
  const [Cart, setCart] = useState<any>()

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  const getOrder = () => {
    setLoadingOrders(true);
    setorders([])
    fetch(`${config.backend}/orders/readUserOrder`, {
      method: 'POST',
      body: JSON.stringify({
        "startAt": startAt?.toString(),
        "endAt": endAt?.toString(),
        "userId": userOrder,
        "serachWord": "",
        "status": selectValue,
        "advanceSearch": false,
        limit,
        skip,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json())
      .then(data => {
        setLoadingOrders(false);
        if (data.statusCode === 200) {
          setorders(data.data.orders)
          setAmount(Math.round(data.data.amount / limit))
        }
        else {
          setOpenSnackBar(true);
          setSnackBarMessage(data.message)
        }
      })
      .catch(e => {
        setLoadingOrders(false);
        setOpenSnackBar(true);
        setSnackBarMessage(e.toString())
      })
  }
  const onChangeImage = async (target: React.ChangeEvent<any>, index: string) => {
    alert(index);
    try {
      setLoadingOrders(true)
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
    setLoadingOrders(false);
  };
  useEffect(() => {
    getOrder()
  }, [startAt, endAt, selectValue])
  return (
    <div>
      <div className="mb-5 mt-3">
        {/* <TextField className="w-72" helperText="Buscar por nombre o identidad" variant="outlined" onChange={(e) => {
              setSearchWord(e.target.value)
            }} onKeyDown={e => {
              if (e.key === 'Enter') {
                alert('buscando')
              }
            }} InputProps={{
              endAdornment: <Button className="mx-1" variant="contained" onClick={() => {
                alert('buscando')
              }}>Buscar</Button>,

            }} /> */}
        {/* <TextField select className="mx-1 w-1/6" label="Estado de orden" variant="outlined" onChange={(e) => {
            setselectValue(e.target.value)
          }}
          >
            {['en espera', 'pagada', 'terminada', 'cancelada'].map((option, i) => (
              <MenuItem key={`key-status-${option}-${i}`} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Fecha de inicio" className="mx-1" referenceDate={dayjs()}
              value={startAt}
              onChange={(newValue) => setstartAt(newValue)}
            />
            <DatePicker label="Fecha de Final" className="mx-1" referenceDate={dayjs().add(1, 'day')} value={endAt}
              onChange={(newValue) => setendAt(newValue)} />
          </LocalizationProvider> */}
      </div>
      {loadingOrders && <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>}
      <Grid container spacing={2} width={'100%'}  >

        {orders.length === 0 ? <Typography className="mt-5 ml-5" variant="h5" textAlign='center'>No se encontro ninguna orden</Typography> : orders?.map((order, i) => (
          <Grid item sm={12} md={6} lg={3} key={order._id}>
            <Card className="h-full" >
              <CardContent>
                # orden: {order._id.substring(order._id.length - 6, order._id.length)}
                <Typography variant="h4" className="text-blue-700" color="text.secondary" noWrap  gutterBottom>
                  {order.status}
                </Typography>
                <Typography className="font-bold">
                  Fecha: {`${dayjs(order.createdAt).format("YYYY MMMM DD")} ${order.reservationDate.hour > 9 ? order.reservationDate.hour : `0${order.reservationDate.hour}`}:${order.reservationDate.minute > 9 ? order.reservationDate.minute : `0${order.reservationDate.minute}`} `}
                </Typography>
                {/* <Typography color="text.secondary">
                  Total a pagar: L. {order.finalPayment}
                </Typography> */}
                <Typography variant="body2">
                  Sucursal {order.branch}
                </Typography>
                {/* 
                <Typography className="font-bold">
                  {`Pago realizado:        ${order.payed ? 'SI' : 'NO'} `}
                </Typography> */}



                <input
                  id={`fileInput-${order._id}`}
                  className="hidden"
                  type="file"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  onChange={(e) => onChangeImage(e, order._id)}
                />

              </CardContent>
              <CardActions>
                {/* <Tooltip title="Tus productos">
                  <Button size="small" variant="text" onClick={() => {
                    setOpen(true);
                    setCart(order.cart)
                    setimageSelect(order.imagePaymentName)
                  }}>
                    <ShoppingBagIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Sube tu imagen del pago al banco">
                  <Button size="small" variant="text" onClick={() => {
                    //@ts-ignore
                    document.getElementById(`fileInput-${order._id}`).click()
                  }}><CloudUploadIcon /></Button>
                </Tooltip>
                {order.urlPayment && !order.payed &&
                  <Tooltip title="Realizar pago a banco">
                    <Button variant="text" size="small" className="my-2" onClick={() => {
                      setSnackBarMessage('Después de realizar el pago, sube la imagen de tu factura para poder confirmar que realizastes tu pago. Haz click en el boton a la par de ver exámenes');
                      setSnackbarType('success');
                      setOpenSnackBar(true);
                      setTimeout(() => {
                        window.open(order.urlPayment, "_blank", "height=500,width=500");
                      }, 5000);

                    }}>
                      <PaymentIcon />
                    </Button>
                  </Tooltip> */}
                {/* } */}
                <Button onClick={() => router.push(`/userOrders/detailOrder/${order._id}`)}>Ver orden</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}


      </Grid>
      <Pagination className="mt-4 px-4  sm:px-32" count={amount} page={page} color="primary" onChange={handleChange} />

      <MainAlert handleClose={() => { setOpenSnackBar(false); setSnackBarMessage(''); setSnackbarType('error') }} open={openSnackBar} message={snackBarMessage} type={snackbarType} duration={10000} />
      <Dialog open={open} onClose={() => { setOpen(false); setCart(null); setimageSelect('') }} >
        <div className="p-5 max-h-screen">
          <Typography textAlign="center" variant="h6">TUS PRODUCTOS</Typography>
          {Cart?.map((product: any) => (
            <>
              <p key={product._id}>{product.name} L.{product.price}</p>
              <Divider />
            </>
          ))}
          {
            imageSelect &&
            <Grid container justifyContent="center">
              <Image src={`${config.backend}/files/getFile/${imageSelect}`} alt="Imagen de pago" height={500} width={500} />
            </Grid>
          }
        </div>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOrders}
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
export default function WrappedOrderUser({ params }: params) {
  return (
    <MainLayout>
      <OrderUser userOrder={params.id} />
    </MainLayout>
  )
}