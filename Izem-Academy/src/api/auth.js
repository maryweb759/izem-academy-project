import api from './base'

export const signIn = async (data) => {
	const res = await api.post('/auth/signIn', data, {
		headers: {
		'Content-Type': 'application/json', 
		},
	})

	return res.data
}

export const logout=async(token)=>{
    const res = await api.post('/users/logout', null,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
	})
    return res.data

}

export const signUp=async(data)=>{
    const res = await api.post('/auth/signUp',data, {
        headers: {
            'Content-Type': 'application/json', 
        },
	})
    return res.data
}

export const activeAccount = async (token) => {
	try {
	const res = await api.get(`/auth/activeAccount?token=${token}`);
	return res.data;
	} catch (error) {
		throw error;
	}
	
};

export const demandeRenitialisation=async (data)=>{
	const res = await api.put('/auth/renitPasswordRequest',data, {
        headers: {
            'Content-Type': 'application/json', 
        },
	})
    return res.data
}

  
export const renitialiserPassword=async (data)=>{
	const res = await api.put('/auth/modifPassword',data, {
        headers: {
            'Content-Type': 'application/json', 
        },
	})
    return res.data
}
export  const confrmRenitPassword=async(token)=>{
	try {
	const res = await api.get(`/auth/confirmRenitPassword?token=${token}`)
	console.log('res--', res);
	
    return res.data
	} catch (error) {
		console.log("token",token)
		throw error;
	}
	

}

export const refreshToken =async (data)=>{
	const res = await api.put('/auth/refreshToken',data, {
        headers: {
            'Content-Type': 'application/json', 
        },
	})
    return res.data
}