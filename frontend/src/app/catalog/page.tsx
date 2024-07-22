'use client'
import React, { useEffect, useState, useContext } from "react";
import MainLayout, { StoreContext } from "@/components/layout/MainLayout";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, Pagination, TextField, Tooltip, Typography } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { config } from "@/common/configs/config";
import { IProduct } from "@/common/interface/product.interface";
import { addToCart } from "@/common/utils/cart";
import MainAlert from "@/components/alerts/MainAlert";
import { getCookieToken } from "@/common/utils/getCookieToken";

function Catalog2() {
  const { setShoppingCart, shoppingCart, user } = useContext(StoreContext);
  const [products, setProducts] = useState<IProduct[]>([
    {
      category: '',
      name: '',
      price: 0,
      __v: 0,
      _id: '',
    }
  ]);
  const [searchWord, setSearchWord] = useState('ninguno');
  const [skip, setSkip] = useState(0);
  const [limit,] = useState(24);
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setmessageAlert] = useState('');
  const [discount, setDiscount] = useState<'senior' | 'superSenior' | 'normal'>('normal')
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  const handleAddToCart = ({ name = '', price = 0, _id = '' }) => {
    const newShoppingCart = [...shoppingCart.products];
    const exists = newShoppingCart.findIndex(products => products._id === _id)
    if (exists !== -1) {
      return
    }
    newShoppingCart.push(
      {
        name: name,
        price: price,
        category: "",
        amount: 1,
        _id
      }
    )
    setShoppingCart({
      ...shoppingCart,
      amountProducts: shoppingCart.amountProducts + 1, products: newShoppingCart
    })
    addToCart({
      name: name,
      price: price,
      category: '',
      _id: _id
    })
  }
  const handleSearchProducts = () => {
    setLoadingProducts(true);
    setProducts([])
    fetch(`${config.backend}/products/${skip}/${limit}/${searchWord}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        setProducts(data.data?.products || [])
        setAmount(Math.round(data.data?.count / limit))
        setLoadingProducts(false);
      } else {
        setOpenAlert(true);
        setmessageAlert(data.message)
      }
    }).catch(e => {
      setLoadingProducts(false)
      setOpenAlert(true);
      setmessageAlert(e.toString())
    })
  }
  const getTypeDiscount = () => {
    const actualYear = new Date().getFullYear()
    if (actualYear - user?.yearBorn < 60)
      setDiscount('normal');
    else if (actualYear - user?.yearBorn > 80)
      setDiscount('superSenior');
    else setDiscount('senior');

  }
  useEffect(() => {

    handleSearchProducts()
  }, [skip])

  useEffect(() => {
    getTypeDiscount()
  }, [user])

  return (
    <div className="px-4   mb-14">
      <section className="mt-4 flex">
        <TextField
          id="search-product"
          label="Buscar por nombre del producto"
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: <Button className="sm:w-full md:w-1/3 lg:w-1/3 ml-2 rounded-r-lg" variant="contained" onClick={() => {
              setSkip(0);
              handleSearchProducts();
            }}>Buscar</Button>
          }}
          onChange={(e) => {
            setSearchWord(e.target.value)
          }} onKeyDown={e => {
            if (e.key === 'Enter') {
              setSkip(0);
              handleSearchProducts();
            }
          }} />

        {/* <Button  variant="text" onClick={() => {

            setSearchWord('ninguno')
          }}>Reset</Button> */}
      </section>
      <section className="mt-4 ">
        <Grid container spacing={2} justifyContent="center">
          {loadingProducts ? <CircularProgress /> : products?.map(data => (
            <Grid key={data._id} item xs={12} md={3} lg={3}>
              <CardComponent name={data.name} price={data.price} addToCart={() => handleAddToCart(data)} discount={discount} />
            </Grid>
          ))}
        </Grid>
        <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />
      </section>
      <MainAlert handleClose={() => setOpenAlert(false)} message={messageAlert} open={openAlert} type="error" />
    </div>
  );
}
export default function Catalog() {
  return (
    <MainLayout>
      <Catalog2 />
    </MainLayout>
  )
}
interface PropCard {
  price: number,
  name: string,
  addToCart: () => void,
  discount: 'senior' | 'superSenior' | 'normal'
}
function CardComponent({ price = 100, name = 'Productos', addToCart, discount = 'normal' }: PropCard) {
  return (
    <Card >
      <div className="px-3 pt-3">
        <CardMedia
          sx={{ height: 100 }}
          image="/card.webp"
          title="green iguana"
        />
      </div>

      <CardContent>
        <Tooltip title={name}>
          <Typography variant="body1" component="div" color="text.secondary" noWrap={true}>
            {name}
          </Typography>
        </Tooltip>
        <Typography className="font-semibold">
          L.
          {discount === 'normal' && (price)}
          {discount === 'senior' && (price - (price * 0.30))}
          {discount === 'superSenior' && (price - (price * 0.40))}
        </Typography>
        <Typography color={"text.secondary"} variant="body2">
          Descuento / ISV incluido
        </Typography>
      </CardContent>
      <CardActions className="flex justify-center">
        <Tooltip title="Agregar a carrito">
          <Button size="small" variant="contained" onClick={addToCart} ><AddShoppingCartIcon /></Button>
        </Tooltip>

      </CardActions>
    </Card>
  );
} 
