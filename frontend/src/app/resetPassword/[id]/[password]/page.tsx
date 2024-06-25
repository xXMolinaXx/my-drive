

'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { ChangeEventHandler, useEffect, useState } from "react";
import { config } from '@/common/configs/config';
import MainAlert from '@/components/alerts/MainAlert';
import { EMAIL_REGEX } from '@/common/regex/email.regex';
import { getCookieToken } from '@/common/utils/getCookieToken';
interface params {
  params: { id: string, password: string };
}
export default function UpdatePassword({ params }: params) {
  const router = useRouter()
  const [openMainALert, setOpenMainAlert] = useState(false)
  const [mainAlertMessage, setMainAlertMessage] = useState('')
  const [registrerForm, setRegistrerForm] = useState({
    fullName: '',
    email: '',
    telphone: '',
    DNI: '',
    bornAt: new Date(),
    gender: 'hombre',
    password: '',
    confirmPassword: ''
  })
  const [auxiliarTextRegistrerForm, setAuxiliarTextRegistrerForm] = useState({
    fullName: '',
    email: '',
    telphone: '',
    DNI: '',
    bornAt: new Date(),
    gender: '',
    password: '',
    confirmPassword: ''
  })
  const [mainAlertType, setMainAlertType] = useState<'error' | 'success'>('success')
  const registerUser = () => {

    let DontsendForm = false
    const status = {
      fullName: '',
      email: '',
      telphone: '',
      DNI: '',
      bornAt: new Date(),
      gender: '',
      password: '',
      confirmPassword: ''
    }
    if (!registrerForm.password) {
      status.password = 'Ingrese una contraseña';
      DontsendForm = true
    }
    if (registrerForm.password !== registrerForm.confirmPassword) {
      status.confirmPassword = 'la contraseña no coincide';
      status.password = 'la contraseña no coinciden'
      DontsendForm = true
    }
    if (DontsendForm) {
      setAuxiliarTextRegistrerForm(status)
      return;
    }
    fetch(`${config.backend}/users/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify({ password: registrerForm.password, hashPassword: params.password.replaceAll('_', '/').replaceAll('%','$') }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        setMainAlertMessage(data.message);
        setOpenMainAlert(true);
        setTimeout(() => {
          router.push('/catalog')
        }, 5000);

      } else {
        setMainAlertMessage(data.error);
        setOpenMainAlert(true);
      }

    }).catch(e => {
      setMainAlertMessage(e.toString());
      setOpenMainAlert(true);
    })
  }
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrerForm({ ...registrerForm, [event.target.id]: event.target.value })
  }
  return (<main>
    <section className="min-h-screen">
      <Grid className='p-5 ' height={"100%"} container justifyContent={'center'} alignItems={'center'} >
        <Grid item xs={12} md={6} lg={6} className='w-94'>
          <Paper elevation={3} className="p-5 w-94" >
            <Grid container justifyContent={'center'} alignItems={'center'}  >
              <Image src={'/LCM-logo.png'} width={100} height={100} alt='logo lcm' />
            </Grid>
            <Grid height={"100%"} container spacing={2} justifyContent={'center'} alignItems={'center'} >


              <Grid container item xs={12} justifyContent={'center'} alignItems={'center'}>

                <Grid xs={12}>
                  <TextField
                    type="password"
                    className='my-2'
                    label="contraseña"
                    variant="outlined"
                    fullWidth
                    id='password'
                    error={auxiliarTextRegistrerForm.password ? true : false}
                    helperText={auxiliarTextRegistrerForm.password}
                    value={registrerForm.password}
                    onChange={onChangeInput}
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    type="password"
                    className='my-2'
                    label="confirmar contraseña"
                    variant="outlined"
                    fullWidth
                    id='confirmPassword'
                    value={registrerForm.confirmPassword}
                    error={auxiliarTextRegistrerForm.confirmPassword ? true : false}
                    helperText={auxiliarTextRegistrerForm.confirmPassword}
                    onChange={onChangeInput}
                  />
                </Grid>

                <Grid xs={12} md={3} lg={3}>
                  <Button variant="contained" className='my-2' onClick={registerUser}>Actualizar</Button>
                </Grid>
              </Grid>


            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <MainAlert handleClose={() => { setOpenMainAlert(false); setMainAlertMessage(''); setMainAlertType('error') }} message={mainAlertMessage} open={openMainALert} type={mainAlertType} />
    </section>
  </main>)
}
