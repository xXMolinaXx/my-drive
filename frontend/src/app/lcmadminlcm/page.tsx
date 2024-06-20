'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Card, CardActions, CardContent, Dialog, Divider, Drawer, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Pagination, Paper, Radio, RadioGroup, Switch, TextField, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { config } from "@/common/configs/config";
import { IOrder } from "@/common/interface/orders/orders.interface";
import MainAlert from "@/components/alerts/MainAlert";
import { getCookieToken } from "@/common/utils/getCookieToken";
import { createTimeAmPm } from "@/common/utils/time/formatTime";




export default function AdminLogin() {
  const router = useRouter()
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [user, setUser] = useState({ "access_token": null, "role": null, "_id": null, "fullName": null, store: 'store' })
  const [searchWord, setSearchWord] = useState('')
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
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('error')
  const [selectValue, setselectValue] = useState('');
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [selectedCart, setSelectedCart] = useState<any>([]);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  const getOrder = () => {
    setLoadingOrders(true);
    setorders([])
    fetch(`${config.backend}/orders/readBranchOrder`, {
      method: 'POST',
      body: JSON.stringify({
        "startAt": startAt?.subtract(1, 'day').toString(),
        "endAt": endAt?.add(1, 'day').toString(),
        "branchName": user.store,
        "serachWord": searchWord,
        "status": selectValue,
        "advanceSearch": advanceSearch,
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
  const handleUpdateOrder = (id: string, status: string, isPayed: boolean, urlPayment: string) => {
    fetch(`${config.backend}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, isPayed, urlPayment }),
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
    console.log('1');
    const userLocalStorage = localStorage.getItem('user')
    if (userLocalStorage) {
      setUser(JSON.parse(userLocalStorage))
      if (JSON.parse(userLocalStorage).role !== 'admin') router.push('/catalog')
    }
    else router.push('/')
  }, [])
  useEffect(() => {
    if (user.store !== 'store') getOrder()
  }, [startAt, endAt, selectValue, user, advanceSearch])
  return (
    <div>
      <Drawer
        className="w-30 bg-red-800s"
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem>
            <Typography variant="h5">{user.fullName}</Typography>
          </ListItem>
          <ListItem disablePadding onClick={() => {
            localStorage.removeItem('user')
            setUser({ "access_token": null, "role": null, "_id": null, "fullName": null, store: '' })
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            router.push('/')
          }}>
            <ListItemButton >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sección" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <div className="pl-60 pt-5 pr-5 pb-5 ">
        <Paper elevation={3} className="min-h-screen p-5">

          <div className="mb-5 mt-3">
            <FormGroup>
              <FormControlLabel control={<Switch />} label="Búsqueda avanzada" onChange={() => { setAdvanceSearch(!advanceSearch) }} />
            </FormGroup>

            {
              advanceSearch && (
                <>
                  <TextField className="w-72" helperText="Buscar por nombre o identidad" variant="outlined" onChange={(e) => {
                    setSearchWord(e.target.value)
                  }} onKeyDown={e => {
                    if (e.key === 'Enter') {
                      getOrder()
                    }
                  }} InputProps={{
                    endAdornment: <Button className="mx-1" variant="contained" onClick={() => {
                      getOrder()
                    }}>Buscar</Button>,

                  }} />
                  <TextField select className="mx-1 w-1/6" label="Estado de orden" variant="outlined" onChange={(e) => {
                    setselectValue(e.target.value)
                  }}
                  >
                    {['en espera', 'pagada', 'terminada', 'cancelada'].map((option, i) => (
                      <MenuItem key={`key-status-${option}-${i}`} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <br />
                  <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker label="Fecha de inicio" className="mx-1" referenceDate={dayjs()}
                        value={startAt}
                        onChange={(newValue) => setstartAt(newValue)}
                      />
                      <DatePicker label="Fecha de Final" className="mx-1" referenceDate={dayjs().add(1, 'day')} value={endAt}
                        onChange={(newValue) => setendAt(newValue)} />
                    </LocalizationProvider>
                  </>

                </>
              )
            }

          </div>

          <Grid container spacing={2} >

            {loadingOrders && <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>} {orders.length === 0 ? <Typography className="mt-5 ml-5" variant="h5" textAlign='center'>No se encontro ninguna orden</Typography> : orders?.map(order => (
              <Grid item sm={12} md={6} lg={4} key={order._id}>
                <Card >
                  <CardContent>
                    <Typography variant="h5" noWrap>
                      {order.reservationDate.date?.toString()?.padStart(2, '0')}/{order.reservationDate.month?.toString()?.padStart(2, '0')}/{order.reservationDate.year} {createTimeAmPm(order.reservationDate.hour, order.reservationDate.minute)}
                    </Typography>
                    <Typography>
                      Cliente: <b>{order.user[0].fullName}</b>
                    </Typography>
                    <Typography>
                      DNI: <b> {order.user[0].DNI}</b>
                    </Typography>
                    <Typography noWrap={true} gutterBottom>
                      {order.user[0].telphone} {order.user[0].email}
                    </Typography>
                    <Typography variant="body1" mt={1} gutterBottom>
                      Total a pagar:<b> L. {order.finalPayment}</b>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Sucursal {order.branch}
                    </Typography>
                    <TextField select className="" defaultValue={order.status} fullWidth label="Estado de orden" variant="outlined" onChange={(e) => {
                      handleUpdateOrder(order._id, e.target.value, order.isPayed, order.urlPayment)
                    }}
                    >
                      {['en espera', 'terminada', 'cancelada'].map((option, i) => (
                        <MenuItem key={`key-status-${option}-${i}`} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FormControl>
                      <FormLabel >Esta Pagado</FormLabel>
                      <RadioGroup
                        row
                        defaultValue={order.isPayed}
                        name="radio-buttons-group"
                        className="flex"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          handleUpdateOrder(order._id, order.status, Boolean((event.target as HTMLInputElement).value), order.urlPayment)
                        }}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="Si" />
                        <FormControlLabel value={false} control={<Radio />} label="No" />

                      </RadioGroup>
                    </FormControl>
                    <TextField
                      defaultValue={order.urlPayment}
                      id={`search-product-${order._id}`}
                      label="url pago"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        endAdornment: <Button className="sm:w-full md:w-1/3 lg:w-1/3 ml-2 rounded-r-lg" variant="contained" onClick={() => {
                          const input = document.querySelector(`#search-product-${order._id}`);
                          //@ts-ignore
                          if (input.value) {
                            //@ts-ignore
                            handleUpdateOrder(order._id, order.status, order.isPayed, input?.value)
                          } else {
                            alert('2')
                            handleUpdateOrder(order._id, order.status, order.isPayed, '')
                          }

                        }}><SaveIcon /></Button>
                      }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" onClick={() => {
                      setSelectedCart(order.cart)
                      setOpenProductDetail(true)
                    }}>Ver examenes</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}


          </Grid>
          <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />
        </Paper>

      </div>
      <MainAlert handleClose={() => { setOpenSnackBar(false); setSnackBarMessage(''); setSnackbarType('error') }} open={openSnackBar} message={snackBarMessage} type={snackbarType} />
      <Dialog open={openProductDetail} onClose={() => { setOpenProductDetail(false) }} >
        <div className="p-5 max-h-52">
          <Typography textAlign="center" variant="h6">PRODUCTOS</Typography>
          {selectedCart?.map((product: any) => (
            <>
              <p key={product._id}>{product.name}{'--->'} <b>L.{product.price}</b></p>
              <Divider />
            </>
          ))}

        </div>
      </Dialog>
    </div>
  )
}