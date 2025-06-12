import React from 'react';
import { 
  Alert, 
  Box, 
  Typography, 
  Chip, 
  Stack,
  CircularProgress 
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Sync,
  Api 
} from '@mui/icons-material';
import { useGetHastalarQuery } from '../store/apiSlice';

const ApiStatus: React.FC = () => {
  const { data, error, isLoading, isFetching, isSuccess } = useGetHastalarQuery();

  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: <CircularProgress size={20} />,
        text: 'API verisi yükleniyor...',
        color: 'info' as const,
        severity: 'info' as const
      };
    }

    if (error) {
      return {
        icon: <Error />,
        text: 'API bağlantı hatası',
        color: 'error' as const,
        severity: 'error' as const
      };
    }

    if (isSuccess && data) {
      return {
        icon: <CheckCircle />,
        text: `API bağlantısı başarılı - ${data.length} hasta verisi yüklendi`,
        color: 'success' as const,
        severity: 'success' as const
      };
    }

    return {
      icon: <Api />,
      text: 'API durumu belirsiz',
      color: 'default' as const,
      severity: 'warning' as const
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity={statusInfo.severity}
        icon={statusInfo.icon}
        sx={{ 
          '& .MuiAlert-message': { 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%' 
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography variant="body2">
            {statusInfo.text}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
            {isFetching && !isLoading && (
              <Chip 
                icon={<Sync />} 
                label="Senkronize ediliyor" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
            
            <Chip 
              label="RTK Query" 
              size="small" 
              color={statusInfo.color}
              variant="filled"
            />
            
            <Chip 
              label="JsonPlaceholder API" 
              size="small" 
              color="secondary"
              variant="outlined"
            />
          </Stack>
        </Box>
      </Alert>
    </Box>
  );
};

export default ApiStatus; 