'use client'
import React, { FormEvent, useEffect, useState, createContext, useContext, Dispatch, SetStateAction } from "react";
import HomeIcon from '@mui/icons-material/Home';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Collapse, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Tooltip } from "@mui/material";
import Image from "next/image";
import { config } from "@/common/configs/config";
import { getCookieToken } from "@/common/utils/getCookieToken";
import { IProduct, IProductState } from "@/common/interface/product.interface";
import { getCart } from "@/common/utils/cart";
import Link from "next/link";
import { UserLog } from "@/common/interface/users/user.interface";

interface IContext {
  shoppingCart: IProductState,
  setShoppingCart: Dispatch<SetStateAction<IProductState>>,
  user: UserLog,
  setUser: Dispatch<SetStateAction<any>>,
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
  },
  user: {
    _id: '',
    access_token: '',
    fullName: '',
    role: '',
    store: '',
    userIdentification: '',
    yearBorn: 0
  },
  setUser: () => { }
});
interface props {
  children: React.ReactNode,
}
function MainLayout({ children }: props) {
  const { shoppingCart, user, setUser } = useContext(StoreContext)
  const router = useRouter()

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = useState<'register' | 'login' | 'user'>('register')
  const [loadingButton, setLoadingButton] = useState(false)

  const toggleDrawer = (newOpen: boolean, PFormType: 'register' | 'login' | 'user') => () => {
    setOpenDrawer(newOpen);
    setFormType(PFormType);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

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
          <Typography variant="h5" noWrap>{user && user.fullName}</Typography>
          <Button className="mb-2" variant="outlined" type="submit" fullWidth onClick={() => {
            router.push('/catalog')
          }}>Inicio</Button>
          <Button className="mb-2" variant="outlined" type="submit" fullWidth onClick={() => {
            router.push(`/userOrders/${user._id}`)
          }}>Mis ordenes</Button>
          <Button className="mb-2" variant="outlined" type="submit" fullWidth onClick={() => {
            localStorage.removeItem('user')
            setUser(null)
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            setOpen(false);
            router.push('/')
          }}>Cerrar sesión</Button>
        </div>
      </div>

    </Box>
  );
  return (
    < >
      <nav>
        <Box sx={{ flexGrow: 1 }}>
          <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false, 'login')}>
            {DrawerList}
          </Drawer>
          <AppBar position="fixed">
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
              <MenuIcon sx={{ display: { xs: "block", sm: "none" } }} className="mr-5" onClick={toggleDrawer(true, 'user')} />

              <Image src="/LCM.png" alt="logo" width={100} height={100} onClick={() => router.push('/catalog')} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

              </Typography>
              {/* {user && (<>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button variant="contained" color="secondary" className="mx-1" onClick={() => { setOpen(!open) }}>
                    {user.fullName}
                    <PersonIcon />
                  </Button>
                  <Collapse in={open} className="absolute  z-10 mt-4 ">
                    <Paper elevation={3} className="bg-blue-500 rounded-md text-white">
                      <List >
                        <ListItem>
                          <ListItemButton onClick={() => {
                            router.push(`/userOrders/${user._id}`)
                          }}>
                            <ListItemIcon>
                              <ShoppingCartIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText primary="Mis ordenes" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem>
                          <ListItemButton onClick={() => {
                            localStorage.removeItem('user')
                            setUser(null)
                            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                            setOpen(false);
                            router.push('/')
                          }}>
                            <ListItemIcon>
                              <LogoutIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar sesión" />
                          </ListItemButton>
                        </ListItem>
              
                      </List>
                    </Paper>

                  </Collapse>
                </Box>

                
              </>
              )} */}
              <p className="hidden sm:block">
                {user?.fullName}
              </p>
              <Badge badgeContent={shoppingCart.amountProducts} className="mx-1" color="warning">
                <Button variant="text" className="text-white" onClick={() => router.push('/shoppingCart')}>
                  <ShoppingCartIcon />
                </Button>

              </Badge>
            </Toolbar>
          </AppBar>
        </Box>
      </nav>
      <main className="min-h-screen">
        <Paper elevation={1} className="h-full fixed rounded-none pt-24 w-16 flex justify-center hidden sm:block">
          <div>
            <Tooltip title="Catalogo">
              <Button className="mb-5" variant="text" onClick={() => router.push('/catalog')}>

                <HomeIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Cerrar sesión">
              <Button className="mb-5" variant="text" onClick={() => {
                localStorage.removeItem('user')
                setUser(null)
                document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                setOpen(false);
                router.push('/')
              }}>
                <LogoutIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Mis ordenes">
              <Button className="mb-5" variant="text" onClick={() => {
                router.push(`/userOrders/${user._id}`)
              }}>
                <ShoppingCartIcon />
              </Button>
            </Tooltip>
          </div>

        </Paper>
        <div className="pt-16  px-4  sm:px-32" >
          {children}
        </div>

      </main>
      <footer className=" bg-blue-500 pt-5 px-5 pb-5 ">
        <Grid container justifyContent={"center"} spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="white">Oficinas principales</Typography>
            <Typography variant="body1" color="white">Tegucigalpa</Typography>
            <Typography variant="body1" color="white">Laboratorios centro medico la granja</Typography>
            <Typography variant="body1" color="white">Telefono: falta agregar</Typography>
          </Grid>
          <Grid item md={4} justifyContent={"center"}>
            <Image className="bg-white rounded-xl" src="/LCM.png" alt="logo" width={200} height={200} onClick={() => router.push('/catalog')} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" color="white">Síguenos en: </Typography>
            <Link href='https://chakra-ui.com' className="text-white">
              <FacebookIcon /> Facebook
            </Link>
            <br />
            <Link href='https://chakra-ui.com' className="text-white">
              <InstagramIcon /> Instagram
            </Link>
          </Grid>
        </Grid>

      </footer>
    </>
  );
}

export default function MyApp({ children }: any) {
  const router = useRouter()
  const [shoppingCart, setShoppingCart] = useState<IProductState>({
    products: [{
      name: '',
      price: 0,
      category: '',
      amount: 0,
    }],
    amountProducts: 0,
  })
  const [user, setUser] = useState<any>();
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
    const user = localStorage.getItem('user')
    const token = getCookieToken();
    if (user && token) {
      setUser(JSON.parse(user))
      if (JSON.parse(user).role === 'admin') router.push('/lcmadminlcm')
    } else router.push('/')
  }, [])
  return (
    <StoreContext.Provider value={{
      shoppingCart, setShoppingCart, user, setUser
    }}>
      <MainLayout >{children}</MainLayout>
    </StoreContext.Provider>
  )
}