import { Navigate, Route, Routes} from 'react-router-dom';
import Home from "./asserts/components/Home";
import Login from './asserts/components/Login';
import Signup from './asserts/components/Signup';
import Dashboard from './asserts/components/Dashboard';
import AddMachine from './asserts/components/AddMachine';
import Users from './asserts/components/Users';
import Machines from './asserts/components/Machines';
import Detailed from './asserts/components/Detailed';
import Turbines from './asserts/components/Turbines';
import AdminDashboard from './asserts/components/AdminDashboard';
import ViewMachine from './asserts/components/User';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WindmillLoader from './asserts/components/WindmillLoader';
import { useLocation } from 'react-router-dom';
import { useLoading } from './asserts/components/LoadingContext';
import Cookies from 'js-cookie';
import VantaNet from "./asserts/components/VantaNet";
import EditTurbine from './asserts/components/EditTurbine';
import Test from './asserts/components/Test';
import ModalManager from './asserts/components/ModalManager';
import AdminLogin from './asserts/components/AdminLogin';







function App() {
  //const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
  const location = useLocation();
  const { loading } = useLoading();

  const usr = Cookies.get('user_id');

  

  return (
      <>
      <VantaNet
  lineColor={0x00e5ff}
  dotColor={0xffffff}
  opacity={0.95}
/>
       {loading && <WindmillLoader />}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
        transition={Bounce}
      />
      <ModalManager/>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={usr?<Navigate replace to="/dashboard" />:<Home/>} />
          <Route path='/login' element={usr?<Navigate replace to="/dashboard" />:<Login/>} />
          <Route path='/adminlogin' element={usr?<Navigate replace to="/dashboard" />:<AdminLogin/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/machines' element={<Machines/>} />
          <Route path='/dashboard' element={usr?<Dashboard/>:<Navigate replace to="/login" />} />
          <Route path='/detailed' element={usr?<Detailed/>:<Navigate replace to="/login" />} />
          <Route path='/turbines' element={<Turbines/>} />
          <Route path='/test' element={<Test/>} />

          <Route path='/admin' element={usr?<Navigate replace to="/dashboard" />:<AdminDashboard/>} />
          <Route path='/admin/users' element={<Users/>} />
          <Route path='/admin/add-mc' element={<AddMachine/>} />

          
          
          <Route path='/view-machine' element={<ViewMachine/>} />
          <Route path='/edit-machine' element={<EditTurbine/>} />




        </Routes>
      </>
   
  );
}
export default App;
