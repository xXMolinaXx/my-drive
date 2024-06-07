'use client'
import { useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { Card, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CelebrationIcon from '@mui/icons-material/Celebration';
const steps = ['Carrito', 'Confirmación'];
export default function ShoppingCart() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());


  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep < 1) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    else router.push('/')
  };





  const step = [{
    key: 'primer-hijo',
    children: <div className="p-10"><Grid container spacing={2}>
      <Grid item xs={6}>
        <MyCard price={12} productName="examen sangre" />
        <MyCard price={12} productName="examen sangre" />
        <MyCard price={12} productName="examen sangre" />
        <MyCard price={12} productName="examen sangre" />
        <MyCard price={12} productName="examen sangre" />
        <MyCard price={12} productName="examen sangre" />
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
                  <TableCell align="right">1</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" className="font-black" scope="row">
                    TOTAL
                  </TableCell>
                  <TableCell align="right" className="font-black">L. 12 </TableCell>
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
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </MainLayout >
  )
}
interface propCard {
  productName: string, price: number
}
function MyCard({ productName, price }: propCard) {
  return (<div className="flex rounded-lg p-2 shadow-md">
    <div className="w-3/4">
      <Typography variant="body2">{productName}</Typography>
      <Typography variant="body2" >L. {price}</Typography>
    </div>
    <div className="flex">
      <div className="flex">
        <AddIcon className="text-blue-600" />
        <Typography variant="subtitle1">1</Typography>
        <RemoveIcon className="text-blue-600" />
      </div>
      <DeleteIcon className="text-red-600 m-1" />
    </div>
  </div>)
}