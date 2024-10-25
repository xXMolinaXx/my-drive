'use client'
import React, { useEffect, useState, createContext, useContext, Dispatch, SetStateAction } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import Image from "next/image";
import { getCookieToken } from "@/common/utils/getCookieToken";
import { IProductState } from "@/common/interface/product.interface";
import { getCart } from "@/common/utils/cart";
import { UserLog } from "@/common/interface/users/user.interface";


import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import 'react-toastify/dist/ReactToastify.css';
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
            router.push('/catalog?searchWord=ninguno')
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <p className="px-3"> {user?.fullName}</p>
      {/* <MenuItem >Perfil</MenuItem> */}
      <MenuItem onClick={() => {
        localStorage.removeItem('user')
        setUser(null)
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        setOpen(false);
        router.push('/')
      }}>Cerrar session</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {
        localStorage.removeItem('user')
        setUser(null)
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        setOpen(false);
        router.push('/')
      }}>
        <IconButton
          size="large"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Cerrar session</p>
      </MenuItem>
    </Menu>
  );
  return (
    < >
      <nav >
        <AppBar position="static" className="px-5 py-3">
        </AppBar>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" className="bg-white text-black">
            <Toolbar>

              <Image src="/LCM.png" alt="logo" width={100} height={100} onClick={() => router.push('/catalog?searchWord=ninguno')} className="bg-white rounded-xl p-2" />
              <p className="cursor-pointer px-4" onClick={() => router.push('/catalog?searchWord=ninguno')}>Inicio</p>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <TextField
                  className="bg-white rounded-sm border-none my-3 w-3/5"
                  id="search-product"
                  placeholder="Buscar por nombre del producto"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <SearchIcon className="cursor-pointer" onClick={() => {
                      // @ts-ignore
                      router.push(`/catalog?searchWord=${document.querySelector('#search-product').value}`)
                      // setSkip(0);
                      // handleSearchProducts();
                    }} />
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      // @ts-ignore
                      router.push(`/catalog?searchWord=${document.querySelector('#search-product').value}`)
                      // handleSearchProducts();
                    }
                  }} />
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </Box>
        <Box sx={{ flexGrow: 1 }} className=" sm:hidden">
          <AppBar position="static" className="bg-transparent text-black shadow-none ">
            <div className="flex justify-center">
              <TextField
                className="bg-white rounded-sm border-none my-3 mx-5"
                fullWidth
                id="search-product-2"
                placeholder="Buscar por nombre del producto"
                variant="outlined"
                InputProps={{
                  endAdornment: <SearchIcon className="cursor-pointer" onClick={() => {
                    // @ts-ignore
                    router.push(`/catalog?searchWord=${document.querySelector('#search-product-2').value}`)
                    // setSkip(0);
                    // handleSearchProducts();
                  }} />
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    // @ts-ignore
                    router.push(`/catalog?searchWord=${document.querySelector('#search-product-2').value}`)
                    // handleSearchProducts();
                  }
                }}
              />
            </div>

          </AppBar>
        </Box>
        {/* <Box sx={{ flexGrow: 1 }}>
          <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false, 'login')}>
            {DrawerList}
          </Drawer>
          <AppBar position="fixed">
            <Toolbar>
            
              <MenuIcon sx={{ display: { xs: "block", sm: "none" } }} className="mr-5" onClick={toggleDrawer(true, 'user')} />

              <Image src="/LCM.png" alt="logo" width={100} height={100} onClick={() => router.push('/catalog')} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

              </Typography>
              <p className="hidden sm:block">
                {user?.fullName}
              </p>

              <Button variant="text" className="text-white" onClick={() => router.push('/shoppingCart')}>
                <Badge badgeContent={shoppingCart.amountProducts} className="mx-1" color="warning">
                  <ShoppingCartIcon />
                </Badge>
              </Button>


            </Toolbar>
          </AppBar>
        </Box> */}
      </nav>
      <main className="min-h-screen">
        {/* <Paper elevation={1} className="h-full fixed rounded-none pt-24 w-16 flex justify-center hidden sm:block">
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

        </Paper> */}
        <div className="pt-5  px-4  sm:px-14" >
          {children}
        </div>

      </main>
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
      <ToastContainer />
    </StoreContext.Provider>
  )
}