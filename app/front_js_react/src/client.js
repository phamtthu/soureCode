/* eslint-disable no-console */
/* eslint-disable no-undef */
window.client = (function () {
    const host = 'http://localhost:8080';

    function getProducts(success) {
        return fetch(host + '/api/products', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then(checkStatus).then(parseJSON).then(success)
    }

    function createProduct(data) {
        return fetch(host + '/api/product', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(checkStatus)
    }

    function updateProduct(data) {
        return fetch(host + '/api/product', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(checkStatus)

    }

    function deleteProduct(data) {
        return fetch(host + '/api/product', {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(checkStatus)
    }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            const error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            console.log(error);
            throw error;
        }
    }

    function parseJSON(response) {
        return response.json();
    }

    return {
        createProduct,
        deleteProduct,
        getProducts,
        updateProduct
    };
}());
