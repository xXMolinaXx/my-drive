'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, CircularProgress, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { ChangeEventHandler, useEffect, useState } from "react";
import { config } from '@/common/configs/config';
import MainAlert from '@/components/alerts/MainAlert';
import { EMAIL_REGEX } from '@/common/regex/email.regex';
import { getCookieToken } from '@/common/utils/getCookieToken';

export default function LoginRegister() {
  const router = useRouter()
  const [validationUser, setvalidationUser] = useState(false);
  const [openMainALert, setOpenMainAlert] = useState(false)
  const [mainAlertMessage, setMainAlertMessage] = useState('')
  const [form, setForm] = useState<'registro' | 'ingreso' | 'newPassword'>('ingreso')
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
  const [waiting, setWaiting] = useState(false)
  const logIn = () => {
    setWaiting(true)
    var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
    var followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
    followingDay.toLocaleDateString();
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
    if (!registrerForm.email) {
      status.email = 'Ingrese su correo'
      DontsendForm = true
    }
    if (!registrerForm.password) {
      status.password = 'Ingrese una contraseña';
      DontsendForm = true
    }

    if (DontsendForm) {
      setAuxiliarTextRegistrerForm(status)
      return;
    }
    fetch(`${config.backend}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: registrerForm.email,
        password: registrerForm.password
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      setWaiting(false)
      if (data.statusCode === 200) {
        document.cookie = `access_token=${data.data.access_token}; expires=${followingDay}`;
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.data, access_token: null })
        );
        router.push('/catalog?searchWord=ninguno')
      }
      else {
        setMainAlertMessage(data.message);
        setOpenMainAlert(true);
      }
    }).catch(e => {
      setWaiting(false)
      setMainAlertMessage(e.toString());
      setOpenMainAlert(true);
    })
  }
  const registerUser = () => {
    setWaiting(true)
    var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
    var followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
    followingDay.toLocaleDateString();
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
    const isValidEmail = EMAIL_REGEX.test(registrerForm.email);
    if (!registrerForm.fullName) {
      status.fullName = 'Ingrese su nombre'
      DontsendForm = true
    }
    if (!registrerForm.email) {
      status.email = 'Ingrese su correo'
      DontsendForm = true
    }
    if (!isValidEmail) {
      status.email = 'No es un correo valido'
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
      setWaiting(false)
      setAuxiliarTextRegistrerForm(status)
      alert('Error al registrase')
      return;
    }
    fetch(`${config.backend}/users`, {
      method: 'POST',
      body: JSON.stringify(registrerForm),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      setWaiting(false)
      if (data.statusCode === 200) {
        fetch(`${config.backend}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
            username: registrerForm.email,
            password: registrerForm.password
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getCookieToken()}`,
          },
        }).then(data => data.json()).then(data => {
          if (data.statusCode === 200) {
            document.cookie = `access_token=${data.data.access_token}; expires=${followingDay}`;
            localStorage.setItem(
              "user",
              JSON.stringify({ ...data.data, access_token: null })
            );
            router.push('/catalog?searchWord=ninguno')
          }
          else alert(data.message)
        }).catch(e => alert('error en el sistema'))
      } else {
        setMainAlertMessage(data.error);
        setOpenMainAlert(true);
      }

    }).catch(e => {
      setWaiting(false)
      setMainAlertMessage(e.toString());
      setOpenMainAlert(true);
    })
  }
  const sendMail = () => {
    fetch(`${config.backend}/users/sendNotRemeberPassword`, {
      method: 'POST',
      body: JSON.stringify({
        email: registrerForm.email,
        subject: "Cambio de contraseña",
        body: ""
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        setMainAlertMessage(data.message);
        setOpenMainAlert(true);
        setMainAlertType('success')
      } else {
        setMainAlertMessage(data.error);
        setOpenMainAlert(true)
      }
    })
  }
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrerForm({ ...registrerForm, [event.target.id]: event.target.value })
  }
  useEffect(() => {
    const token = getCookieToken();
    const user = localStorage.getItem('user')
    if (token) {
      if (user) {
        router.push('/catalog?searchWord=ninguno');
      }
    }

    setvalidationUser(true);
  }, [])
  if (!validationUser) return;
  return (<main>
    <section className="h-screen">
      {/* <div className="oval" />
      <div className="oval2" /> */}
      <Grid className="h-screen" container>
        <Grid item xs={12} md={3} className='px-5 py-10'>
          {/*<Grid container justifyContent={'center'} alignItems={'center'}  >
            <Image src={'/LCM-logo.png'} width={100} height={100} alt='logo lcm' />
          </Grid>**/}
          <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} >
            {
              form === 'ingreso' && (
                <Grid container item xs={12} justifyContent={'center'} alignItems={'center'}>
                  <Grid xs={12}>
                    <Typography variant="h3" textAlign={'center'}>
                      Ingresar
                    </Typography>
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      className='my-2'
                      label="Correo"
                      variant="outlined"
                      fullWidth
                      type='email'
                      id='email'
                      value={registrerForm.email}
                      onChange={onChangeInput}
                      error={auxiliarTextRegistrerForm.email ? true : false}
                      helperText={auxiliarTextRegistrerForm.email}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      className='my-2'
                      label="contraseña"
                      variant="outlined"
                      type='password'
                      fullWidth
                      id='password'
                      error={auxiliarTextRegistrerForm.password ? true : false}
                      helperText={auxiliarTextRegistrerForm.password}
                      value={registrerForm.password}
                      onChange={onChangeInput}

                    />

                  </Grid>
                  <Grid xs={12} justifyContent={'center'} container>
                    <Button variant="text" className='my-2' onClick={() => setForm('newPassword')}>¿Olvidastes tu contraseña?</Button>
                  </Grid>
                  <Grid xs={12}>
                    <Button variant="contained" className='my-2' fullWidth onClick={logIn} disabled={waiting} endIcon={waiting && <CircularProgress />}>Ingresar</Button>
                  </Grid>
                  <Grid xs={12} >
                    <Button variant="text" fullWidth className='my-2' onClick={() => setForm('registro')}> <p className='text-black '>¿Aún no tienes usuario?&ensp;&ensp;</p>Registrate</Button>
                  </Grid>

                </Grid>
              )}
            {form === 'registro' && (
              <Grid container item xs={12} justifyContent={'center'} alignItems={'center'}>
                <Grid xs={12}>
                  <Typography variant="h4" textAlign={'center'}>
                    Registrarse
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <TextField
                    id='fullName'
                    className='my-2'
                    label="Nombre completo"
                    variant="outlined"

                    fullWidth
                    value={registrerForm.fullName}
                    onChange={onChangeInput}
                    error={auxiliarTextRegistrerForm.fullName ? true : false}
                    helperText={auxiliarTextRegistrerForm.fullName}
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    className='my-2'
                    label="Correo"
                    variant="outlined"
                    fullWidth
                    type='email'
                    id='email'
                    value={registrerForm.email}
                    onChange={onChangeInput}
                    error={auxiliarTextRegistrerForm.email ? true : false}
                    helperText={auxiliarTextRegistrerForm.email}
                  />
                </Grid>
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
                <Grid xs={12}>
                  <Button variant="contained" className='my-2' onClick={registerUser} fullWidth disabled={waiting} endIcon={waiting && <CircularProgress />}>Registarte</Button>
                </Grid>
                <Grid xs={12}>
                  <Button variant="text" className='my-2' onClick={() => setForm('ingreso')}>¿Ya tienes usuario?</Button>
                </Grid>
              </Grid>
            )
            }
            {
              form === 'newPassword' && (
                <Grid container item xs={12} justifyContent={'center'} alignItems={'center'}>
                  <Grid xs={12}>
                    <Typography variant="h4" textAlign={'center'}>
                      Cambiar contraseña
                    </Typography>
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      className='my-2'
                      label="Correo"
                      variant="outlined"
                      fullWidth
                      type='email'
                      id='email'
                      value={registrerForm.email}
                      onChange={onChangeInput}
                      error={auxiliarTextRegistrerForm.email ? true : false}
                      helperText={auxiliarTextRegistrerForm.email}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Button variant="contained" className='my-2' onClick={sendMail} fullWidth>Enviar</Button>
                  </Grid>
                  <Grid xs={12} container justifyContent={'center'}>
                    <Button variant="text" className='my-2' onClick={() => setForm('ingreso')}>¿Ya tienes usuario?</Button>
                  </Grid>
                </Grid>
              )
            }
          </Grid>

        </Grid>
        <Grid xs={0} md={9} className='hidden sm:block'>
          <div className=' ml-10 mt-10'>
            <h2 className='text-3xl font-bold font-mono'>my-drive esta aquí</h2>
            <p className='text-xl font-light font-mono w-72 mt-10'>Guarda todo tus archivos en un solo lugar</p>
          </div>

        </Grid>
      </Grid>
      <MainAlert handleClose={() => { setOpenMainAlert(false); setMainAlertMessage(''); setMainAlertType('error') }} message={mainAlertMessage} open={openMainALert} type={mainAlertType} />
    </section>
  </main>)
}