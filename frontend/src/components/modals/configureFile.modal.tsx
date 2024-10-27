import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IFiles } from '@/common/interface/files/files.interface';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { getCookieToken } from '@/common/utils/getCookieToken';
import { config } from '@/common/configs/config';
import { toast } from 'react-toastify';
interface prop {
  open: boolean,
  onClose: () => void
  file: IFiles
}
export default function ConfigureFile({ onClose, open, file }: prop) {
  const [isPublic, setisPublic] = useState<'si' | 'no'>()
  const [loading, setLoading] = useState(false)
  const handleUpdateData = async () => {
    const isPublic_ = isPublic === 'si' ? true : false
    setLoading(true)
    const resp = await fetch(`${config.backend}/files/configurations`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
      body: JSON.stringify({
        isPublic: isPublic_, mailInvitacion: ['kjmolina@live.com'], fileId: file._id
      }),
    }).then(data => data.json())
    if (!resp.success) {
      toast.error('Error al subir cambios')
    }


    setLoading(false)
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setisPublic((event.target as HTMLInputElement).value as 'si' | 'no');
  };
  useEffect(() => {
    if (file) {
      setisPublic(file.isPublic ? 'si' : 'no')
    }

  }, [file])
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Configuracion de archivo  <Typography noWrap={true}>{file.filename}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <TextField id="outlined-basic" label="Añadir persona" variant="outlined" />
            </div>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">hacer publico</FormLabel>
              <RadioGroup
                value={isPublic}

                onChange={handleChange}
              >
                <FormControlLabel value="si" control={<Radio />} label="Si" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
          <Button onClick={handleUpdateData} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}