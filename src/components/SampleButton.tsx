import React from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import { Add, Delete, Edit, LocalHospital } from '@mui/icons-material';

const SampleButton: React.FC = () => {
  const handleClick = (buttonType: string) => {
    alert(`${buttonType} butonuna tıkladınız!`);
  };

  return (
    <Stack 
      spacing={2} 
      direction="row" 
      alignItems="center"
      sx={{ padding: 2 }}
    >
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => handleClick('Randevu Al')}
        startIcon={<LocalHospital />}
      >
        Randevu Al
      </Button>

      <Button 
        variant="outlined" 
        color="success"
        onClick={() => handleClick('Ekle')}
        startIcon={<Add />}
      >
        Yeni Ekle
      </Button>

      <Button 
        variant="text" 
        color="warning"
        onClick={() => handleClick('Düzenle')}
        startIcon={<Edit />}
      >
        Düzenle
      </Button>

      <Tooltip title="Bu işlem geri alınamaz">
        <Button 
          variant="contained" 
          color="error"
          onClick={() => handleClick('Sil')}
          startIcon={<Delete />}
        >
          Sil
        </Button>
      </Tooltip>
    </Stack>
  );
};

export default SampleButton; 