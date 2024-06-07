'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Drawer, TextField } from "@mui/material";
import Image from "next/image";

interface props {
  children: React.ReactNode,
}
export default function MainLayout({ children }: props) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = useState<'register' | 'login' | 'user'>('register')

  const toggleDrawer = (newOpen: boolean, PFormType: 'register' | 'login' | 'user') => () => {
    setOpen(newOpen);
    setFormType(PFormType);
  };
  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false, 'login')}>
      <div className="flex justify-center pl-5 pt-5 pr-5">
        {formType === 'login' && (<form action="">
          <Typography align="center" variant="h6">INGRESO</Typography>
          <TextField className="mb-2" id="username" type="text" label="usuario" variant="outlined" fullWidth />
          <TextField className="mb-2" id="password" type="password" label="contraseña" variant="outlined" fullWidth />
          <Button variant="outlined" type="submit" fullWidth>Ingresar</Button>
        </form>)}
        {formType === 'register' && (<form action="">
          <Typography align="center" variant="h6">REGRISTO</Typography>
          <TextField className="mb-2" id="username" type="text" label="nombre de usuario" variant="outlined" fullWidth />
          <TextField className="mb-2" id="username" type="text" label="nombre completo" variant="outlined" fullWidth />
          <TextField className="mb-2" id="password" type="password" label="contraseña" variant="outlined" fullWidth />
          <Button variant="outlined" type="submit" fullWidth>REGISTRAR</Button>
        </form>)}
        {formType === 'user' && (
          <div>
            <Button className="mb-2" variant="outlined" type="submit" fullWidth>Mis ordenes</Button>
            <Button className="mb-2" variant="outlined" type="submit" fullWidth>Cerrar sesion</Button>
          </div>
        )}
      </div>
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
              <Button color="inherit" onClick={toggleDrawer(true, 'register')}>Registrarse</Button>
              <Button color="inherit" onClick={toggleDrawer(true, 'login')}>Ingresar</Button>
              <Button color="inherit" onClick={toggleDrawer(true, 'user')}>Ricardo Mungia</Button>
              <Badge badgeContent={4} color="warning">
                <ShoppingCartIcon onClick={() => router.push('/shoppingCart')} />
              </Badge>
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
