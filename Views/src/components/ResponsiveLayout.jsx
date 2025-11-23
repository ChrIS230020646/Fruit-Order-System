import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import Stack from '@mui/material/Stack';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import PersonIcon from '@mui/icons-material/Person';
import NatureIcon from '@mui/icons-material/Nature';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupsIcon from '@mui/icons-material/Groups';
import CompareIcon from '@mui/icons-material/Compare';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LogoutIcon from '@mui/icons-material/Logout';
import MyOrders from './Order/Orderlist.jsx';
import Profile from './profile/profile.jsx';
import Yield from './Yield/Yield.jsx';
import PartitionOrders from './PartitionOrders/PartitionOrders.jsx';
import RequestBorrow from './RequestBorrow/RequestBorrow.jsx';
import BorrowConfirm from './borrowConfirm/BorrowConfirm.jsx';
import FruitInformation from './fruitinformation/fruitInformation.jsx';
import AddStaffDialog from './addStaff/AddStaffDialog.jsx';
import StaffManagement from './StaffList/StaffManagement.jsx';
import DeliveriesTable from './Deliverieslist/deliverieslist.jsx';
import AddDeliveries from './AddDeliveries/addDeliveries.jsx';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddInventory from './AddInventory/addInventory.jsx'
import AddFruit from './addFruit/addFruit.jsx'
import getEmail from './DataSet/getemail';
import utils from '../utils/auth';
import GetApi from './GetAPI/Getapi';

const defaultOnLogout = () => {
  console.warn('onLogout function not provided');
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

const LogoutControl = ({ onLogout = defaultOnLogout }) => {
  const handleLogout = () => {
    getEmail.clearEmail();
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box
      component="div"
      onClick={handleLogout}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <LogoutIcon sx={{ mr: 2 }} />
      <Typography color="text.primary">Logout</Typography>
    </Box>
  );
};

LogoutControl.propTypes = {
  onLogout: PropTypes.func,
};

function AppProviderBasic(props) {
  const { window } = props;
  const router = useDemoRouter('/page');
  const [userJob, setUserJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  
  React.useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authStatus = await utils.checkAuthStatus();
        if (authStatus.success && authStatus.isLoggedIn) {
          const userJson = await fetch(`${GetApi.api}/staff/information/${authStatus.email}`, {
            credentials: 'include'
          });
          
          if (userJson.ok) {
            const userData = await userJson.json();
            console.log('Staff information:', userData);
            
            if (userData.staff && userData.staff.job) {
              setUserJob(userData.staff.job);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  
  const getNavigation = () => {
    const navigation = [
      {
        kind: 'header',
        title: 'Personal',
      },
      {
        segment: 'profile',
        title: 'My Profile',
        icon: <PersonIcon />,
      },
      {
        kind: 'header',
        title: 'Production',
      },
      {
        segment: 'my-production',
        title: 'Report Form',
        icon: <BarChartIcon />,
      },
      {
        kind: 'header',
        title: 'Partition',
      },
      {
        segment: 'partitionOrders',
        title: 'Partition Inventory',
        icon: <AnalyticsIcon />,
      },
      {
        kind: 'header',
        title: 'Inventory',
      },
      {
        segment: 'orders',
        title: 'My Inventory',
        icon: <OtherHousesIcon />,
      },
      {
        segment: 'addInventory',
        title: 'Add Inventory',
        icon: <AddShoppingCartIcon />,
      },
    ];
      if (userJob !== 'shop') {
      navigation.push(

      {
        kind: 'header',
        title: 'Trading',
      },
      {
        segment: 'borrowConfirm',
        title: 'Borrow & Confirm',
        icon: <SwapHorizIcon />,
      },
      {
        segment: 'requestBorrow',
        title: 'Request to Borrow',
        icon: <CompareIcon />,
      },
      );
    }

    
    if (userJob === 'manager') {
      navigation.push(
      {
        kind: 'header',
        title: 'Fruit',
      },

      {
        segment: 'fruitInformation',
        title: 'Fruit Information',
        icon: <NatureIcon />,
      },
      {
        segment: 'addfruit',
        title: 'Add Fruit',
        icon: <AddCircleIcon />,
      },
        {
          kind: 'header',
          title: 'Staff',
        },
        {
          segment: 'listStaff',
          title: 'List Staff',
          icon: <HomeRepairServiceIcon />,
        },
        {
          segment: 'addStaff',
          title: 'Add Staff',
          icon: <AddReactionIcon />,
        }
      );
    }

    
    navigation.push(
      {
        kind: 'header',
        title: 'Deliveries',
      },
      {
        segment: 'listDeliveries',
        title: 'List Deliveries',
        icon: <GroupsIcon />,
      },
      {
        segment: 'addDeliveries',
        title: 'Add Deliveries',
        icon: <AddCircleIcon />,
      },
      {
        kind: 'divider',
      },
      {
        segment: 'logout',
        title: 'Logout',
        icon: <LogoutIcon />,
        onClick: (onLogout = defaultOnLogout) => {
          getEmail.clearEmail();
          if (typeof onLogout === 'function') {
            utils.logout();
          } else {
            window.location.reload();
          }
        },
      }
    );

    return navigation;
  };

  const handleLogout = () => {
    console.log('User logged out');
    router.push('/page/logout');
  };

  const handleNavigation = (item) => {
    if (item.segment === 'logout') {
      getEmail.clearEmail();
      if (typeof handleLogout === 'function') {
        handleLogout();
      } else {
        defaultOnLogout(); 
        window.location.reload();
      }
    } else if (item.segment) {
      router.push(`/page/${item.segment}`);
    }
  };

  const demoWindow = window !== undefined ? window() : undefined;

  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="text.primary">Loading...</Typography>
      </Box>
    );
  }

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={getNavigation()}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
          }}
          onNavigationItemClick={handleNavigation}
        >
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}


function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <FreeBreakfastIcon fontSize="large" color="primary" />
      <Typography variant="h6" color="text.primary">fruit company</Typography>
    </Stack>
  );
}

function LogoutPage() {
  utils.logout();
  React.useEffect(() => {
    window.location.href = '/';
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        You have logged out successfully.
      </Typography>
      <Typography variant="body1">
        Redirecting to login page...
      </Typography>
    </Box>
  );
}

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      { pathname === '/profile' ? (
        <Profile />
      ) : pathname === '/my-production' ? (
        <Yield />
      ) : pathname === '/partitionOrders' ? (
        <PartitionOrders />
      ) : pathname === '/orders' ? (
        <MyOrders />
      ) : pathname === '/requestBorrow' ? (
        <RequestBorrow />
      ) : pathname === '/borrowConfirm' ? (
        <BorrowConfirm />
      ) : pathname === '/fruitInformation' ? (
        <FruitInformation />
      ) : pathname === '/logout' ? (
        <LogoutPage />
      ) : pathname === '/addStaff' ? (
        <AddStaffDialog />
      ) : pathname === '/listStaff' ?(
        <StaffManagement />
      ) : pathname === '/listDeliveries' ?(
        <DeliveriesTable />
      ) : pathname === '/addInventory' ?(
        <AddInventory />
      ) : pathname === '/addfruit' ?(
        <AddFruit />
      ) : pathname === '/addDeliveries' ?(
        <AddDeliveries />
      ) :(
        <Profile />
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

AppProviderBasic.propTypes = {
  window: PropTypes.func,
};

export default AppProviderBasic;