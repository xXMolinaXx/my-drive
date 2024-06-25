
'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Box, Button, Card, CardActions, CardContent, Chip, Dialog, Divider, Drawer, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { config } from "@/common/configs/config";
import { IOrder } from "@/common/interface/orders/orders.interface";
import MainAlert from "@/components/alerts/MainAlert";
import { getCookieToken } from "@/common/utils/getCookieToken";
import MainLayout from "@/components/layout/MainLayout";
interface params {
  params: { id: string };
}
interface props2 {
  userOrder: string
}
function OrderUser({ userOrder }: props2) {
  const router = useRouter()
  const [loadingOrders, setLoadingOrders] = useState(false);
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
    isPayed: false,
    urlPayment: ''
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
  const handleUpdateOrder = (id: string, status: string, isPayed: boolean) => {
    fetch(`${config.backend}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, isPayed }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        setOpenSnackBar(true);
        setSnackBarMessage('orden actualizada');
        setSnackbarType('success');
        // getOrder();
      } else {
        setOpenSnackBar(true);
        setSnackBarMessage(data.error);
      }
    }).catch(e => {
      setOpenSnackBar(true);
      setSnackBarMessage(e.toStroing());
    })
  }
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
      <Grid container spacing={2} width={'100%'} className="px-32" justifyContent="center">

        {orders.length === 0 ? <Typography className="mt-5 ml-5" variant="h5" textAlign='center'>No se encontro ninguna orden</Typography> : orders?.map(order => (
          <Grid item sm={12} md={6} lg={3} key={order._id}>
            <Card >
              <CardContent>
                # orden: {order._id.substring(order._id.length - 6, order._id.length)}
                <Typography variant="h4" className="text-blue-700" color="text.secondary" gutterBottom>
                  {order.status}
                </Typography>
                <Typography className="font-bold">
                  Fecha: {`${dayjs(order.createdAt).format("YYYY MMMM DD")} ${order.reservationDate.hour > 9 ? order.reservationDate.hour : `0${order.reservationDate.hour}`}:${order.reservationDate.minute > 9 ? order.reservationDate.minute : `0${order.reservationDate.minute}`} `}
                </Typography>
                <Typography color="text.secondary">
                  Total a pagar: L. {order.finalPayment}
                </Typography>
                <Typography variant="body2">
                  Sucursal {order.branch}
                </Typography>

                <Typography className="font-bold">
                  {`Pago realizado:        ${order.isPayed ? 'SI' : 'NO'} `}
                </Typography>
                {!order.urlPayment ? <Chip label="Aun sin método de pago" color="error" className="my-2" /> : <Button variant="contained" size="small" className="my-2" onClick={() => {
                  window.location.replace(order.urlPayment);
                }}>Realizar Pago</Button>}

              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" onClick={() => {
                  setOpen(true);
                  setCart(order.cart)
                }}>Ver exámenes</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}


      </Grid>
      <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />

      <MainAlert handleClose={() => { setOpenSnackBar(false); setSnackBarMessage(''); setSnackbarType('error') }} open={openSnackBar} message={snackBarMessage} type={snackbarType} />
      <Dialog open={open} onClose={() => { setOpen(false) }} >
        <div className="p-5 max-h-52">
          <Typography textAlign="center" variant="h6">TUS PRODUCTOS</Typography>
          {Cart?.map((product: any) => (
            <>
              <p key={product._id}>{product.name} L.{product.price}</p>
              <Divider />
            </>
          ))}

        </div>
      </Dialog>
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