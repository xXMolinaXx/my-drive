'use client'
import { useState } from "react";
import { Button, Card, CardActions, CardContent, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Pagination, Paper, TextField, Typography } from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";



export default function AdminLogin() {
  const [searchWord, setSearchWord] = useState('')
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(25)
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(0);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  return (
    <div>
      {/* <Drawer
        className="w-30 bg-red-800s"
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                asd
              </ListItemIcon>
              <ListItemText primary="ada" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer> */}
      <div className="pl-36 pt-5 pr-5 pb-5 ">
        <Paper elevation={3} className="min-h-screen p-5">
          <div className="mb-5">
            <TextField className="w-72"  label="Buscar por nombre o identidad" variant="outlined" onChange={(e) => {
              setSearchWord(e.target.value)
            }} onKeyDown={e => {
              if (e.key === 'Enter') {
                alert('buscando')
              }
            }} InputProps={{
              endAdornment: <Button className="mx-1" variant="contained" onClick={() => {
                alert('buscando')
              }}>Buscar</Button>,

            }} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Fecha de inicio" className="mx-1" />
              <DatePicker label="Fecha de Final" className="mx-1" />
            </LocalizationProvider>
          </div>

          <Grid container sm={12} md={6} lg={4}>
            <Grid item>
              <Card >
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    kenny Jared Molina 0801199724466
                  </Typography>
                  <Typography variant="h5" component="div">
                    Pagada
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Total a pagar
                  </Typography>
                  <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained">Editar</Button>
                </CardActions>
              </Card></Grid>
            <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />
          </Grid>

        </Paper>

      </div>

    </div>
  )
}