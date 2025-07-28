import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { graphViewer } from './components/GraphViewer';

function App() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{
        display: 'flex',
        height: '90vh',
        alignItems: 'stretch',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>{graphViewer}</Box>
      <Box
        sx={{
          width: { xs: 'auto', sm: '300px' },
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        <Paper elevation={3} sx={{ padding: 1 }}>
          <Typography variant='h6'>Control Panel</Typography>
        </Paper>
      </Box>
    </Stack>
  );
}

export default App;
