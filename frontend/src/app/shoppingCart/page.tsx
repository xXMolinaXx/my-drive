'use client'
import { useContext, useEffect, useState } from "react";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MainLayout, { StoreContext } from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { Alert, CircularProgress, Divider, Grid, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProductState } from "@/common/interface/product.interface";
import { getCart, setLocalStorageProduct } from "@/common/utils/cart";
import { config } from "@/common/configs/config";
import MainAlert from "@/components/alerts/MainAlert";
import { getCookieToken } from "@/common/utils/getCookieToken";
import { createTime } from "@/common/utils/time/formatTime";
import dayjs, { Dayjs } from "dayjs";
const steps = ['Carrito', 'Selecionar sucursal', 'Confirmación'];
function ShoppingCart2() {
  const { setShoppingCart: setShoppingCartContext, shoppingCart: shoppingCartContext } = useContext(StoreContext);
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [totalPayment, setTotalPayment] = useState(0)
  const [shoppingCart, setShoppingCart] = useState<IProductState>({
    products: [{
      name: '',
      price: 0,
      category: '',
      amount: 0,
    }],
    amountProducts: 0,
  })
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [type, settype] = useState<'success' | 'error'>('success')
  const [availableSchedules, setavailableSchedules] = useState<any[]>([])
  const [selectBranch, setSelectBranch] = useState('La granja');
  const [selectDate, setSelectDate] = useState<Dayjs | null>(dayjs());
  const [selectedSchedule, setSelectedSchedule] = useState<any>({
    hour: -1,
    minute: -1,
  })
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (shoppingCart.products.length === 0) {
      return;
    }
    if (activeStep === 1) {
      let errorMessage = ''
      if (!selectBranch) errorMessage += 'Selecione una sucursal \n'
      if (selectedSchedule.hour === -1) errorMessage += 'Selecione una horario \n'
      if (errorMessage) {
        setOpenSnackBar(true);
        setsnackBarMessage(errorMessage);
        return;
      }
      const existUser = localStorage.getItem('user')
      let user: any;
      if (existUser) user = JSON.parse(existUser)
      let finalPayment = 0
      shoppingCart.products.forEach(product => {
        const productAmount = product.amount || 1
        finalPayment += product.price * productAmount
      })
      fetch(`${config.backend}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": 'application/json',
          Authorization: `Bearer ${getCookieToken()}`,
        },
        body: JSON.stringify({
          cart: shoppingCart.products,
          userId: user ? user._id : '',
          branch: selectBranch,
          date: selectDate ? selectDate.toString() : dayjs().toString(),
          schedule: selectedSchedule
        })
      }).then(data => data.json()).then(data => {
        if (data.statusCode === 200) {
          setShoppingCartContext(
            {
              amountProducts: 0,
              products: []
            }
          );
          setLocalStorageProduct([])
        } else {
          setsnackBarMessage(data.message);
          settype('error');
          setOpenSnackBar(true)
        }

      }).catch(e => {
        setsnackBarMessage(e.toString());
        settype('error');
        setOpenSnackBar(true)
      })
    }
    if (activeStep < 2) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else router.push('/')
  };
  const addMoreProduct = (index: number) => {
    const newCart = [...shoppingCart.products]
    // @ts-ignore
    newCart[index].amount += 1
    
    setShoppingCart({
      ...shoppingCart,
      products: newCart,
      amountProducts: shoppingCartContext.amountProducts + 1,
    })
    setShoppingCartContext(
      {
        ...shoppingCart,
        amountProducts: shoppingCartContext.amountProducts + 1,
        products: newCart
      }
    )
  }
  const restMoreProduct = (index: number) => {
    const newCart = [...shoppingCart.products]
    // @ts-ignore
    if (newCart[index].amount > 1) {
      // @ts-ignore
      newCart[index].amount -= 1
      setShoppingCart({
        ...shoppingCart,
        products: newCart,
        amountProducts: shoppingCartContext.amountProducts - 1,
      })
      setShoppingCartContext(
        {
          ...shoppingCart,
          amountProducts: shoppingCartContext.amountProducts - 1,
          products: newCart
        }
      )
    }
  }
  const deleteProduct = (index: number) => {
    const newCart = [...shoppingCart.products]
    const amount = newCart[index]?.amount || 1
    newCart.splice(index, 1)
    setShoppingCart({
      amountProducts: shoppingCart.amountProducts - amount,
      products: [...newCart],
    });
    setLocalStorageProduct(newCart)
  }
  const getAvalableSchedules = () => {
    setavailableSchedules([]);
    if (shoppingCart.products.length > 0) {
      fetch(`${config.backend}/orders/readAvailableSchedules`, {
        method: 'POST',
        body: JSON.stringify({
          "date": selectDate ? selectDate.toString() : dayjs().toString(),
          "branch": selectBranch,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getCookieToken()}`,
        },
      })
        .then(data => data.json())
        .then(data => {
          if (data.statusCode === 200) {
            setavailableSchedules(data.data)
          }
        })
    }
  }
  useEffect(() => {
    getAvalableSchedules();
    const cart = getCart();
    let productAmount = 0
    cart.forEach(data => {
      const dataAmount = data.amount || 0
      productAmount = dataAmount + productAmount
    })
    setShoppingCart({ amountProducts: productAmount, products: cart })
  }, [])
  useEffect(() => {
    getAvalableSchedules()
  }, [selectBranch, selectDate])
  useEffect(() => {
    let finalPayment = 0
    shoppingCart.products.forEach(product => {
      const productAmount = product.amount || 1
      finalPayment += product.price * productAmount
    })
    setTotalPayment(finalPayment)
  }, [shoppingCart])

  const step = [{
    key: 'primer-hijo',
    children: <div className="p-0 sm:p-10"><Grid container spacing={2} justifyContent={"center"}>
      <Grid item md={4} lg={4} sm={12} xl={3}>
        {shoppingCart.products.length !== 0 ? shoppingCart.products.map((product, i) => (
          <MyCard
            key={`${product.name}-cart-${i}`}
            price={product.price}
            productName={product.name}
            productAmount={product.amount || 1}
            addMoreProduct={() => { addMoreProduct(i) }}
            restMoreProduct={() => { restMoreProduct(i) }}
            deleteProduct={() => { deleteProduct(i) }}
          />
        )) : <Paper elevation={3} className="p-5 mt-5 sm:mt-0 w-full flex justify-center">
          <Typography align="center">No hay ningun producto agregado</Typography>
          <RemoveShoppingCartIcon />
        </Paper>}
      </Grid>

      <Grid item md={4} lg={4} sm={12} xl={3}>
        <Paper elevation={4} className="w-full p-3">
          <Typography variant="h4" align="center" className="text-blue-500 bolder font-black" >Resumen de orden</Typography>
          <Divider />
          <TableContainer >
            <Table >
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    TOTAL DE ARTÍCULOS
                  </TableCell>
                  <TableCell align="right">{shoppingCart.amountProducts}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    DESCUENTO(3RA Y 4TA EDAD)
                  </TableCell>
                  <TableCell align="right">{shoppingCart.amountProducts}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" className="font-black" scope="row">
                    TOTAL
                  </TableCell>
                  <TableCell align="right" className="font-black">L. {totalPayment} </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid></div>
  },
  {
    key: 'segundo-hijo',
    children: <Grid container spacing={2} justifyContent={"center"} className="p-10">
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            minDate={dayjs()}
            maxDate={dayjs().add(3, 'month')}
            referenceDate={dayjs()}
            className='my-2 w-3/6'
            value={selectDate}
            onChange={(newValue) => setSelectDate(newValue)}
          />
        </LocalizationProvider>
        <TextField
          id="select-branch"
          className='m-2 w-36 '
          select
          label="Selecione sucursal"
          defaultValue="La granja"
          onChange={e => setSelectBranch(e.target.value)}
        >
          {['Tepeyac', 'La granja', 'aeroplaza'].map((option, i) => (
            <MenuItem key={`key-select-${option}-${i}`} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TableContainer className="h-40" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Horarios Disponibles</TableCell>
                <TableCell align="right">Selecionar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableSchedules.length > 0 ? availableSchedules.map((row, i) => (
                <TableRow
                  key={`table-${row.hour}${row.minute}-${i}`}
                >
                  <TableCell component="th" scope="row">
                    {createTime(row.hour, row.minute)}
                  </TableCell>
                  <TableCell className={`${selectedSchedule.hour === row.hour && selectedSchedule.minute === row.minute && 'bg-green-700 text-white'} cursor-default`} align="right" onClick={() => setSelectedSchedule(row)}>
                    {selectedSchedule.hour === row.hour && selectedSchedule.minute === row.minute ? 'Selecionado' : 'Selecionar'}

                  </TableCell>
                </TableRow>
              )) : <TableRow className="flex align-middle justify-center pt-5">
                <TableCell component="th" scope="row">
                  Buscando horarios disponibles <CircularProgress />
                </TableCell>
              </TableRow>}
            </TableBody>

          </Table>
        </TableContainer>
      </Grid>

    </Grid>

  },
  {
    key: 'tercer-hijo',
    children: <Grid container spacing={2} justifyContent={"center"} className="p-10">
      <Grid item>
        <Typography align="center">Tu orden ha sido procesada con exito</Typography>
        <Typography align="center">Como ultimo paso ingresa al siguiente link y haz el pago</Typography>
        <div className="flex justify-center p-5">
          <Button variant="contained" onClick={() => { location.assign("http://www.mozilla.org"); }}>Pagar</Button>
        </div>

      </Grid>

    </Grid>

  }]

  return (
    <Box sx={{ width: '100%' }} className="px-[10%] py-10">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps} >
              <StepLabel {...labelProps} >{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {step[activeStep].children}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button onClick={() => setActiveStep(activeStep - 1)} disabled={[0, 2].includes(activeStep)}>
          Regresar
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext} disabled={shoppingCart.products.length === 0}>
          {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
        </Button>
      </Box>
      <MainAlert handleClose={handleClose} open={openSnackBar} message={snackBarMessage} type={type} />
    </Box>
  )
}
interface propCard {
  productName: string, price: number, productAmount: number, addMoreProduct: () => void, restMoreProduct: () => void, deleteProduct: () => void
}
function MyCard({ productName, price, productAmount, addMoreProduct, restMoreProduct, deleteProduct }: propCard) {
  return (<div className="flex rounded-lg p-2 mt-5 shadow-md">
    <div className="w-3/4">
      <Typography variant="body2">{productName}</Typography>
      <Typography variant="body2" > L. {price}</Typography>
    </div>
    <div className="flex">
      <div className="flex">
        <AddIcon className="text-blue-600 mx-4" onClick={addMoreProduct} />
        <Typography variant="subtitle1">{productAmount}</Typography>
        <RemoveIcon className="text-blue-600 mx-4" onClick={restMoreProduct} />
      </div>
      <DeleteIcon className="text-red-600 m-1 mx-4" onClick={deleteProduct} />
    </div>
  </div>)
}

export default function ShoppingCart() {
  return (
    <MainLayout>
      <ShoppingCart2 />
    </MainLayout>
  )
}
