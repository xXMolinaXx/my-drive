'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Drawer, TextField } from "@mui/material";
import Image from "next/image";
import { config } from "@/common/configs/config";
import { getCookieToken } from "@/common/utils/getCookieToken";

interface props {
  children: React.ReactNode,
}
export default function MainLayout({ children }: props) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = useState<'register' | 'login' | 'user'>('register')
  const [loadingButton, setLoadingButton] = useState(false)
  const [user, setUser] = useState<any>()

  const toggleDrawer = (newOpen: boolean, PFormType: 'register' | 'login' | 'user') => () => {
    setOpen(newOpen);
    setFormType(PFormType);
  };
  const logIn = (e: FormEvent<HTMLFormElement>) => {
    var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
    var followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
    followingDay.toLocaleDateString();

    e.preventDefault()
    let userIdentification = ''
    let password = 'prueba'
    const elementUserIdentification: any = document.querySelector('#username')
    const elementPassword: any = document.querySelector('#password-login')
    if (elementUserIdentification) userIdentification = elementUserIdentification.value
    if (elementPassword) password = elementPassword.value
    console.log(password);
    fetch(`${config.backend}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: userIdentification,
        password: password
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(data => data.json()).then(data => {
      console.log(data);
      if (data.statusCode === 200) {
        document.cookie = `access_token=${data.data.access_token}; expires=${followingDay}`;
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.data, access_token: null })
        );
        setUser({ ...data.data, access_token: null })
        setOpen(false)
      }
      else alert(data.message)
    }).catch(e=>alert('error en el sistema'))
  }
  const registerUser = (e: FormEvent<HTMLFormElement>) => {
    var current = new Date(); //'Mar 11 2015' current.getTime() = 1426060964567
    var followingDay = new Date(current.getTime() + 86400000); // + 1 day in ms
    followingDay.toLocaleDateString();

    e.preventDefault()
    let userIdentification = ''
    let fullName = ''
    let password = ''
    const elementUserIdentification: any = document.querySelector('#user-identification')
    const elementUserName: any = document.querySelector('#user-name')
    const elementPassword: any = document.querySelector('#password')
    if (elementUserIdentification) userIdentification = elementUserIdentification.value
    if (elementUserName) fullName = elementUserName.value
    if (elementPassword) password = elementPassword.value
    fetch(`${config.backend}/users`, {
      method: 'POST',
      body: JSON.stringify({
        userIdentification: userIdentification,
        fullName: fullName,
        password: password
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        fetch(`${config.backend}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
            username: userIdentification,
            password: password
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }).then(data => data.json()).then(data => {
          if (data.statusCode === 200) {
            document.cookie = `access_token=${data.data.access_token}; expires=${followingDay}`;
            localStorage.setItem(
              "user",
              JSON.stringify({ ...data.data, access_token: null })
            );
            setUser({ ...data.data, access_token: null })
            setOpen(false)
          }
          else alert(data.message)
        }).catch(e=>alert('error en el sistema'))
      } else {
        alert(data.message)
      }

    }).catch(e=>alert('error en el sistema'))
  }
  useEffect(()=>{
    const user = localStorage.getItem('user')
    setUser(JSON.parse(user))
  },[])
  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" >
      <div className="flex justify-center pl-5 pt-5 pr-5">
        {formType === 'login' && (<form onSubmit={logIn}>
          <Typography align="center" variant="h6">INGRESO</Typography>
          <TextField className="mb-2" id="username" type="text" label="usuario" variant="outlined" fullWidth />
          <TextField className="mb-2" id="password-login" type="password" label="contraseña" variant="outlined" fullWidth />
          <Button variant="outlined" type="submit" fullWidth>Ingresar</Button>
        </form>)}
        {formType === 'register' && (<form action="" onSubmit={registerUser}>
          <Typography align="center" variant="h6">REGRISTO</Typography>
          <TextField className="mb-2" id="user-identification" type="text" label="nombre de usuario" variant="outlined" fullWidth />
          <TextField className="mb-2" id="user-name" type="text" label="nombre completo" variant="outlined" fullWidth />
          <TextField className="mb-2" id="password" type="password" label="contraseña" variant="outlined" fullWidth />
          <Button variant="outlined" type="submit" fullWidth disabled={loadingButton}>{loadingButton ? 'REGISTRANDO' : 'REGISTRAR'}</Button>
        </form>)}
        {formType === 'user' && (
          <div>
            <Button className="mb-2" variant="outlined" type="submit" fullWidth>Mis ordenes</Button>
            <Button className="mb-2" variant="outlined" type="submit" fullWidth onClick={()=>{
              localStorage.removeItem('user')
              setUser(null)
              document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              setOpen(false);
            }}>Cerrar sesion</Button>
          </div>
        )}

      </div>
      <Button variant="contained" className="mx-5 mt-5" onClick={toggleDrawer(false, 'login')}>Cerrar</Button>
    </Box>
  );
  return (
    <>
      <nav>
        <Box sx={{ flexGrow: 1 }}>
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false, 'login')}>
            {DrawerList}
          </Drawer>
          <AppBar position="static">
            <Toolbar>
              {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
              <Image src="/LCM.png" alt="logo" width={100} height={100} onClick={() => router.push('/')} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

              </Typography>
              {user ? (<><Button color="inherit" onClick={toggleDrawer(true, 'user')}>{user.fullName}</Button>
                <Badge badgeContent={4} color="warning">
                  <ShoppingCartIcon onClick={() => router.push('/shoppingCart')} />
                </Badge></>) : (<>
                  <Button color="inherit" onClick={toggleDrawer(true, 'register')}>Registrarse</Button>
                  <Button color="inherit" onClick={toggleDrawer(true, 'login')}>Ingresar</Button></>)}

            </Toolbar>
          </AppBar>
        </Box>
      </nav>
      <main>
        {children}
      </main>
    </>
  );
}
