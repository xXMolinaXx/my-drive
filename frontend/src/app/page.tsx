'use client'
import React, { useEffect, useState, useContext } from "react";
import MainLayout, { StoreContext } from "@/components/layout/MainLayout";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, Pagination, TextField, Tooltip, Typography } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { config } from "@/common/configs/config";
import { IProduct } from "@/common/interface/product.interface";
import { addToCart } from "@/common/utils/cart";

function Home2() {
  const { setShoppingCart, shoppingCart } = useContext(StoreContext);
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
  const [loadingProducts, setLoadingProducts] = useState(false)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  const handleAddToCart = ({ name = '', price = 0,_id = '' }) => {
    const newShoppingCart = [...shoppingCart.products];
    const exists = newShoppingCart.findIndex(products => products._id === _id )
    console.log(exists);
    if( exists !== -1) {
      return
    }
    newShoppingCart.push(
      {
        name: name,
        price: price,
        category: "",
        amount:1,
        _id
      }
    )
    setShoppingCart({...shoppingCart,
      amountProducts: shoppingCart.amountProducts + 1, products: newShoppingCart
    })
    addToCart({
      name: name,
      price: price,
      category:'',
      _id:_id
    })
  }
  const handleSearchProducts = () => {
    setLoadingProducts(true);
    setProducts([])
    fetch(`${config.backend}/products/${skip}/${limit}/${searchWord}`).then(data => data.json()).then(data => {
      setProducts(data.data?.products || [])
      setAmount(Math.round(data.data?.count / limit))
      setLoadingProducts(false);
    }).catch(e => setLoadingProducts(false))
  }
  useEffect(() => {
    handleSearchProducts()
  }, [skip])



  return (
    
      <div className="px-[20%] mb-14">
        <section className="mt-4 flex">
          <TextField id="search-product" label="Buscar por nombre del producto" variant="outlined" fullWidth onChange={(e) => {
            setSearchWord(e.target.value)
          }} onKeyDown={e => {
            if (e.key === 'Enter') {
              setSkip(0);
              handleSearchProducts();
            }
          }} />
          <Button className="w-3/12 rounded-r-lg" variant="contained" onClick={() => {
            setSkip(0);
            handleSearchProducts();
          }}>Buscar</Button>
          {/* <Button  variant="text" onClick={() => {

            setSearchWord('ninguno')
          }}>Reset</Button> */}
        </section>
        <section className="mt-4 ">
          <Grid container spacing={2} justifyContent="center">
            {loadingProducts ? <CircularProgress /> : products?.map(data => (
              <Grid key={data._id} item xs={12} md={3} lg={3}>
                <CardComponent name={data.name} price={data.price} addToCart={() => handleAddToCart(data)} />
              </Grid>
            ))}
          </Grid>
          <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />
        </section>
      </div>

    
  );
}
export default function Home(){
  return (
    <MainLayout>
      <Home2 />
    </MainLayout>
  )
}
interface PropCard {
  price: number,
  name: string,
  addToCart: () => void
}
function CardComponent({ price = 100, name = 'Productos', addToCart }: PropCard) {
  return (
    <Card className="h-36">
      {/* <CardMedia
        sx={{ height: 140 }}
        image="https://thumbs.dreamstime.com/b/lacertilia-nature-chameleon-soft-focus-phu-soi-dao-national-park-uttaradit-northern-thailand-lacertilia-nature-99048757.jpg"
        title="green iguana"
      /> */}
      <CardContent>
        <Tooltip title={name}>
          <Typography variant="body1" component="div" noWrap={true}>
            {name}
          </Typography>
        </Tooltip>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          L. {price}
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
