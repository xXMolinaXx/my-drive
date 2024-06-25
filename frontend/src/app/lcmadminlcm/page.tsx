'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SaveIcon from '@mui/icons-material/Save';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
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
import { orderStatus, orderStatusAdmin, orderStatusFlebotomista } from "@/common/const/orders/statusOrders.const";
import Image from "next/image";


function primeraLetraMayus(palabra: string) {
  const primeraLetra = palabra.charAt(0);
  const resto = palabra.slice(1);
  return primeraLetra.toUpperCase() + resto;
}

export default function AdminLogin() {
  const router = useRouter()
  const [view, setView] = useState<'todayView' | 'finishedView' | 'historicView' | 'waitingView'>('todayView');
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
    urlPayment: '',
    imagePaymentName: '',
  }])
  const [imageSelect, setimageSelect] = useState('')
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
    let searchParams: any = {
      "startAt": startAt?.subtract(1, 'day').toString(),
      "endAt": endAt?.add(1, 'day').toString(),
      "branchName": user.store,
      "serachWord": searchWord,
      "status": selectValue,
      "advanceSearch": view === 'historicView' ? true : false,
      limit,
      skip,
      typeOfSearch: 0
    }
    if (view === 'todayView') {
      searchParams = {
        "startAt": dayjs().hour(0).minute(0).toString(),
        "endAt": dayjs().hour(23).minute(55).toString(),
        "branchName": user.store,
        "advanceSearch": false,
        limit,
        skip,
        typeOfSearch: 1
      }
    } else if (view === 'waitingView') {
      searchParams = {
        "startAt": dayjs().hour(0).minute(0).toString(),
        "endAt": dayjs().hour(23).minute(55).toString(),
        "branchName": user.store,
        "advanceSearch": false,
        limit,
        skip,
        typeOfSearch: 3
      }
    } else if (view === 'finishedView') {
      searchParams = {
        "startAt": dayjs().hour(0).minute(0).toString(),
        "endAt": dayjs().hour(23).minute(55).toString(),
        "branchName": user.store,
        "advanceSearch": false,
        limit,
        skip,
        typeOfSearch: 2
      }
    }

    fetch(`${config.backend}/orders/readBranchOrder`, {
      method: 'POST',
      body: JSON.stringify(searchParams),
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
  const handleUpdateOrder = (id: string, Pdata: any, type: number) => {
    let data: any
    if (type === 1) {
      data = {
        status: Pdata
      }
    }
    else if (type === 2) {
      data = {
        isPayed: Pdata
      }
    }
    else if (type === 3) {
      data = {
        urlPayment: Pdata
      }
    }
    fetch(`${config.backend}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, type }),
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
        getOrder();
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
    const userLocalStorage = localStorage.getItem('user')
    if (userLocalStorage) {
      setUser(JSON.parse(userLocalStorage))
      if (!['admin', 'flebotomista'].includes(JSON.parse(userLocalStorage).role)) router.push('/catalog')
    }
    else router.push('/')
  }, [])
  useEffect(() => {
    if (user.store !== 'store') getOrder()
  }, [startAt, endAt, selectValue, user, view])
  return (
    <div className="min-h-screen">
      <Grid container spacing={3}>
        <Grid xs={3} item>
          <Paper elevation={3} className="min-h-screen h-full ">
            <List>
              <ListItem>
                <Typography variant="h5">{user.fullName}</Typography>
              </ListItem>
              <ListItem disablePadding onClick={() => {
                setView('todayView')
              }}>
                <ListItemButton >
                  <ListItemIcon>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tomas rápidas pendiente del dia" />
                </ListItemButton>
              </ListItem>
              {user.role === 'admin' &&
                <>
                  <ListItem disablePadding onClick={() => {
                    setView('waitingView')
                  }}>
                    <ListItemButton >
                      <ListItemIcon>
                        <TodayIcon />
                      </ListItemIcon>
                      <ListItemText primary="Tomas rápidas en espera" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={() => {
                    setView('finishedView')
                  }}>
                    <ListItemButton >
                      <ListItemIcon>
                        <TodayIcon />
                      </ListItemIcon>
                      <ListItemText primary="Tomas rápidas finalizadas" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={() => {
                    setView('historicView')
                  }}>
                    <ListItemButton >
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      <ListItemText primary="Historial Tomas rápidas" />
                    </ListItemButton>
                  </ListItem>
                </>
              }

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
          </Paper>

        </Grid>
        <Grid xs={9} item>
          <div className="pt-5 pr-5 pb-5 ">
            <div className="mb-5 mt-3">
              {/* <FormGroup>
                <FormControlLabel control={<Switch />} label="Búsqueda avanzada" onChange={() => { setAdvanceSearch(!advanceSearch) }} />
              </FormGroup> */}

              {
                view === 'historicView' && (
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
                      <MenuItem value="todo">
                        Todo
                      </MenuItem>
                      {orderStatus.map((option, i) => (
                        <MenuItem key={`key-status-${option.value}-${i}`} value={option.value}>
                          {option.value}
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
                      # orden: {order._id.substring(order._id.length - 6, order._id.length)}
                      <Typography variant="h5" noWrap>
                        {(order.reservationDate.month + 1)?.toString()?.padStart(2, '0')}/{order.reservationDate.date?.toString()?.padStart(2, '0')}/{order.reservationDate.year} {createTimeAmPm(order.reservationDate.hour, order.reservationDate.minute)}
                      </Typography>
                      <Typography>
                        Cliente: <b>{order.user[0].fullName}</b>
                      </Typography>
                      <Typography>
                        DNI: <b> {order.user[0].DNI}</b>
                      </Typography>
                      <Typography noWrap={true} gutterBottom>
                        Teléfono: {order.user[0].telphone}
                      </Typography>
                      <Typography noWrap={true} gutterBottom>
                        Email:  {order.user[0].email}
                      </Typography>
                      <Typography variant="body1" mt={1} gutterBottom>
                        Total a pagar:<b> L. {order.finalPayment}</b>
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Sucursal {order.branch}
                      </Typography>
                      <Divider textAlign="left" className="mb-5" variant="middle" />
                      <TextField disabled={view === 'historicView' ? true : false} select className="" defaultValue={order.status} fullWidth label="Estado de orden" variant="outlined" onChange={(e) => {
                        handleUpdateOrder(order._id, e.target.value, 1)
                      }}
                      >
                        {
                          user.role === 'flebotomista' && order.status !== 'toma de muestra' &&
                          <MenuItem key={`key-status-${order.status}`} value={order.status}>
                            {primeraLetraMayus(order.status)}
                          </MenuItem>
                        }


                        {
                          user.role === 'flebotomista' ? orderStatusFlebotomista.map((option, i) => (
                            <MenuItem key={`key-status-${option.label}-${i}`} value={option.value}>
                              {option.label}
                            </MenuItem>
                          )) : orderStatusAdmin.map((option, i) => (
                            <MenuItem key={`key-status-${option.label}-${i}`} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))
                        }
                        { }
                      </TextField>
                      <FormControl disabled={view === 'historicView' ? true : false}>
                        <FormLabel >Esta Pagado</FormLabel>
                        <RadioGroup
                          row
                          defaultValue={order.isPayed}
                          name="radio-buttons-group"
                          className="flex"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleUpdateOrder(order._id, Boolean((event.target as HTMLInputElement).value), 2)
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
                        disabled={order.urlPayment ? true : false}
                        fullWidth
                        InputProps={{
                          endAdornment: <Button disabled={order.urlPayment ? true : false} className="sm:w-full md:w-1/3 lg:w-1/3 ml-2 rounded-r-lg" variant="contained" onClick={() => {
                            const input = document.querySelector(`#search-product-${order._id}`);
                            //@ts-ignore
                            if (input.value) {
                              //@ts-ignore
                              handleUpdateOrder(order._id, input?.value, 3)
                            }

                          }}><SaveIcon /></Button>
                        }}
                      />
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" onClick={() => {
                        setSelectedCart(order.cart)
                        setimageSelect(order.imagePaymentName)
                        setOpenProductDetail(true)
                      }}>Ver examenes</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}


            </Grid>
            <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />


          </div>
        </Grid>
      </Grid>

      <MainAlert handleClose={() => { setOpenSnackBar(false); setSnackBarMessage(''); setSnackbarType('error') }} open={openSnackBar} message={snackBarMessage} type={snackbarType} />
      <Dialog open={openProductDetail} onClose={() => { setOpenProductDetail(false), setSelectedCart([]); setimageSelect('') }} >
        <div className="p-5 max-h-full">
          <Typography textAlign="center" variant="h6">PRODUCTOS</Typography>
          {selectedCart?.map((product: any) => (
            <>
              <p key={product._id}>{product.name}{'--->'} <b>L.{product.price}</b></p>
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
    </div>
  )
}