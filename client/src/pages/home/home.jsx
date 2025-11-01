import React from 'react';
import { useSelector } from 'react-redux';
import UserDashboard from '../../components/userDashboard';
import MerchantDashboard from '../../components/merchantDashoard';
import FarmerDashboard from '../../components/farmerDashboard';
import DeliveryboyDashboard from '../../components/deliveryboyDashboard';
const Home = () => {
    const {UserData} = useSelector(state=>state.user)
  return (
    <div>
      {UserData.role=="user"&&<UserDashboard/>}
      {UserData.role=="merchant"&&<MerchantDashboard/>}
      {UserData.role=="farmer"&&<FarmerDashboard/>}
      {UserData.role=="deliveryboy"&&<DeliveryboyDashboard/>}
    </div>
  );
};

export default Home;
