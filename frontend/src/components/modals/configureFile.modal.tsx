import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { IFiles, IuserAccess } from '@/common/interface/files/files.interface';
import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { getCookieToken } from '@/common/utils/getCookieToken';
import { config } from '@/common/configs/config';
import { toast } from 'react-toastify';
interface prop {
  open: boolean,
  onClose: () => void
  file: IFiles
  reload : ()=>void
}
export default function ConfigureFile({ onClose, open, file, reload }: prop) {
  const [isPublic, setisPublic] = useState<'si' | 'no'>()
  const [emailInput, setemailInput] = useState('')
  const [usersAccess, setUsersAccess] = useState<IuserAccess[]>([])
  const [loading, setLoading] = useState(false)
  const handleUpdateData = async () => {
    setLoading(true)
    const resp = await fetch(`${config.backend}/files/configurations`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
      body: JSON.stringify({
        mailInvitacion: emailInput, fileId: file._id
      }),
    }).then(data => data.json())
    if (!resp.success) {
      toast.error('Error al subir cambios')
    } else {
      toast.success('actualizado con exito')
      onClose();
      reload();
    }


    setLoading(false)
  }
  const handleDeleteUser = (email: string) => {
    const users = [...usersAccess]
    const index = users.findIndex(el => el.email === email)
    delete users[index];
    setUsersAccess(users);
  }
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setisPublic((event.target as HTMLInputElement).value as 'si' | 'no');
    const isPublic_ = event.target.value === 'si' ? true : false
    const resp = await fetch(`${config.backend}/files/configurations`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
      body: JSON.stringify({
        isPublic: isPublic_, fileId: file._id
      }),
    }).then(data => data.json())
    if (!resp.success) {
      toast.error('Error al subir cambios')
    } else {
      toast.success('actualizado con exito')
      onClose();
      reload();
    }
  };
  useEffect(() => {
    if (file) {
      setisPublic(file.isPublic ? 'si' : 'no')
      setUsersAccess(file.userAccess)
    }

  }, [file])
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          Configuracion de archivo  <Typography noWrap={true}>{file.filename}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <TextField
                label="Añadir persona"
                variant="outlined"
                fullWidth
                value={emailInput}
                onChange={(e) => { setemailInput(e.target.value) }}
              />
              <Button onClick={handleUpdateData} variant='contained' className='mt-2'>
                Agregar
              </Button>
            </div>
            <Grid container className='pt-5 px-2' >

              <Grid xs={12} item>
                <FormControl>
                  <FormLabel className=' font-semibold text-lg'>hacer publico</FormLabel>
                  <RadioGroup
                    value={isPublic}

                    onChange={handleChange}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Si" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item container>
                <Grid xs={12}>
                  <p className=' font-semibold text-lg'>Usuarios con acceso</p>
                </Grid>
                {usersAccess?.length === 0 && (<p>No tienes ningún usuario agregado</p>)}
                {usersAccess?.map(el => (
                  <Grid item container key={`${el.userId}-${el.email}`}>
                    <Grid xs={6} item>
                      {el.email}
                    </Grid>
                    <Grid xs={6} item>
                      <Button onClick={() => handleDeleteUser(el.email)} variant='text'>
                        <CloseIcon />
                      </Button>
                    </Grid>
                  </Grid>
                ))}


              </Grid>
            </Grid>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>

        </DialogActions>
      </Dialog>
    </>
  );
}