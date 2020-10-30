import Axios from 'axios';

function getCookie(name = 'access_token') {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

export async function postFormAsync(url, body, config = {}) {
    let response;
    try {
        response = await Axios({
            method: "POST",
            url,
            data: body,
            config,
            headers: {
                'Authorization': 'Bearer ' + getCookie(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        const { status, data } = response;
        return Promise.resolve({ status, data })
    } catch (ex) {
        const { status = 400, data = {} } = ex.response || {};
        return Promise.resolve({ status, data })
    }
}

export async function getAsync(url, param) {
    try {
        const response = await Axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + getCookie(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: param
        })

        return response;
    } catch (ex) {
        const { status = 400, data = {} } = ex.response || {};
        const error = data?.errors || [];
        return { status, data: {}, message: (error[0]?.message || ''), code: (error[0]?.code || 0) }
    }
}

export async function patchAsync(url, data) {
    try {
        let formData = new FormData();
        for (const i in data) {
            formData.append(i, data[i]);
        }
        const response = await Axios.patch(url, data, {
            headers: {
                'Authorization': 'Bearer ' + getCookie(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return response;
    } catch (ex) {
        const { status = 400, data = {}, errors = [] } = ex.response || {};
        const error = data?.errors || [];
        return { status, data: ex.response.data || {}, errors, message: (error[0]?.message || '') }
    }
}

export async function deleteAsync(url) {
    try {
        const response = await Axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + getCookie(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return response;
    } catch (ex) {
        const { status = 400, data = {}, errors = [] } = ex.response || {};
        const error = data?.errors || [];
        return { status, data: ex?.response?.data || {}, errors, message: (error[0]?.message || '') }
    }
}