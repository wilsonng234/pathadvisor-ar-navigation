import api from '../api';

const getMeta = async () => {
    const res = await api.get(`/meta`)
        .catch((err) => {
            console.error(err);
            return null;
        });

    return res?.data;
};

export { getMeta };
