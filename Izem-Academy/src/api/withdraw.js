import api from './base'


export const addWithDraw=async(data,token)=>{
    const res = await api.post('/withdraw/addWithDraw', data, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}

export const myWithDraw=async(token)=>{
    const res = await api.get('/withdraw/MyWithDraw', {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}


export const getAllWithDraw=async(token,search,etat,page,size)=>{
    const res = await api.get(`/withdraw/getAllWithDraw?etat=${etat}&search=${search}&page=${page}&size=${size}`,{
		headers: {
			  Authorization: `Bearer `+token
			},
		  })
	return res.data
}


export  const reponseWithDraw=async(data,token)=>{
	const res = await api.put(`/withdraw/reponseWithDraw`,data,{
		headers: {
			  Authorization: `Bearer `+token
			},
		  })
	return res.data
}  