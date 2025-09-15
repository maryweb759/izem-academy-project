import api from "./base";

export const dailySubscription = async (token) => {
  const res = await api.put(
    "/subscritpion/dailySubscription",
    {},
    {
      headers: {
        Authorization: `Bearer ` + token,
      },
    }
  );
  return res.data;
};
export const getAllPAiementByUser = async (token) => {
  const res = await api.get("/subscritpion/MyPaiement", {
    headers: {
      Authorization: `Bearer ` + token,
    },
  });
  return res.data;
};

export const paySubscription = async (data, token) => {
  const formData = new FormData();

  // Ajouter les données du formulaire
  formData.append("plan_name", data.plan_name);
  formData.append("payed_amount", data.payed_amount);

  // Vérifier et ajouter le fichier
  if (data.piece_jointe && data.piece_jointe[0]) {
    formData.append("piece_jointe", data.piece_jointe[0]);
  }

  const res = await api.post("/subscritpion/subscribePlan", formData, {
    headers: {
      Authorization: `Bearer ` + token,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllPaiment = async (token, search, etat, page, size) => {
  const res = await api.get(
    `/subscritpion/getAllPaiement?etat=${etat}&search=${search}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ` + token,
      },
    }
  );
  return res.data;
};

export const approvePaiement = async (data, token) => {
  const res = await api.put(`/subscritpion/approvePaiement`, data, {
    headers: {
      Authorization: `Bearer ` + token,
    },
  });
  return res.data;
};
export const getReceiptPaiement = async (id, token) => {
  const res = await api.get(`/subscritpion/getReceiptPaiement/${id}`, {
    headers: {
      Authorization: `Bearer ` + token,
    },
    responseType: "blob",
  });
  return res.data;
};
export const blockUser = async (email, token) => {
  const res = await api.get(`/users/blockUser/${email.email}`, {
    headers: {
      Authorization: `Bearer ` + token,
    },
  });
  return res.data;
};

export const lotterySubscription = async (token) => {
  const res = await api.put(
    "/subscritpion/lotterySubcription",
    {},
    {
      headers: {
        Authorization: `Bearer ` + token,
      },
    }
  );
  return res.data;
};
