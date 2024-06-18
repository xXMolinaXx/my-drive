'use client'
import React, { FormEvent, useEffect, useState, createContext, useContext, Dispatch, SetStateAction } from "react";
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
import { IProduct, IProductState } from "@/common/interface/product.interface";
import { getCart } from "@/common/utils/cart";

interface IContext {
  shoppingCart: IProductState,
  setShoppingCart: Dispatch<SetStateAction<IProductState>>,
}

export const StoreContext = createContext<IContext>({
  setShoppingCart: () => { },
  shoppingCart: {
    amountProducts: 0,
    products: [{
      name: '',
      price: 0,
      category: ''
    }]
  }
});
interface props {
  children: React.ReactNode,
}
function MainLayout({ children }: props) {
  const { shoppingCart } = useContext(StoreContext)
  const router = useRouter()

  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = useState<'register' | 'login' | 'user'>('register')
  const [loadingButton, setLoadingButton] = useState(false)
  const [user, setUser] = useState<any>();
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
    fetch(`${config.backend}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: userIdentification,
        password: password
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
        setUser({ ...data.data, access_token: null })
        setOpen(false)
      }
      else alert(data.message)
    }).catch(e => alert('error en el sistema'))
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
        Authorization: `Bearer ${getCookieToken()}`,
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
            Authorization: `Bearer ${getCookieToken()}`,
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
        }).catch(e => alert('error en el sistema'))
      } else {
        alert(data.message)
      }

    }).catch(e => alert('error en el sistema'))
  }
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setUser(JSON.parse(user))
      if(JSON.parse(user).role === 'admin') router.push('/lcmadminlcm')
    } else router.push('/')
  }, [])
  useEffect(() => {
    const token = getCookieToken();
    if (!token) {
      router.push('/');
    }
  }, [])
  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" >
      <div className="flex justify-center pl-5 pt-5 pr-5">
          <div>
            <Button className="mb-2" variant="outlined" type="submit" fullWidth onClick={()=>{
              router.push(`/userOrders/${user._id}`)
            }}>Mis ordenes</Button>
            <Button className="mb-2" variant="outlined" type="submit" fullWidth onClick={() => {
              localStorage.removeItem('user')
              setUser(null)
              document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              setOpen(false);
              router.push('/')
            }}>Cerrar sesion</Button>
          </div>
      </div>
      <Button variant="contained" className="mx-5 mt-5" onClick={toggleDrawer(false, 'login')}>Cerrar</Button>
    </Box>
  );
  return (
    < >
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
              <Image src="/LCM.png" alt="logo" width={100} height={100} onClick={() => router.push('/catalog')} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

              </Typography>
              {user ? (<><Button color="inherit" onClick={toggleDrawer(true, 'user')}>{user.fullName}</Button>
                <Badge badgeContent={shoppingCart.amountProducts} color="warning">
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

export default function MyApp({ children }: any) {
  const [shoppingCart, setShoppingCart] = useState<IProductState>({
    products: [{
      name: '',
      price: 0,
      category: '',
      amount: 0,
    }],
    amountProducts: 0,
  })
  useEffect(() => {
    const cart = getCart();
    let productAmount = 0
    cart.forEach(data => {
      const dataAmount = data.amount || 0
      productAmount = dataAmount + productAmount
    })
    setShoppingCart({ amountProducts: productAmount, products: cart })
  }, [])
  return (
    <StoreContext.Provider value={{
      shoppingCart, setShoppingCart
    }}>
      <MainLayout >{children}</MainLayout>
    </StoreContext.Provider>
  )
}