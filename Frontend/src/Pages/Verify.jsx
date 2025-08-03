import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const {navigate,token,setCartItems,backendUrl} = useContext(ShopContext)
    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    
    const verifyPaymnet = async()=>{
        try {
            if(!token){
                return null;
            }
            const session_id = searchParams.get('session_id');
            const response = await axios.post(backendUrl+'/api/order/verifyStripe', {
            success: searchParams.get('success') === 'true',
            session_id
            }, {
            headers: { token }
            });
            if(response.data.success){
                setCartItems({});
                navigate('/orders')
            }else{
                navigate('/cart')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        verifyPaymnet();
    },[token])

  return (
    <div>
      
    </div>
  )
}

export default Verify
