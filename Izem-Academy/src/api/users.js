import api from './base'


export const getCurrentUser = async (token) => {
    try {
      const res = await api.get("/users/getCurrentUser", {
        headers: {
          Authorization: `Bearer ` + token
        }
      });
      return res.data;
    } catch (error) {
      throw error; 
    }
  };


  export const getMyplan = async (token) => {
    try {
      const res = await api.get("/users/getMyplan", {
        headers: {
          Authorization: `Bearer ` + token
        }
      });
      return res.data;
    } catch (error) {
      throw error; 
    }
  };
  export const contactUs=async(data,token)=>{
    const res = await api.post('/users/contactUs', data, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data


  }
  export  const  changeMyPassword=async(data,token)=>{
    const res = await api.put('/users/renitPassword', data, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
  }

export const changeRtcwallet=async(data,token)=>{
    const res = await api.put('/users/changeRtcwallet', data, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
  }
export const getAllNotif=async(token)=>{
    const res = await api.get('/users/getAllNotif', {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}
export const getAllMessages=async(token)=>{
  const res = await api.get('/users/getAllMessages', {
  headers: {
          Authorization: `Bearer `+token
  },
})
  return res.data
}

export const getAllFils=async(token)=>{
    const res = await api.get('/users/getAllFils', {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}
export const getAllUserInfo=async(token)=>{
  const res = await api.get('/users/getAllUsersInfo', {
  headers: {
          Authorization: `Bearer `+token
  },
})
  return res.data
}