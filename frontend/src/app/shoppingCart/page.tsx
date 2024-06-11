'use client'
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProductState } from "@/common/interface/product.interface";
import { getCart, setLocalStorageProduct } from "@/common/utils/cart";
const steps = ['Carrito', 'Confirmación'];
export default function ShoppingCart() {
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


  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep < 1) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else router.push('/')
  };
  const addMoreProduct = (index:number) => {
    const newCart = [...shoppingCart.products]
    newCart[index].amount += 1
    setShoppingCart({
      ...shoppingCart,
      products: newCart
    })
  }
  const restMoreProduct = (index:number) => {
    const newCart = [...shoppingCart.products]
    if (newCart[index].amount > 1) newCart[index].amount -= 1
    setShoppingCart({
      ...shoppingCart,
      products: newCart
    })

  }
  const deleteProduct = (index:number)=>{
    const newCart = [...shoppingCart.products]
    const amount = newCart[index]?.amount || 1
    newCart.splice(index, 1)
    setShoppingCart({
      amountProducts: shoppingCart.amountProducts - amount ,
      products: [...newCart],
    });
    setLocalStorageProduct(newCart)
  }

  useEffect(() => {
    const cart = getCart();
    let productAmount = 0
    cart.forEach(data => {
      const dataAmount = data.amount || 0
      productAmount = dataAmount + productAmount
    })
    setShoppingCart({ amountProducts: productAmount, products: cart })
  }, [])
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
    children: <div className="p-10"><Grid container spacing={2}>
      <Grid item xs={6}>
        {shoppingCart.products.length !== 0 ? shoppingCart.products.map((product, i) => (
          <MyCard 
            key={`${product.name}-cart-${i}`} 
            price={product.price} 
            productName={product.name} 
            productAmount={product.amount || 1} 
            addMoreProduct={()=> {addMoreProduct(i)}} 
            restMoreProduct={()=>{restMoreProduct(i)}} 
            deleteProduct={()=>{deleteProduct(i)}} 
          />
      )) : <Typography align="center">No hay ningun producto agregado</Typography>}
      </Grid>
      <Grid item xs={1}>

      </Grid>
      <Grid item xs={5}>
        <div className="border-2 rounded h-48 p-2 border-transparent shadow-md">
          <Typography variant="h4" align="center" className="text-blue-500 bolder font-black" >Resumen de orden</Typography>
          <Divider />
          <TableContainer >
            <Table aria-label="simple table">

              <TableBody>

                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    TOTAL DE ARTÍCULOS
                  </TableCell>
                  <TableCell align="right">{shoppingCart.amountProducts}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" className="font-black" scope="row">
                    TOTAL
                  </TableCell>
                  <TableCell align="right" className="font-black">L. {totalPayment} </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </Grid></div>
  },
  {
    key: 'primer-hijo',
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
    <MainLayout>
      <Box sx={{ width: '100%' }} className="px-[10%] py-10">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {step[activeStep].children}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext} disabled={shoppingCart.products.length === 0}>
            {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </MainLayout >
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
